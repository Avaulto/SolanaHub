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


export async function getOutOfRangeMetora(walletOwner: PublicKey, connection: Connection) {
    const userPools = await DLMM.getAllLbPairPositionsByUser(connection, new PublicKey(walletOwner));
    const outOfRangePositions = []
    console.log(userPools);
    
    await Promise.all(Array.from(userPools.values()).map(async (pool) => {
        const poolInstance = await DLMM.create(connection, pool.publicKey);
        const { userPositions } = await poolInstance.getPositionsByUserAndLbPair(
            walletOwner
        );
        const activeId = pool.lbPair?.activeId || 0;
        console.log(userPositions);
       return userPositions.map((position) => {
        console.log(position);
            const lowerBinId = position?.positionData?.lowerBinId ;
            const upperBinId = position?.positionData?.upperBinId;
            const isOutOfRange = activeId < lowerBinId || activeId > upperBinId;
            if (isOutOfRange) {
                outOfRangePositions.push(userPositions)
            }
        });
    }));
    return outOfRangePositions
}



export async function getOutOfRangeRaydium(walletOwner: PublicKey, connection: Connection) {
    const raydium = await Raydium.load({
        owner: walletOwner,
        connection,
        cluster: 'mainnet',
        disableFeatureCheck: true,
        disableLoadToken: true,
        blockhashCommitment: 'finalized',
    })

    const allPositions = await raydium.clmm.getOwnerPositionInfo({ programId: CLMM_PROGRAM_ID })
    if (!allPositions.length) throw new Error('User does not have any positions')

    const positionInfos = await Promise.all(allPositions.map(async (position) => {
        let poolInfo: ApiV3PoolInfoConcentratedItem
        let poolKeys: ClmmKeys | undefined
            | undefined
        if (raydium.cluster === 'mainnet') {
            poolInfo = (
                await raydium.api.fetchPoolById({ ids: position.poolId.toBase58() })
            )[0] as ApiV3PoolInfoConcentratedItem
        } else {
            const data = await raydium.clmm.getPoolInfoFromRpc(position.poolId.toBase58())
            poolInfo = data.poolInfo
            poolKeys = data.poolKeys
        }

        const epochInfo = await raydium.connection.getEpochInfo()

        const { amountA, amountB } = PositionUtils.getAmountsFromLiquidity({
            poolInfo,
            ownerPosition: position,
            liquidity: position.liquidity,
            slippage: 0,
            add: false,
            epochInfo,
        })
        const [pooledAmountA, pooledAmountB] = [
            new Decimal(amountA.amount.toString()).div(10 ** poolInfo.mintA.decimals),
            new Decimal(amountB.amount.toString()).div(10 ** poolInfo.mintB.decimals),
        ]

        const [tickLowerArrayAddress, tickUpperArrayAddress] = [
            TickUtils.getTickArrayAddressByTick(
                new PublicKey(poolInfo.programId),
                new PublicKey(poolInfo.id),
                position.tickLower,
                poolInfo.config.tickSpacing
            ),
            TickUtils.getTickArrayAddressByTick(
                new PublicKey(poolInfo.programId),
                new PublicKey(poolInfo.id),
                position.tickUpper,
                poolInfo.config.tickSpacing
            ),
        ]

        const tickArrayRes = await raydium.connection.getMultipleAccountsInfo([tickLowerArrayAddress, tickUpperArrayAddress])
        if (!tickArrayRes[0] || !tickArrayRes[1]) throw new Error('tick data not found')
        const tickArrayLower = TickArrayLayout.decode(tickArrayRes[0].data)
        const tickArrayUpper = TickArrayLayout.decode(tickArrayRes[1].data)
        const tickLowerState =
            tickArrayLower.ticks[TickUtils.getTickOffsetInArray(position.tickLower, poolInfo.config.tickSpacing)]
        const tickUpperState =
            tickArrayUpper.ticks[TickUtils.getTickOffsetInArray(position.tickUpper, poolInfo.config.tickSpacing)]
        const rpcPoolData = await raydium.clmm.getRpcClmmPoolInfo({ poolId: position.poolId })
        const tokenFees = PositionUtils.GetPositionFeesV2(rpcPoolData, position, tickLowerState, tickUpperState)
        const rewards = PositionUtils.GetPositionRewardsV2(rpcPoolData, position, tickLowerState, tickUpperState)

        const [tokenFeeAmountA, tokenFeeAmountB] = [
            tokenFees.tokenFeeAmountA.gte(new BN(0)) && tokenFees.tokenFeeAmountA.lt(U64_IGNORE_RANGE)
                ? tokenFees.tokenFeeAmountA
                : new BN(0),
            tokenFees.tokenFeeAmountB.gte(new BN(0)) && tokenFees.tokenFeeAmountB.lt(U64_IGNORE_RANGE)
                ? tokenFees.tokenFeeAmountB
                : new BN(0),
        ]
        const [rewardMintAFee, rewardMintBFee] = [
            {
                mint: poolInfo.mintA,
                amount: new Decimal(tokenFeeAmountA.toString())
                    .div(10 ** poolInfo.mintA.decimals)
                    .toDecimalPlaces(poolInfo.mintA.decimals),
            },
            {
                mint: poolInfo.mintB,
                amount: new Decimal(tokenFeeAmountB.toString())
                    .div(10 ** poolInfo.mintB.decimals)
                    .toDecimalPlaces(poolInfo.mintB.decimals),
            },
        ]
        //@ts-ignore
        const rewardInfos = rewards.map((r) => (r.gte(new BN(0)) && r.lt(U64_IGNORE_RANGE) ? r : new BN(0)))
        const poolRewardInfos = rewardInfos
            .map((r, idx) => {
                const rewardMint = poolInfo.rewardDefaultInfos.find(
                    (r) => r.mint.address === rpcPoolData.rewardInfos[idx].tokenMint.toBase58()
                )?.mint

                if (!rewardMint) return undefined
                return {
                    mint: rewardMint,
                    amount: new Decimal(r.toString()).div(10 ** rewardMint.decimals).toDecimalPlaces(rewardMint.decimals),
                }
            })
            .filter(Boolean) as { mint: ApiV3Token; amount: Decimal }[]

        const feeARewardIdx = poolRewardInfos.findIndex((r) => r!.mint.address === poolInfo.mintA.address)
        if (poolRewardInfos[feeARewardIdx])
            poolRewardInfos[feeARewardIdx].amount = poolRewardInfos[feeARewardIdx].amount.add(rewardMintAFee.amount)
        else poolRewardInfos.push(rewardMintAFee)
        const feeBRewardIdx = poolRewardInfos.findIndex((r) => r!.mint.address === poolInfo.mintB.address)
        if (poolRewardInfos[feeBRewardIdx])
            poolRewardInfos[feeBRewardIdx].amount = poolRewardInfos[feeBRewardIdx].amount.add(rewardMintBFee.amount)
        else poolRewardInfos.push(rewardMintBFee)

        // check if pool is out of range
        const poolInfoAccount = await raydium.connection.getAccountInfo(new PublicKey(poolInfo.id))
        const poolInfo2 = PoolInfoLayout.decode(poolInfoAccount.data)

        const isOutOfRange: boolean = checkPositionStatus(poolInfo2, position) === 'InRange' ? false : true

        return {
            poolInfo,
            position,
            poolKeys,
            pool: `${poolInfo.mintA.symbol} - ${poolInfo.mintB.symbol}`,
            nftmint: position.nftMint.toBase58(),
            poolTokenA: poolInfo.mintA,
            poolTokenB: poolInfo.mintB,
            isOutOfRange,
            platform: 'Raydium',
            platformImgUrl: 'https://sonar.watch/img/platforms/raydium.webp',
            pooledAmountA: pooledAmountA.toString(),
            pooledAmountB: pooledAmountB.toString(),
            rewardInfos: poolRewardInfos.map((r) => ({
                mint: r.mint.symbol.replace(/WSOL/gi, 'SOL'),
                amount: r.amount.toString(),
            })),
        }
    }))

    return positionInfos
}
export async function closePosition(walletOwner: PublicKey, connection: Connection, poolInfo: ApiV3PoolInfoConcentratedItem, position: any) {
    const raydium = await Raydium.load({
        owner: walletOwner,
        connection,
        cluster: 'mainnet',
        disableFeatureCheck: true,
        disableLoadToken: true,
        blockhashCommitment: 'finalized',
        // urlConfigs: {
        //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
        // },
    })
    const res = await raydium.clmm.closePosition({
        poolInfo,
        poolKeys: position.poolKeys,
        ownerPosition: position.position,
        txVersion: TxVersion.LEGACY,
    })
    console.log(res);

    return res
}
function checkPositionStatus(poolInfo: { tickCurrent: number }, position: { tickLower: number, tickUpper: number }) {
    if (position.tickUpper <= poolInfo.tickCurrent) return "OutOfRange(PriceIsAboveRange)";
    if (position.tickLower > poolInfo.tickCurrent) return "OutOfRange(PriceIsBelowRange)";
    return "InRange";
}

export async function harvestRewards(walletOwner: PublicKey, connection: Connection, pools: ApiV3PoolInfoConcentratedItem[], position) {
    const raydium = await Raydium.load({
        owner: walletOwner,
        connection,
        cluster: 'mainnet',
        disableFeatureCheck: true,
        disableLoadToken: true,
        blockhashCommitment: 'finalized',
        // urlConfigs: {
        //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
        // },
    })
    const allPosition = position
    const nonZeroPosition = allPosition.filter((p) => !p.liquidity.isZero())
    if (!nonZeroPosition.length)
        throw new Error(`use do not have any non zero positions, total positions: ${allPosition.length}`)

    const allPositions = nonZeroPosition.reduce(
        (acc, cur) => ({
            ...acc,
            [cur.poolId.toBase58()]: acc[cur.poolId.toBase58()] ? acc[cur.poolId.toBase58()].concat(cur) : [cur],
        }),
        {} as Record<string, ClmmPositionLayout[]>
    )


    const res = await raydium.clmm.harvestAllRewards({
        allPoolInfo: pools.reduce(
            (acc, cur) => ({
                ...acc,
                [cur.id]: cur,
            }),
            {}
        ),
        allPositions,
        ownerInfo: {
            useSOLBalance: true,
        },
        programId: CLMM_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.CLMM
        txVersion: TxVersion.LEGACY,
    })
    return res
}

export const closePosition2 = async (walletOwner: PublicKey, connection: Connection, poolId: string) => {
    const raydium = await Raydium.load({
        owner: walletOwner,
        connection,
        cluster: 'mainnet',
        disableFeatureCheck: true,
        disableLoadToken: true,
        blockhashCommitment: 'finalized',
        // urlConfigs: {
        //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
        // },
    })

    let poolInfo: ApiV3PoolInfoConcentratedItem
    // SOL-USDC pool
    // const poolId = '5TdZNnFVktYXmPrPetBJPBKKbJf1yYXkeGaLNeyd91Uw'
    let poolKeys: ClmmKeys | undefined

    if (raydium.cluster === 'mainnet') {
        // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
        // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
        const data = await raydium.api.fetchPoolById({ ids: poolId })
        poolInfo = data[0] as ApiV3PoolInfoConcentratedItem
        if (!isValidClmm(poolInfo.programId)) throw new Error('target pool is not CLMM pool')
    } else {
        const data = await raydium.clmm.getPoolInfoFromRpc(poolId)
        poolInfo = data.poolInfo
        poolKeys = data.poolKeys
    }
    console.log(poolInfo);

    /** code below will get on chain realtime price to avoid slippage error, uncomment it if necessary */
    // const rpcData = await raydium.clmm.getRpcClmmPoolInfo({ poolId: poolInfo.id })
    // poolInfo.price = rpcData.currentPrice

    const allPosition = await raydium.clmm.getOwnerPositionInfo({ programId: poolInfo.programId })
    if (!allPosition.length) throw new Error('user do not have any positions')

    const position = allPosition.find((p) => p.poolId.toBase58() === poolInfo.id)
    if (!position) throw new Error(`user do not have position in pool: ${poolInfo.id}`)

    const all = await raydium.clmm.closePosition({
        poolInfo,
        poolKeys,
        ownerPosition: position,
        txVersion: TxVersion.LEGACY,
    })

    return all
}

export const decreaseLiquidity = async (walletOwner: PublicKey, connection: Connection, myPosition: any) => {
    const raydium = await Raydium.load({
        owner: walletOwner,
        connection,
        cluster: 'mainnet',
        disableFeatureCheck: true,
        disableLoadToken: true,
        blockhashCommitment: 'finalized',
    })
    let poolInfo: ApiV3PoolInfoConcentratedItem = myPosition.poolInfo
    let poolKeys: ClmmKeys | undefined = myPosition.poolKeys
    let position = myPosition.position

    const { transaction } = await raydium.clmm.decreaseLiquidity({
        poolInfo,
        poolKeys,
        ownerPosition: position,
        ownerInfo: {
            useSOLBalance: true,
            // if liquidity wants to decrease doesn't equal to position liquidity, set closePosition to false
            closePosition: true,
        },
        liquidity: position.liquidity,
        amountMinA: new BN(0),
        amountMinB: new BN(0),
        txVersion: TxVersion.LEGACY,
    })

    return transaction
}

