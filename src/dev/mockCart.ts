import acaiTradicional from '../assets/images/products/acai-tradicional.png'
import acaiLeite from '../assets/images/products/acai-leite.png'
import acaiMorango from '../assets/images/products/acai-morango.png'


/* ========================================
   CONFIGURAÇÃO
   ======================================== */

export const MOCK_CART_ENABLED = true


/* ========================================
   TIPO
   ======================================== */

export interface MockCartItem {

    id: number

    productId: number

    image: string

    name: string

    description: string

    unitPrice: number

    quantity: number
}


/* ========================================
   MOCK DO CARRINHO
   ======================================== */

export function getMockCart(): MockCartItem[] {

    return [

        {
            id: 1,

            productId: 1,

            image: acaiTradicional,

            name: 'Açaí Tradicional',

            description: '300 ml',

            unitPrice: 12.90,

            quantity: 2
        },

        {
            id: 2,

            productId: 2,

            image: acaiLeite,

            name: 'Açaí com Leite em Pó',

            description: '300 ml',

            unitPrice: 14.90,

            quantity: 1
        },

        {
            id: 3,

            productId: 3,

            image: acaiMorango,

            name: 'Açaí com Morango',

            description: '300 ml',

            unitPrice: 15.90,

            quantity: 1
        }

    ]
}