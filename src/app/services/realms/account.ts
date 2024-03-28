import idl from "./idl/gov.json";
import {BorshAccountsCoder} from "@coral-xyz/anchor/dist/cjs/coder/borsh/accounts";
import { GovernanceIdl } from "./idl/idl";
import { PublicKey } from "@solana/web3.js";

const coder = new BorshAccountsCoder(idl as GovernanceIdl);

function deserialize(name: string, data: Buffer) {
    // Prepend 8-byte default discriminator
    const modifiedData = Buffer.concat([Buffer.from("0".repeat(16), "hex"),data]);
    return coder.decodeUnchecked(name, modifiedData)
}

export function voteRecordAccount(
    {proposal, tokenOwnerRecord, programId}:
    {proposal: PublicKey, tokenOwnerRecord: PublicKey, programId: PublicKey}
) {
    const pda = PublicKey.findProgramAddressSync([
        Buffer.from("governance"), 
        proposal.toBuffer(),
        tokenOwnerRecord.toBuffer(),
    ],
        programId
    )

    return {publicKey: pda[0], bump: pda[1]};
}

export function realmConfigAccount({realmAccount, programId}: {realmAccount: PublicKey, programId: PublicKey}) {
    const pda = PublicKey.findProgramAddressSync([
        Buffer.from("realm-config"), 
        realmAccount.toBuffer(),  
    ],
        programId
    )

    return {publicKey: pda[0], bump: pda[1]};
}

export default deserialize;