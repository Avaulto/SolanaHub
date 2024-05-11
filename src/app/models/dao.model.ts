
export interface Gov{
    name: string
    imgURL: string
    realmsId: string
    proposals: Proposal[]
}

export interface Proposal{
    title: string
    description: string
    status: string
    expiryDate: Date
    governingTokenMint: string,
    governance: string
    votes: {
        total: number
        for: number
        against:number
    }
}
