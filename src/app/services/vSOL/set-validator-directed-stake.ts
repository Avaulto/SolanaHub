import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DirectedStake, directedStakeIdl } from "./directed-stake-idl"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

// When given a wallet, lookup the director PDA
const findDirectorAddress = (authority: PublicKey) => {
    const [key] = PublicKey.findProgramAddressSync(
        [new TextEncoder().encode('director'), authority.toBytes()],
        new PublicKey(directedStakeIdl.address),
    );
    return key;
};

async function getDirected(program: Program<DirectedStake>, authority: PublicKey) {

    const directorAddress = findDirectorAddress(authority);
    const currentDirector = await program.account.director.fetchMultiple([directorAddress]);

    return currentDirector[0]?.stakeTarget;
}

async function setDirected(program: Program<DirectedStake>, authority: PublicKey, validatorVotePubKey: PublicKey) {

    const current = await getDirected(program, authority);

    if(!current) {
        // Create first
        const initDirectorIx = await program.methods
            .initDirector()
            .accounts({
                authority: authority,
                payer: authority,
            })
            .instruction();
        
        await program.methods
            .setStakeTarget()
            .accounts({
                authority: authority,
                stakeTarget: validatorVotePubKey,
            })
            .preInstructions([initDirectorIx])
            .rpc();
    } else {
        // No init is needed
        await program.methods
            .setStakeTarget()
            .accounts({
                authority: authority,
                stakeTarget: validatorVotePubKey,
            })
            .rpc();
    }
}

async function closeDirected(program: Program<DirectedStake>, authority: PublicKey, validatorVotePubKey: PublicKey) {

    await program.methods
    .closeDirector()
    .accounts({
        authority: authority,
        rentDestination: validatorVotePubKey,
    })
    .rpc();
}


  
export async function vSOLdirectStake(wallet, connection, validatorVoteAddress) {

    const provider = new anchor.AnchorProvider(connection, wallet);
    anchor.setProvider(provider);

    const directedStakeProgram = new Program<DirectedStake>(
        directedStakeIdl as unknown as DirectedStake,
        provider,
    )


    // Get which validator a specific wallet is directing to
    // const current = await getDirected(directedStakeProgram, wallet.publicKey);
    // console.log(`Validator directed to by wallet ${wallet.publicKey.toBase58()}: ${current ? current.toBase58() : 'NONE'}`);

    // if(!current) {
        // Set to Nordic Staking
        const validatorVotePubKey = new PublicKey(validatorVoteAddress);
        await setDirected(directedStakeProgram, wallet.publicKey, validatorVotePubKey);
    // }
    // console.log('finish vSOL direct stake');
    
}



