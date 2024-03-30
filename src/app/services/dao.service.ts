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
  private _governance:Governance;
  public async getOffChainDAOsInfo(): Promise<DAOInfo[]> {
    try {
      const daosRes: DAOInfo[] = await (await fetch("https://app.realms.today/realms/mainnet-beta.json")).json();
      const fixDaoPreFix = daosRes.map(dao => {
        dao.bannerImage = 'https://app.realms.today/' + dao?.bannerImage
        dao.ogImage = 'https://app.realms.today/' + dao?.ogImage
        
        return {
          ...dao
        }
      });
      fixDaoPreFix.push(...this._manualDAOs())
      // const set = daosRes.map(d => d.programId).filter(d => d !== "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw")
      return fixDaoPreFix;
    } catch (error) {
      return []
    }

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

  private _manualDAOs = () => {
      return [
        {
          "symbol": "BLZE",
          "displayName": "SolBlaze",
          "programId": "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw",
          "realmId": "7vrFDrK9GRNX7YZXbo7N3kvta7Pbn6W1hCXQ6C7WBxG9",
          "ogImage": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png",
          "communityMint": "BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA"
        }
    ]
  }
}



//   private _governance: Governance[];
//   private _allDAOs: DAO[] = [];
//   private async _fetchAllDAOs(): Promise<DAO[]> {
//     try {
//       const daosRes: DAO[] = await (await fetch("https://app.realms.today/realms/mainnet-beta.json")).json();
//       const fixDaoPreFix = daosRes.map(dao => {
//         dao.bannerImage = 'https://app.realms.today/' + dao?.bannerImage
//         dao.ogImage = 'https://app.realms.today/' + dao?.ogImage
        
//         return {
//           ...dao
//         }
//       });
//       // const set = daosRes.map(d => d.programId).filter(d => d !== "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw")
//       return fixDaoPreFix;
//     } catch (error) {
//       return []
//     }

//   }
//   public async initGovSDK(connection: Connection): Promise<void> {
//     try {
//       this._allDAOs = await this._fetchAllDAOs()
//       const daosId = [...new Set(this._allDAOs.map(d => d.programId))]
//       this._governance = daosId.map(programId => new Governance(connection, new PublicKey(programId)))
//       console.log(this._governance);
      
//     } catch (e) {
//       console.log(e);

    
//     }
//   }
//   // Fetch all the DAOs the user has voting power in
//   async fetchUserDAOs(user: PublicKey) {
//     try {
//       const govs = this._governance.map(async gov => {
//         return await gov.getTokenOwnerRecordsFromPubkey(user)
//       })
//       const userDAOs = await Promise.all(govs)
//       console.log(userDAOs);
      
//       return userDAOs
//     } catch (error) {
//       console.log(error);
      
//       return []
//     }

//   }

//   // Fetch all the Governance Accounts for the given Realm
//   async fetchGovernances(realm: PublicKey) {

//     try {
//       const govRealms = this._governance.map(async gov => {
//         return await gov.getGovernanceForRealm(realm)
//       })
//       const userRealms = await Promise.all(govRealms)
//       return userRealms
//     } catch (error) {
//       return []
//     }

//   }

//   // Fetch all the proposals for the given governance account
//   async fetchProposal(governanceAccount: PublicKey) {
//     try {
//       const govAccounts = this._governance.map(async acc => {
//         return await acc.getGovernanceForRealm(governanceAccount)
//       })
//       const userGovAccounts = await Promise.all(govAccounts)
//       return userGovAccounts
//     } catch (error) {
//       return []
//     }
//   }
