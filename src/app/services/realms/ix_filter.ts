import { Program } from "@coral-xyz/anchor";
import { TransactionInstruction } from "@solana/web3.js";
import { GovernanceIdl } from "./idl/idl";

export default function ixFilter(
    ix: TransactionInstruction,
    ixName: string,
    governance: Program<GovernanceIdl>
): TransactionInstruction 
{
    // Remove the default discriminator
    ix.data = ix.data.subarray(8);
    
    // Get discriminator from the IDL
    const discrimnant = governance.idl.instructions.find(
        ixs => ixs.name === ixName
    )?.discriminant.value;
    
    if (discrimnant === undefined) {
        throw new Error(`Invalid Instruction Name - ${ixName}`);
    }

    // int to buffer
    const discriminator =  Buffer.from(
        discrimnant.toString(16).padStart(2,"0"), 
        'hex'
    );
    
    // Prepend new discriminator in the ix
    ix.data = Buffer.concat([discriminator, ix.data]);
    
    // Remove the optional keys not provided
    ix.keys = ix.keys.filter(key => key.pubkey.toBase58() !== governance.programId.toBase58());
    
    return ix;
}