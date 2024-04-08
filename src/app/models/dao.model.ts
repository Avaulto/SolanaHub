
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
    governingTokenMint: string,
    votes: {
        total: number
        for: number
        against:number
    }
}
