import './ProductsSection.css'

import { useState } from 'react'

import {
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa'

import HomeProductCard from './HomeProductCard'

import acaiTradicional
    from '../../assets/images/products/acai-tradicional.png'

import acaiLeite
    from '../../assets/images/products/acai-leite.png'

import acaiMorango
    from '../../assets/images/products/acai-morango.png'


/* ========================================
   PRODUTO
   ======================================== */

interface Product {

    id: number

    image: string

    name: string

    description: string

    price: string
}


/* ========================================
   PRODUTOS
   ======================================== */

const products: Product[] = [

    {
        id: 1,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        description: 'Cremoso e irresistível.',
        price: 'R$ 15,90'
    },

    {
        id: 2,
        image: acaiLeite,
        name: 'Açaí com Leite em Pó',
        description: 'Um clássico que nunca falha.',
        price: 'R$ 17,90'
    },

    {
        id: 3,
        image: acaiMorango,
        name: 'Açaí com Morango',
        description: 'Sabor que vicia.',
        price: 'R$ 18,90'
    }

]


/*
    Clonamos os produtos para permitir
    o movimento contínuo do carrossel.
*/

const carouselProducts = [

    ...products,

    ...products

]


function ProductsSection() {

    const [currentIndex, setCurrentIndex] = useState(0)

    const [isAnimating, setIsAnimating] = useState(true)


    /* ========================================
       PRÓXIMO PRODUTO
       ======================================== */

    const handleNext = () => {

        if (currentIndex >= products.length) {

            return

        }

        setCurrentIndex((current) => current + 1)

    }


    /* ========================================
       PRODUTO ANTERIOR
       ======================================== */

    const handlePrevious = () => {

        if (currentIndex <= 0) {

            return

        }

        setCurrentIndex((current) => current - 1)

    }


    /* ========================================
       FINAL DA ANIMAÇÃO
       ======================================== */

    const handleTransitionEnd = () => {

        if (currentIndex === products.length) {

            setIsAnimating(false)

            setCurrentIndex(0)

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    setIsAnimating(true)

                })

            })

        }

    }


    /* ========================================
       INDICADORES
       ======================================== */

    const handleDotClick = (index: number) => {

        setIsAnimating(true)

        setCurrentIndex(index)

    }


    /* ========================================
       ADICIONAR AO CARRINHO
       ======================================== */

    const handleAddToCart = (productId: number) => {

        console.log(
            'Produto adicionado ao carrinho:',
            productId
        )

    }


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
                        Praticidade, sabor e muita cremosidade em qualquer lugar.
                    </p>

                </div>


                <a
                    href="/produtos"
                    className="products-see-all"
                >

                    Ver todos

                    <FaChevronRight />

                </a>

            </div>


            {/* ========================================
                CARROSSEL
                ======================================== */}

            <div className="products-carousel">


                {/* ========================================
                    SETA ESQUERDA
                    ======================================== */}

                <button
                    type="button"
                    className="
                        products-carousel-button
                        products-carousel-button-left
                    "
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    aria-label="Produto anterior"
                >

                    <FaChevronLeft />

                </button>


                {/* ========================================
                    ÁREA VISÍVEL
                    ======================================== */}

                <div className="products-carousel-viewport">


                    {/* ========================================
                        TRACK
                        ======================================== */}

                    <div
                        className="products-carousel-track"
                        style={{
                            '--carousel-index': currentIndex,
                            transition: isAnimating
                                ? 'transform 0.45s ease'
                                : 'none'
                        } as React.CSSProperties}
                        onTransitionEnd={handleTransitionEnd}
                    >

                        {carouselProducts.map((product, index) => (

                            <div
                                className="products-carousel-slide"
                                key={`${product.id}-${index}`}
                            >

                                <HomeProductCard

                                    image={product.image}

                                    name={product.name}

                                    description={product.description}

                                    price={product.price}

                                    productId={product.id}

                                    onAdd={handleAddToCart}

                                />

                            </div>

                        ))}

                    </div>

                </div>


                {/* ========================================
                    SETA DIREITA
                    ======================================== */}

                <button
                    type="button"
                    className="
                        products-carousel-button
                        products-carousel-button-right
                    "
                    onClick={handleNext}
                    disabled={currentIndex === products.length}
                    aria-label="Próximo produto"
                >

                    <FaChevronRight />

                </button>

            </div>


            {/* ========================================
                INDICADORES
                ======================================== */}

            <div className="products-carousel-dots">

                {products.map((product, index) => (

                    <button
                        type="button"
                        key={product.id}
                        className={`
                            products-carousel-dot
                            ${
                                index === currentIndex % products.length
                                    ? 'active'
                                    : ''
                            }
                        `}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Ir para produto ${index + 1}`}
                    />

                ))}

            </div>

        </section>
    )
}


export default ProductsSection