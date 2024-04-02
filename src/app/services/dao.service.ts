import { Injectable } from '@angular/core';
import {PublicKey, Connection, Keypair, clusterApiUrl, Transaction, sendAndConfirmTransaction} from "@solana/web3.js";
import {Governance} from "./realms/index";
import {  DAOInfo, DAOonChain, GovOnChain, ProposalOnChain } from '../models/dao.model';
@Injectable({
  providedIn: 'root'
})
export class DaoService {

  constructor() {
   }

  public async getOffChainDAOsInfo(): Promise<DAOInfo[]> {
    try {
      const DAOsRes: DAOInfo[] = await (await fetch("https://app.realms.today/realms/mainnet-beta.json")).json();
      const addDaoURLPrefix = DAOsRes.map(dao => {
        dao.bannerImage = 'https://app.realms.today/' + dao?.bannerImage
        dao.ogImage = 'https://app.realms.today/' + dao?.ogImage
        
        return {
          ...dao
        }
      });
      addDaoURLPrefix.push(...this._manualDAOs())
      return addDaoURLPrefix;
    } catch (error) {
      return []
    }
  }
  private _manualDAOs = () => {
    return [
      {
        "symbol": "BLZE",
        "displayName": "SolBlaze",
        "programId": "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw",
        "realmId": "7vrFDrK9GRNX7YZXbo7N3kvta7Pbn6W1hCXQ6C7WBxG9",
        "ogImage": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png",
        "communityMint": "BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA"
      },
      {
        "symbol": "MNDE",
        "displayName": "Marinade",
        "programId": "GovMaiHfpVPw8BAM1mbdzgmSZYDw2tdP32J2fapoQoYs",
        "realmId": "899YG3yk4F66ZgbNWLHriZHTXSKk9e1kvsKEquW7L6Mo",
        "ogImage": "https://app.realms.today/realms/MNDE/img/mnde_logo.png",
        "communityMint": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        },
  ]
}
  public initGovSDK(connection: Connection, programId?: PublicKey){
    return new Governance(connection,programId);
  }
  // Fetch all the DAOs the user has voting power in
  public async  fetchDAOs(gov: Governance, user:PublicKey):Promise<DAOonChain[]> {
    return await gov.getTokenOwnerRecordsFromPubkey(user)
  }

  // Fetch all the Governance Accounts for the given Realm
  public async  fetchGovernance(gov: Governance,realm:PublicKey):Promise<GovOnChain[]> {
    return await gov.getGovernanceForRealm(realm)
  }

  // Fetch all the proposals for the given governance account
  public async  fetchProposal(gov:Governance,governanceAccount:PublicKey): Promise<ProposalOnChain[]> {
    return await gov.getProposalsForGovernance(governanceAccount)
  }


}

