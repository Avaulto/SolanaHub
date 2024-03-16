import {StakePoolInstruction, getStakePoolAccount} from "@solana/spl-stake-pool";
import {Connection, Keypair, PublicKey, Signer, StakeAuthorizationLayout, StakeProgram, SystemProgram, TransactionInstruction} from "@solana/web3.js";
import {getAssociatedTokenAccountAddress} from "@marinade.finance/marinade-ts-sdk/dist/src/util";
import {ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync} from 'node_modules/@solana/spl-token';

const STAKE_POOL_PROGRAM_ID = new PublicKey('SP12tWFxD9oJsVWNavTTBZvMbA6gkAmxtVgxdqvyvhY')

export function lamportsToSol(amount) {
    return amount / 10 ** 9
}
export async function findStakeProgramAddress(
    programId: PublicKey,
    voteAccountAddress: PublicKey,
    stakePoolAddress: PublicKey,
  ) {
    const [publicKey] = await PublicKey.findProgramAddress(
      [voteAccountAddress.toBuffer(), stakePoolAddress.toBuffer()],
      programId,
    );
    return publicKey;
  }
export async function findWithdrawAuthorityProgramAddress(
    programId,
    stakePoolAddress,
) {
    const [publicKey] = await PublicKey.findProgramAddress(
        [stakePoolAddress.toBuffer(), Buffer.from('withdraw')],
        programId,
    );
    return publicKey;
}


export function createAssociatedTokenAccountIdempotentInstruction(
    payer,
    associatedToken,
    owner,
    mint,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
    return buildAssociatedTokenAccountInstruction(
        payer,
        associatedToken,
        owner,
        mint,
        Buffer.from([1]),
        programId,
        associatedTokenProgramId
    );
}
function buildAssociatedTokenAccountInstruction(
    payer,
    associatedToken,
    owner,
    mint,
    instructionData,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedToken, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: programId, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        keys,
        programId: associatedTokenProgramId,
        data: instructionData,
    });
}



export async function depositSolIntoSanctum(
    connection,
    stakePoolAddress,
    from,
    lamports,
    destinationTokenAccount,
    referrerTokenAccount,
    depositAuthority,
) {
    const fromBalance = await connection.getBalance(from, 'confirmed');
    if (fromBalance < lamports) {
        throw new Error(
            `Not enough SOL to deposit into pool. Maximum deposit amount is ${lamportsToSol(
                fromBalance,
            )} SOL.`,
        );
    }

    const stakePoolAccount = await getStakePoolAccount(connection, stakePoolAddress);
    const stakePool = stakePoolAccount.account.data;
console.log(stakePool);
    // Ephemeral SOL account just to do the transfer
    const userSolTransfer = new Keypair();
    const signers = [userSolTransfer];
    const instructions = [];

    // Create the ephemeral SOL account
    instructions.push(
        SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: userSolTransfer.publicKey,
            lamports,
        }),
    );

    // Create token account if not specified
    if (!destinationTokenAccount) {
        const associatedAddress = await getAssociatedTokenAccountAddress(stakePool.poolMint, from);
        instructions.push(

            createAssociatedTokenAccountIdempotentInstruction(
                from,
                associatedAddress,
                from,
                stakePool.poolMint,
            ),
        );
        destinationTokenAccount = associatedAddress;
    }

    const withdrawAuthority = await findWithdrawAuthorityProgramAddress(
        STAKE_POOL_PROGRAM_ID,
        stakePoolAddress,
    );

    let depositInstruction = StakePoolInstruction.depositSol({
        stakePool: stakePoolAddress,
        reserveStake: stakePool.reserveStake,
        fundingAccount: userSolTransfer.publicKey,
        destinationPoolAccount: destinationTokenAccount,
        managerFeeAccount: stakePool.managerFeeAccount,
        referralPoolAccount: referrerTokenAccount ?? destinationTokenAccount,
        poolMint: stakePool.poolMint,
        lamports,
        withdrawAuthority,
        depositAuthority,
    });
    depositInstruction.programId = STAKE_POOL_PROGRAM_ID;
    instructions.push(
        depositInstruction,
    );

    return {
        instructions,
        signers,
    };
}

export async function depositStakeIntoSanctum(
    connection: Connection,
    stakePoolAddress: PublicKey,
    authorizedPubkey: PublicKey,
    validatorVote: PublicKey,
    depositStake: PublicKey,
    poolTokenReceiverAccount?: PublicKey,
  ) {
    const stakePool = await getStakePoolAccount(connection, stakePoolAddress);
  
    const withdrawAuthority = await findWithdrawAuthorityProgramAddress(
      STAKE_POOL_PROGRAM_ID,
      stakePoolAddress,
    );
  
    const validatorStake = await findStakeProgramAddress(
      STAKE_POOL_PROGRAM_ID,
      validatorVote,
      stakePoolAddress,
    );
  
    const instructions: TransactionInstruction[] = [];
    const signers: Signer[] = [];
  
    const poolMint = stakePool.account.data.poolMint;
  
    // Create token account if not specified
    if (!poolTokenReceiverAccount) {
      const associatedAddress = getAssociatedTokenAddressSync(poolMint, authorizedPubkey);
      instructions.push(
        createAssociatedTokenAccountIdempotentInstruction(
          authorizedPubkey,
          associatedAddress,
          authorizedPubkey,
          poolMint,
        ),
      );
      poolTokenReceiverAccount = associatedAddress;
    }
  
    instructions.push(
      ...StakeProgram.authorize({
        stakePubkey: depositStake,
        authorizedPubkey,
        newAuthorizedPubkey: stakePool.account.data.stakeDepositAuthority,
        stakeAuthorizationType: StakeAuthorizationLayout.Staker,
      }).instructions,
    );
  
    instructions.push(
      ...StakeProgram.authorize({
        stakePubkey: depositStake,
        authorizedPubkey,
        newAuthorizedPubkey: stakePool.account.data.stakeDepositAuthority,
        stakeAuthorizationType: StakeAuthorizationLayout.Withdrawer,
      }).instructions,
    );
  
    instructions.push(
      StakePoolInstruction.depositStake({
        stakePool: stakePoolAddress,
        validatorList: stakePool.account.data.validatorList,
        depositAuthority: stakePool.account.data.stakeDepositAuthority,
        reserveStake: stakePool.account.data.reserveStake,
        managerFeeAccount: stakePool.account.data.managerFeeAccount,
        referralPoolAccount: poolTokenReceiverAccount,
        destinationPoolAccount: poolTokenReceiverAccount,
        withdrawAuthority,
        depositStake,
        validatorStake,
        poolMint,
      }),
    );
  
    return {
      instructions,
      signers,
    };
  }
  