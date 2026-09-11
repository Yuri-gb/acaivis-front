import './ProductsSection.css'

import ProductsCarousel, {
    CarouselProduct
} from '../ProductsCarousel/ProductsCarousel'

import acaiTradicional
    from '../../assets/images/products/acai-tradicional.png'

import acaiLeite
    from '../../assets/images/products/acai-leite.png'

import acaiMorango
    from '../../assets/images/products/acai-morango.png'


/* ========================================
   PRODUTOS
   ======================================== */

const products: CarouselProduct[] = [

    {
        id: 1,

        image: acaiTradicional,

        name: 'Açaí Tradicional',

        description:
            'Cremoso e irresistível.',

        price: 'R$ 15,90'
    },


    {
        id: 2,

        image: acaiLeite,

        name: 'Açaí com Leite em Pó',

        description:
            'Um clássico que nunca falha.',

        price: 'R$ 17,90'
    },


    {
        id: 3,

        image: acaiMorango,

        name: 'Açaí com Morango',

        description:
            'Sabor que vicia.',

        price: 'R$ 18,90'
    }

]


function ProductsSection() {

    return (

        <section
            className="products-section"
            id="produtos"
        >

            {/* ========================================
                CABEÇALHO
                ======================================== */}

            <div className="products-section-header">

                <div>

                    <span className="products-section-label">
                        NOSSOS PRODUTOS
                    </span>

                    <h2>
                        Açaí na garrafinha
                    </h2>

                    <p>
                        Praticidade, sabor e aquele
                        toque especial da Açaívis.
                    </p>

                </div>

            </div>


            {/* ========================================
                CARROSSEL
                ======================================== */}

            <ProductsCarousel
                products={products}
            />

        </section>
    )
}


export default ProductsSection