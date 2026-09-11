import './ProductsCarousel.css'

import { useState } from 'react'

import {
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa'

import HomeProductCard from '../ProductsSection/HomeProductCard'


export interface CarouselProduct {

    id: number

    image: string

    name: string

    description: string

    price: string
}


interface ProductsCarouselProps {

    products: CarouselProduct[]

}


function ProductsCarousel({
    products
}: ProductsCarouselProps) {

    const [currentIndex, setCurrentIndex] =
        useState(0)

    const [isAnimating, setIsAnimating] =
        useState(true)


    const carouselProducts = [
        ...products,
        ...products
    ]


    /* ========================================
       PRÓXIMO PRODUTO
       ======================================== */

    const handleNext = () => {

        if (
            currentIndex >=
            products.length
        ) {

            return
        }

        setCurrentIndex(
            (current) => current + 1
        )
    }


    /* ========================================
       PRODUTO ANTERIOR
       ======================================== */

    const handlePrevious = () => {

        if (currentIndex <= 0) {

            return
        }

        setCurrentIndex(
            (current) => current - 1
        )
    }


    /* ========================================
       FINAL DA ANIMAÇÃO
       ======================================== */

    const handleTransitionEnd = () => {

        if (
            currentIndex ===
            products.length
        ) {

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

    const handleDotClick = (
        index: number
    ) => {

        setIsAnimating(true)

        setCurrentIndex(index)
    }


    /* ========================================
       ADICIONAR AO CARRINHO
       ======================================== */

    const handleAddToCart = (
        productId: number
    ) => {

        console.log(
            'Produto adicionado ao carrinho:',
            productId
        )
    }


    return (

        <div className="products-carousel-wrapper">

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

                    <div
                        className="products-carousel-track"
                        style={{
                            '--carousel-index':
                                currentIndex,

                            transition:
                                isAnimating
                                    ? 'transform 0.45s ease'
                                    : 'none'
                        } as React.CSSProperties}
                        onTransitionEnd={
                            handleTransitionEnd
                        }
                    >

                        {carouselProducts.map(
                            (product, index) => (

                                <div
                                    className="
                                        products-carousel-slide
                                    "
                                    key={`${product.id}-${index}`}
                                >

                                    <HomeProductCard
                                        image={product.image}
                                        name={product.name}
                                        description={
                                            product.description
                                        }
                                        price={product.price}
                                        productId={
                                            product.id
                                        }
                                        onAdd={
                                            handleAddToCart
                                        }
                                    />

                                </div>

                            )
                        )}

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
                    disabled={
                        currentIndex ===
                        products.length
                    }
                    aria-label="Próximo produto"
                >

                    <FaChevronRight />

                </button>

            </div>


            {/* ========================================
                INDICADORES
                ======================================== */}

            <div className="products-carousel-dots">

                {products.map(
                    (product, index) => (

                        <button
                            type="button"
                            key={product.id}
                            className={`
                                products-carousel-dot
                                ${
                                    index ===
                                    currentIndex %
                                        products.length
                                        ? 'active'
                                        : ''
                                }
                            `}
                            onClick={() =>
                                handleDotClick(index)
                            }
                            aria-label={
                                `Ir para produto ${
                                    index + 1
                                }`
                            }
                        />

                    )
                )}

            </div>

        </div>
    )
}


export default ProductsCarousel