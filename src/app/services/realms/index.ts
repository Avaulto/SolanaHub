// import {PublicKey, Connection, Keypair} from "@solana/web3.js";
// import {Program, AnchorProvider } from "@coral-xyz/anchor";
// import {GovernanceIdl} from "./idl/idl";
// import idl from "./idl/gov.json";
// import { DEFAULT_PROGRAM_ID } from "./constant";
// import deserialize, { realmConfigAccount, voteRecordAccount } from "./account";
// import { Pda, ProposalV1, ProposalV2, RealmConfig, Vote } from "./types";
// import ixFilter from "./ix_filter";

// export class Governance {
//     readonly programId: PublicKey;
//     readonly connection: Connection;
//     readonly program: Program<GovernanceIdl>;
//     private readonly _provider: AnchorProvider;

//     constructor(
//         connection: Connection,
//         programId?: PublicKey,
//     ) {
   
        
//         // const wallet = new Wallet(Keypair.generate());
//         this.connection = connection;
//         this.programId = programId ?? DEFAULT_PROGRAM_ID;
//         this._provider = new AnchorProvider(this.connection, null, {commitment: "confirmed"});
//         this.program = new Program<GovernanceIdl>(idl as GovernanceIdl, this.programId, this._provider);
//     }

//     async getTokenOwnerRecordsFromPubkey(
//         user: PublicKey
//     ) {
//         const v2Accounts = await this.getAccounts(user, 65, "J");
//         const v1Accounts = await this.getAccounts(user, 65, "3");

//         let torsV2 = v2Accounts.map(acc => ({
//             pubkey: acc.pubkey,
//             ...deserialize('tokenOwnerRecordV2', acc.account.data)
//         }))

//         let torsV1 = v1Accounts.map(acc => ({
//             pubkey: acc.pubkey,
//             ...deserialize('tokenOwnerRecordV1', acc.account.data)
//         }))

//         return [...torsV2, ...torsV1]
//     }

//     async getTokenOwnerRecordAccount(tokenOwnerRecord: PublicKey) {
//         const account = await this.program.account.tokenOwnerRecordV2.getAccountInfo(tokenOwnerRecord);
//         if (!account) {
//             throw Error("Couldn't find the account.");
//         }

//         try {
//             return deserialize('tokenOwnerRecordV2', account.data);
//         } catch {
//             return deserialize('tokenOwnerRecordV1', account.data);
//         }
//     }

//     async getGovernanceForRealm(realmAddress: PublicKey) {
//         const v2AccountsK = await this.getAccounts(realmAddress, 1, "K")
//         const v2AccountsL = await this.getAccounts(realmAddress, 1, "L")
//         const v2AccountsM = await this.getAccounts(realmAddress, 1, "M")
//         const v2AccountsN = await this.getAccounts(realmAddress, 1, "N")

//         const v1Accounts4 = await this.getAccounts(realmAddress, 1, "4")
//         const v1Accounts5 = await this.getAccounts(realmAddress, 1, "5")
//         const v1AccountsA = await this.getAccounts(realmAddress, 1, "A")
//         const v1AccountsB = await this.getAccounts(realmAddress, 1, "B")

//         const v2Accounts = [...v2AccountsK, ...v2AccountsL, ...v2AccountsM, ...v2AccountsN]
//         const v1Accounts = [...v1Accounts4, ...v1Accounts5, ...v1AccountsA, ...v1AccountsB]
        
//         let governanceV2 = v2Accounts.map(acc => ({
//             pubkey: acc.pubkey,
//             ...deserialize('governanceV2', acc.account.data)
//         }))

//         let governanceV1 = v1Accounts.map(acc => ({
//             pubkey: acc.pubkey,
//             ...deserialize('governanceV1', acc.account.data)
//         }))

//         return [...governanceV2, 
//             ...governanceV1
//         ]
//     }

//     async getRealm(realmAccount: PublicKey) {
//         const account = await this.program.account.realmV2.getAccountInfo(realmAccount);
//         if (!account) {
//             throw Error("Couldn't find the account.");
//         }

//         try {
//             return deserialize('realmV2', account.data);
//         } catch {
//             return deserialize('realmV1', account.data);
//         }
//     }

//     async getRealmConfig(realmAccount: PublicKey): Promise<RealmConfig> {
//         const realmConfig = realmConfigAccount({realmAccount, programId: this.programId}).publicKey

//         const account = await this.program.account.realmConfigAccount.getAccountInfo(realmConfig);
//         if (!account) {
//             throw Error("Couldn't find the account.");
//         }

//         return deserialize('realmConfigAccount', account.data);
//     }

//     async getGovernance(governanceAccount: PublicKey) {
//         const account = await this.program.account.governanceV2.getAccountInfo(governanceAccount);
//         if (!account) {
//             throw Error("Couldn't find the account.");
//         }
//         return deserialize('governanceV2', account.data);
//     }

//     async getProposalsForGovernance(governance: PublicKey) {     
//         const v2Accounts = await this.getAccounts(governance, 1, "F");
//         const v1Accounts = await this.getAccounts(governance, 1, "6");

//         let proposalsV2 = v2Accounts.map(acc => ({
//             pubkey: acc.pubkey,
//             ...deserialize('proposalV2', acc.account.data)
//         }))

//         let proposalsV1 = v1Accounts.map(acc => ({
//             pubkey: acc.pubkey,
//             ...deserialize('proposalV1', acc.account.data)
//         }))
        
//         return [...proposalsV2, ...proposalsV1]
//     }

//     async getProposal(proposal: PublicKey): Promise<ProposalV2 & ProposalV1> {
//         const account = await this.program.account.proposalV2.getAccountInfo(proposal);
//         if (!account) {
//             throw Error("Couldn't find the account.");
//         }
        
//         try {
//             return deserialize('proposalV2', account.data);
//         } catch {
//             return deserialize('proposalV1', account.data);
//         }
//     }


//     async castVoteInstruction(
//         vote: Vote,
//         realmAccount: PublicKey,
//         governanceAccount: PublicKey,
//         proposalAccount: PublicKey,
//         proposalOwnerTokenOwnerRecord: PublicKey,
//         voterTokenOwnerRecord: PublicKey,
//         governanceAuthority: PublicKey,
//         governingTokenMint: PublicKey,
//         payer: PublicKey,
//         voterWeightRecord?: PublicKey,
//         maxVoterWeightRecord?: PublicKey
//     ) {
//         const realmConfig = realmConfigAccount({realmAccount, programId: this.programId}).publicKey
//         const voteRecord = voteRecordAccount({
//             proposal: proposalAccount, 
//             tokenOwnerRecord: voterTokenOwnerRecord,
//             programId: this.programId
//         }).publicKey

//         const defaultIx = await this.program.methods.castVote(vote)
//         .accounts({
//             realmAccount,
//             governanceAccount,
//             proposalAccount,
//             proposalTokenOwnerRecord: proposalOwnerTokenOwnerRecord,
//             voterTokenOwnerRecord,
//             governanceAuthority,
//             governingTokenMint,
//             payer,
//             voterWeightRecord: voterWeightRecord ?? null,
//             maxVoterWeightRecord: maxVoterWeightRecord ?? null,
//             realmConfigAccount: realmConfig,
//             proposalVoteRecord: voteRecord
//         }).instruction()

//         return ixFilter(defaultIx, "castVote", this.program);
//     }

//     async relinquishVoteInstruction(
//         realmAccount: PublicKey,
//         governanceAccount: PublicKey,
//         proposalAccount: PublicKey,
//         tokenOwnerRecord: PublicKey,
//         governingTokenMint: PublicKey,
//         governanceAuthority?: PublicKey,
//         beneficiaryAccount?: PublicKey
//     ) {
//         const voteRecord = voteRecordAccount({
//             proposal: proposalAccount, 
//             tokenOwnerRecord,
//             programId: this.programId
//         }).publicKey
    
//         const defaultIx = await this.program.methods.relinquishVote()
//         .accounts({
//             realmAccount,
//             governanceAccount,
//             proposalAccount,
//             tokenOwnerRecord,
//             governanceAuthority: governanceAuthority ?? null,
//             governingTokenMint,
//             beneficiaryAccount: beneficiaryAccount ?? null,
//             proposalVoteRecord: voteRecord
//         }).instruction()
    
//         return ixFilter(defaultIx, "relinquishVote", this.program);
//     }

//     getTokenOwnerRecordAddress(
//         {realmAccount, governingTokenMintAccount, governingTokenOwner} : 
//         {realmAccount: PublicKey, governingTokenMintAccount: PublicKey, governingTokenOwner: PublicKey}): Pda
//     {
//         const pda = PublicKey.findProgramAddressSync([
//             Buffer.from("governance"), 
//             realmAccount.toBuffer(),
//             governingTokenMintAccount.toBuffer(),
//             governingTokenOwner.toBuffer()
//         ],
//             this.programId
//         )

//         return {publicKey: pda[0], bump: pda[1]};
//     }

//     getVoterRecordAddress(
//         {proposal, tokenOwnerRecord}:
//         {proposal: PublicKey, tokenOwnerRecord: PublicKey}
//     ): Pda {
//         const pda = PublicKey.findProgramAddressSync([
//             Buffer.from("governance"), 
//             proposal.toBuffer(),
//             tokenOwnerRecord.toBuffer(),
//         ],
//             this.programId
//         )

//         return {publicKey: pda[0], bump: pda[1]};
//     }

//     async getAccounts(address: PublicKey, customOffset: number, customByte: string) {
//         return await this.connection.getProgramAccounts(this.programId, {
//             filters: [
//                 {
//                     memcmp: {
//                         offset: 0,
//                         bytes: customByte
//                     }
//                 }, {
//                     memcmp: {
//                         offset: customOffset,
//                         bytes: address.toBase58()
//                     }
//                 }
//             ]
//         })
//     } 
// }