import acaiTradicional
    from '../assets/images/products/acai-tradicional.webp'

import acaiLeite
    from '../assets/images/products/acai-leite.webp'

import acaiMorango
    from '../assets/images/products/acai-morango.webp'
    
export interface MockProduct {
    id: number
    image: string
    name: string
    size: string
    description: string
    price: string
    unitPrice: number
    badge?: string
    available: boolean
}

export const mockProducts: MockProduct[] = [
    {
        id: 1,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description: 'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        unitPrice: 18.90,
        available: true
    },
    {
        id: 2,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description: 'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        unitPrice: 20.90,
        available: true
    },
    {
        id: 3,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description: 'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        unitPrice: 22.90,
        available: true
    },
    {
        id: 4,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '300 ml',
        description: 'Açaí cremoso e geladinho para matar a vontade de açaí.',
        price: 'R$ 12,90',
        badge: 'MAIS VENDIDO',
        unitPrice: 12.90,
        available: true
    },
    {
        id: 5,
        image: acaiLeite,
        name: 'Açaí com Leite em Pó',
        size: '300 ml',
        description: 'Açaí cremoso com leite em pó para deixar o pedido ainda mais saboroso.',
        price: 'R$ 14,90',
        badge: 'QUERIDINHO',
        unitPrice: 14.90,
        available: true
    },
    {
        id: 6,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '300 ml',
        description: 'Açaí com morangos frescos em uma combinação irresistível.',
        price: 'R$ 15,90',
        badge: 'PREMIUM',
        unitPrice: 15.90,
        available: true
    },
    {
        id: 7,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '700 ml',
        description: 'Uma porção maior do nosso açaí tradicional para compartilhar.',
        price: 'R$ 27,90',
        badge: 'MAIS VENDIDO',
        unitPrice: 27.90,
        available: true
    },
    {
        id: 8,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '700 ml',
        description: 'Açaí cremoso com leite em uma porção maior.',
        price: 'R$ 29,90',
        badge: 'QUERIDINHO',
        unitPrice: 29.90,
        available: true
    },
    {
        id: 9,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '700 ml',
        description: 'Açaí com morango em uma porção generosa.',
        price: 'R$ 31,90',
        badge: 'PREMIUM',
        unitPrice: 31.90,
        available: true
    },
    {
        id: 10,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '1 litro',
        description: 'Açaí tradicional em tamanho família.',
        price: 'R$ 36,90',
        badge: 'MAIS VENDIDO',
        unitPrice: 36.90,
        available: true
    },
    {
        id: 11,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '1 litro',
        description: 'Açaí com leite em uma porção família.',
        price: 'R$ 39,90',
        badge: 'QUERIDINHO',
        unitPrice: 39.90,
        available: true
    },
    {
        id: 12,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '1 litro',
        description: 'Açaí com morango em tamanho família.',
        price: 'R$ 42,90',
        badge: 'PREMIUM',
        unitPrice: 42.90,
        available: true
    },
    {
        id: 13,
        image: acaiTradicional,
        name: 'Combo Açaívis',
        size: '2 garrafas 500 ml',
        description: 'Duas garrafas de açaí para aproveitar em dobro.',
        price: 'R$ 32,90',
        badge: 'COMBO',
        unitPrice: 32.90,
        available: true
    },
    {
        id: 14,
        image: acaiLeite,
        name: 'Combo Leite em Pó',
        size: '2 garrafas 500 ml',
        description: 'Duas garrafas de açaí com leite para compartilhar.',
        price: 'R$ 36,90',
        badge: 'COMBO',
        unitPrice: 36.90,
        available: true
    },
    {
        id: 15,
        image: acaiMorango,
        name: 'Combo Morango',
        size: '2 garrafas 500 ml',
        description: 'Duas garrafas de açaí com morango.',
        price: 'R$ 39,90',
        badge: 'COMBO',
        unitPrice: 39.90,
        available: true
    },
    {
        id: 16,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '2 garrafas 300 ml',
        description: 'Duas garrafas individuais de açaí tradicional.',
        price: 'R$ 24,90',
        unitPrice: 24.90,
        available: true
    },
    {
        id: 17,
        image: acaiLeite,
        name: 'Açaí com Leite em Pó',
        size: '2 garrafas 300 ml',
        description: 'Duas garrafas individuais com leite em pó.',
        price: 'R$ 28,90',
        unitPrice: 28.90,
        available: true
    },
    {
        id: 18,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '2 garrafas 300 ml',
        description: 'Duas garrafas individuais com morango.',
        price: 'R$ 30,90',
        unitPrice: 30.90,
        available: true
    },
    {
        id: 19,
        image: acaiTradicional,
        name: 'Combo Açaívis Família',
        size: '2 garrafas 1 litro',
        description: 'Duas garrafas de um litro para um pedido em família.',
        price: 'R$ 69,90',
        badge: 'COMBO',
        unitPrice: 69.90,
        available: true
    },
    {
        id: 20,
        image: acaiMorango,
        name: 'Combo Açaívis Morango',
        size: '2 garrafas 1 litro',
        description: 'Duas garrafas de um litro com a combinação de açaí e morango.',
        price: 'R$ 79,90',
        badge: 'COMBO',
        unitPrice: 79.90,
        available: true
    }
]
