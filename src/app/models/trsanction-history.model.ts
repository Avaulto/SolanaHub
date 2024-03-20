export interface TransactionHistoryShyft {
    success: boolean
    message: string
    result: historyResultShyft[]
  }
  

  export interface historyResultShyft {
    timestamp: string
    fee: number
    fee_payer: string
    signers: Array<string>
    signatures: Array<string>
    protocol: {
      address: string
      name: string
    }
    type: string
    status: string
    actions: Array<{
      info: {
        tree_authority?: string
        merkle_tree?: string
        payer?: string
        nft_address?: string
        owner?: string
        update_authority?: string
        nft_metadata?: {
          name: string
          symbol: string
          uri: string
          sellerFeeBasisPoints: number
          primarySaleHappened: boolean
          isMutable: boolean
          editionNonce?: number
          tokenStandard: {
            nonFungible: {}
          }
          collection?: {
            verified: boolean
            key: string
          }
          uses: any
          tokenProgramVersion: {
            original: {}
          }
          creators: Array<{
            address: string
            verified: boolean
            share: number
          }>
        }
        swapper?: string
        tokens_swapped?: {
          in: {
            token_address: string
            name: string
            symbol: string
            image_uri: string
            amount: number
          }
          out: {
            token_address: string
            name: string
            symbol: string
            image_uri: string
            amount: number
          }
        }
        swaps?: Array<{
          liquidity_pool_address: string
          name: string
          source: string
          in: {
            token_address: string
            name: string
            symbol: string
            image_uri: string
            amount: number
          }
          out: {
            token_address: string
            name: string
            symbol: string
            image_uri: string
            amount: number
          }
        }>
        slippage_in_percent?: number
        quoted_out_amount?: number
        slippage_paid?: number
        amount?: number
        receiver?: string
        sender?: string
        receiver_associated_account?: string
        token_address?: string
        authorized?: {
          staker: string
          withdrawer: string
        }
        lockup?: {
          custodian: string
          epoch: number
          unixTimestamp: number
        }
        rentSysvar?: string
        stakeAccount?: string
        clockSysvar?: string
        stakeAuthority?: string
        stakeConfigAccount?: string
        stakeHistorySysvar?: string
        voteAccount?: string
        destination?: string
        lamports?: number
        withdrawAuthority?: string
        receiver_address?: string
        tokenProgram?: string
        programAuthority?: string
        userTransferAuthority?: string
        sourceTokenAccount?: string
        programSourceTokenAccount?: string
        programDestinationTokenAccount?: string
        destinationTokenAccount?: string
        sourceMint?: string
        destinationMint?: string
        platformFeeAccount?: string
        token2022Program?: string
        eventAuthority?: string
        program?: string
        "Remaining 0"?: string
        "Remaining 1"?: string
        "Remaining 2"?: string
        "Remaining 3"?: string
        "Remaining 4"?: string
        "Remaining 5"?: string
        "Remaining 6"?: string
        "Remaining 7"?: string
        "Remaining 8"?: string
        "Remaining 9"?: string
        "Remaining 10"?: string
        "Remaining 11"?: string
        "Remaining 12"?: string
        "Remaining 13"?: string
        "Remaining 14"?: string
        "Remaining 15"?: string
        "Remaining 16"?: string
        "Remaining 17"?: string
        "Remaining 18"?: string
        "Remaining 19"?: string
        "Remaining 20"?: string
        "Remaining 21"?: string
        "Remaining 22"?: string
        "Remaining 23"?: string
        "Remaining 24"?: string
        "Remaining 25"?: string
        "Remaining 26"?: string
        "Remaining 27"?: string
        "Remaining 28"?: string
        "Remaining 29"?: string
        id?: number
        routePlan?: Array<{
          swap: {
            raydium?: {}
            whirlpool?: {
              aToB: boolean
            }
          }
          percent: number
          inputIndex: number
          outputIndex: number
        }>
        outAmount?: number
        quotedInAmount?: number
        slippageBps?: number
        platformFeeBps?: number
        user?: string
        dca?: string
        inputMint?: string
        outputMint?: string
        inAta?: string
        outAta?: string
        userInAta?: string
        userOutAta?: string
        systemProgram?: string
        associatedTokenProgram?: string
        userAta?: string
        applicationIdx?: number
        inAmount?: number
        inAmountPerCycle?: number
        cycleFrequency?: number
        minPrice?: number
        maxPrice?: number
        startAt?: number
        realm_address?: string
        governance?: string
        proposal?: string
        token_owner_record?: string
        vote_record_address?: string
        vote_governing_token?: string
        wallet?: string
        proposal_owner_record?: string
        voter_token_owner_record?: string
        governance_authority?: string
        vote_type?: string
        rank?: number
        weight_percentage?: number
        governance_program?: string
        chat_message_address?: string
        chatType?: string
        message?: string
        isReply?: boolean
      }
      source_protocol: {
        address: string
        name: string
      }
      type: string
      parent_protocol?: string
    }>
  }