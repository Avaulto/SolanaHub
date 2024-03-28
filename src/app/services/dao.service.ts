import { Injectable } from '@angular/core';
import {PublicKey, Connection, Keypair, clusterApiUrl, Transaction, sendAndConfirmTransaction} from "@solana/web3.js";
import {Governance} from "./realms/index";

@Injectable({
  providedIn: 'root'
})
export class DaoService {

  constructor() { }
  private _governance:Governance;
  public initGovSDK(connection: Connection){
    this._governance = new Governance(connection);
  }
// Fetch all the DAOs the user has voting power in
async  fetchDAOs(user:PublicKey) {
  return await this._governance.getTokenOwnerRecordsFromPubkey(user)
}

// Fetch all the Governance Accounts for the given Realm
async  fetchGovernances(realm:PublicKey) {
  return await this._governance.getGovernanceForRealm(realm)
}

// Fetch all the proposals for the given governance account
async  fetchProposal(governanceAccount:PublicKey) {
  return await this._governance.getProposalsForGovernance(governanceAccount)
}
}
