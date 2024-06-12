import { Injectable } from '@angular/core';
import {PublicKey, Connection, Keypair, clusterApiUrl, Transaction, sendAndConfirmTransaction} from "@solana/web3.js";
// import {Governance} from "./realms/index";
import {   Gov } from '../models/dao.model';
import { UtilService } from './util.service';
@Injectable({
  providedIn: 'root'
})
export class DaoService {

  readonly restAPI = this._utils.serverlessAPI
  constructor(private _utils: UtilService){
   }


  public async getWalletAllProposals(walletOwner: string, communityTokenAddress: string[]):Promise<Gov[]>{

      let allProposalsDao: Gov[] = [];
      try {
        const result = await (await fetch(`${this.restAPI}/api/portfolio/dao`,{
          method:'POST',
          body:JSON.stringify({address:walletOwner, communityTokenAddress})})).json();
        allProposalsDao = result //result.filter(s => poolIncludes.includes(s.poolName.toLowerCase()));
      }
      catch (error) {
        console.error(error);
      }
      return allProposalsDao
    
  }
    
  // public initGovSDK(connection: Connection, programId?: PublicKey){
  //   return new Governance(connection,programId);
  // }
  // Fetch all the DAOs the user has voting power in
  // public async  fetchDAOs(gov: Governance, user:PublicKey):Promise<DAOonChain[]> {
  //   return await gov.getTokenOwnerRecordsFromPubkey(user)
  // }

  // // Fetch all the Governance Accounts for the given Realm
  // public async  fetchGovernance(gov: Governance,realm:PublicKey):Promise<GovOnChain[]> {
  //   return await gov.getGovernanceForRealm(realm)
  // }

  // // Fetch all the proposals for the given governance account
  // public async  fetchProposal(gov:Governance,governanceAccount:PublicKey): Promise<ProposalOnChain[]> {
  //   return await gov.getProposalsForGovernance(governanceAccount)
  // }


}

