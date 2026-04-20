type CardType = 'action' | 'craft' | 'move'

interface Card {
    id: number
    type: CardType
    name: string
    content: string
    reference?: number // Id d'une carte parent ou pas (null)
    cover_path: string
}

const mokeCards: Card[] = [
    {
        id: 1,
        type: 'action',
        name: 'test1',
        content: "dfjosgjofig",
        cover_path: '/labas'
    }
]