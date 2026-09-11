import './Cart.css'

import {
    FaChevronRight
} from 'react-icons/fa'

import Navbar
    from '../../components/Navbar/Navbar'

import Footer
    from '../../components/Footer/Footer'

import ProductsCarousel, {
    CarouselProduct
} from '../../components/ProductsCarousel/ProductsCarousel'

import acaiTradicional
    from '../../assets/images/products/acai-tradicional.png'

import acaiLeite
    from '../../assets/images/products/acai-leite.png'

import acaiMorango
    from '../../assets/images/products/acai-morango.png'

import cartEmptyImage
    from '../../assets/images/cart/cart-empty.png'

import cartEmptyMobileImage
    from '../../assets/images/cart/cart-empty-mobile.png'

import estaVazioImage
    from '../../assets/images/cart/esta-vazio.png'

import gostarImage
    from '../../assets/images/cart/gostar.png'


/* ========================================
   PRODUTOS RECOMENDADOS
   ======================================== */

const recommendedProducts: CarouselProduct[] = [

    {
        id: 1,

        image:
            acaiTradicional,

        name:
            'Açaí Tradicional',

        description:
            '300 ml',

        price:
            'R$ 12,90'
    },


    {
        id: 2,

        image:
            acaiLeite,

        name:
            'Açaí com Leite em Pó',

        description:
            '300 ml',

        price:
            'R$ 14,90'
    },


    {
        id: 3,

        image:
            acaiMorango,

        name:
            'Açaí com Morango',

        description:
            '300 ml',

        price:
            'R$ 15,90'
    },


    {
        id: 4,

        image:
            acaiTradicional,

        name:
            'Combo Açaívis',

        description:
            '2 garrafas 500 ml',

        price:
            'R$ 32,90'
    }

]


/* ========================================
   PÁGINA
   ======================================== */

function Cart() {

    return (

        <div className="cart-page">

            <Navbar />


            <main className="cart-main">


                {/* ========================================
                   BREADCRUMB
                   ======================================== */}

                <div className="cart-breadcrumb">

                    <a href="/">
                        Início
                    </a>

                    <FaChevronRight />

                    <span>
                        Carrinho
                    </span>

                </div>


                {/* ========================================
                   CARRINHO VAZIO
                   ======================================== */}

                <section className="cart-empty">


                    <div className="cart-empty-content">


                        {/* ========================================
                           TÍTULO
                           ======================================== */}

                        <h1>

                            Seu carrinho

                            <br />

                            <img
                                src={estaVazioImage}
                                alt="está vazio"
                                className="cart-empty-title-image"
                            />

                        </h1>


                        {/* ========================================
                           DESCRIÇÃO
                           ======================================== */}

                        <p>
                            Parece que você ainda não adicionou
                            nenhum produto ao seu carrinho.
                        </p>


                        <p>
                            Que tal escolher um açaí e tornar
                            seu dia mais saboroso?
                        </p>


                        {/* ========================================
                           BOTÃO
                           ======================================== */}

                        <a
                            href="/produtos"
                            className="cart-empty-button"
                        >

                            <span>
                                Ver produtos
                            </span>

                            <FaChevronRight />

                        </a>

                    </div>


                    {/* ========================================
                       IMAGEM
                       ======================================== */}

                    <div className="cart-empty-image">

                        <picture>

                            <source
                                media="(max-width: 792px)"
                                srcSet={cartEmptyMobileImage}
                            />

                            <img
                                src={cartEmptyImage}
                                alt="Carrinho de compras vazio"
                            />

                        </picture>

                    </div>


                </section>


                {/* ========================================
                   RECOMENDAÇÕES
                   ======================================== */}

                <section className="cart-recommendations">


                    <div className="cart-recommendations-heading">


                        <h2>

                            Você também pode{' '}

                            <img
                                src={gostarImage}
                                alt="gostar"
                                className="cart-recommendations-title-image"
                            />

                        </h2>


                        <p>
                            Que tal adicionar mais sabor
                            ao seu pedido?
                        </p>

                    </div>


                    <ProductsCarousel
                        products={
                            recommendedProducts
                        }
                    />


                </section>


            </main>


            <Footer />

        </div>

    )

}


export default Cart