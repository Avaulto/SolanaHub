export interface DAO{
    name: string
    imgURL: string
    proposals: Proposal[]
}

export interface Proposal{
    title: string
    description: string
    status: 'voting' | 'voted' | 'ended' |'cool off'
    expiryDate: Date
    votes: {
        total: number
        for: number
        against:number
    }
}