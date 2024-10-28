import {
    CLMM_PROGRAM_ID,
    getPdaPersonalPositionAddress,
    TickUtils,
    ApiV3PoolInfoConcentratedItem,
    PositionUtils,
    TickArrayLayout,
    U64_IGNORE_RANGE,
    ApiV3Token,
    PositionInfoLayout,
    DEVNET_PROGRAM_ID,
    Raydium,
    PoolInfoLayout,
    TxVersion,
    ClmmKeys,
    ClmmPositionLayout,
} from '@raydium-io/raydium-sdk-v2'
import DLMM from '@meteora-ag/dlmm'
import { Cluster, Connection, PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { BN } from '@marinade.finance/marinade-ts-sdk'
const VALID_PROGRAM_ID = new Set([CLMM_PROGRAM_ID.toBase58(), DEVNET_PROGRAM_ID.CLMM.toBase58()])
const isValidClmm = (id: string) => VALID_PROGRAM_ID.has(id)




