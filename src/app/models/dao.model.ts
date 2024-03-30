import { PublicKey } from "@solana/web3.js"

export interface Gov{
    name: string
    imgURL: string
    proposals: Proposal[]
}

export interface Proposal{
    title: string
    description: string
    status: string
    expiryDate: Date
    votes: {
        total: number
        for: number
        against:number
    }
}

export interface DAOonChain {
    pubkey: PublicKey
    accountType: {
      tokenOwnerRecordV2: {}
    }
    realm: PublicKey
    governingTokenMint: PublicKey
    governingTokenOwner: PublicKey
    governingTokenDepositAmount: string
    unrelinquishedVotesCount: PublicKey
    outstandingProposalCount: number
    version: number
    reserved: Array<number>
    governanceDelegate: any
    reservedV2: Array<number>
  }
  export interface GovOnChain{
    pubkey: PublicKey
    accountType: {
      governanceV2: {}
    }
    realm: PublicKey
    governedAccount: PublicKey
    reserved1: number
    config: {
      communityVoteThreshold: {
        disabled: {}
      }
      minCommunityWeightToCreateProposal: string
      minTransactionHoldUpTime: number
      votingBaseTime: number
      communityVoteTipping: {
        disabled: {}
      }
      councilVoteThreshold: {
        yesVotePercentage: {
          "0": number
        }
      }
      councilVetoVoteThreshold: {
        yesVotePercentage: {
          "0": number
        }
      }
      minCouncilWeightToCreateProposal: string
      councilVoteTipping: {
        early: {}
      }
      communityVetoVoteThreshold: {
        disabled: {}
      }
      votingCoolOffTime: number
      depositExemptProposalCount: number
    }
    reservedV2: {
      reserved64: Array<number>
      reserved32: Array<number>
      reserved23: Array<number>
    }
    requiredSignatoriesCount: number
    activeProposalCount: string
  }
  
  export interface ProposalOnChain{
    pubkey: PublicKey
    accountType: {
      proposalV2: {}
    }
    governance: PublicKey
    governingTokenMint: PublicKey
    state: {
      defeated: {}
    }
    tokenOwnerRecord: PublicKey
    signatoriesCount: number
    signatoriesSignedOffCount: number
    voteType: {
      singleChoice: {}
    }
    options: Array<{
      label: string
      voteWeight: string
      voteResult: {
        defeated: {}
      }
      transactionsExecutedCount: number
      transactionsCount: number
      transactionsNextIndex: number
    }>
    denyVoteWeight: string
    reserved1: number
    abstainVoteWeight: any
    startVotingAt: any
    unixTimestamp: number
    signingOffAt: string
    votingAt: string
    votingAtSlot: string
    votingCompletedAt: string
    executingAt: any
    closedAt: any
    executionFlags: {
      none: {}
    }
    maxVoteWeight: string
    maxVotingTime: any
    voteThreshold: {
      yesVotePercentage: {
        "0": number
      }
    }
    reserved: Array<number>
    name: string
    descriptionLink: string
    vetoVoteWeight: string
  }
  
export interface DAOInfo {
    symbol: string
    displayName: string
    programId: string
    realmId: string
    bannerImage?: string
    communityMint?: string;
    ogImage: string
    website?: string
    keywords?: string
    twitter?: string
    discord?: string
    shortDescription?: string
    sortRank?: number
  }
  