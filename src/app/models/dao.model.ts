export interface DAO{
    name: string
    imgURL: string
    proposals: Proposal[]
}

export interface Proposal{
    title: string
    description: string
    status: 'voting' | 'voted' | 'cool off'
    expiryDate: Date
    votes: {
        for: number
        against:number
    }
}