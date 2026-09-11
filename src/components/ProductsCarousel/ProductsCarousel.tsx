import './ProductsCarousel.css'

import {
    useRef,
    useState
} from 'react'

import {
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa'

import type {
    CSSProperties
} from 'react'

import HomeProductCard
    from '../ProductsSection/HomeProductCard'


/* ========================================
   PRODUTO DO CARROSSEL
   ======================================== */

export interface CarouselProduct {

    id: number

    image: string

    name: string

    description: string

    price: string
}


/* ========================================
   PROPS
   ======================================== */

interface ProductsCarouselProps {

    products: CarouselProduct[]

}


/* ========================================
   COMPONENTE
   ======================================== */

function ProductsCarousel({
    products
}: ProductsCarouselProps) {

    const [
        currentIndex,
        setCurrentIndex
    ] = useState(0)


    const [
        isAnimating,
        setIsAnimating
    ] = useState(true)


    /* ========================================
       CONTROLE DO SWIPE
       ======================================== */

    const touchStartX =
        useRef<number | null>(null)


    const touchStartY =
        useRef<number | null>(null)


    /* ========================================
       PRODUTOS DUPLICADOS
       ======================================== */

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
            (current) =>
                current + 1
        )
    }


    /* ========================================
       PRODUTO ANTERIOR
       ======================================== */

    const handlePrevious = () => {

        if (
            currentIndex <= 0
        ) {

            return
        }


        setCurrentIndex(
            (current) =>
                current - 1
        )
    }


    /* ========================================
       INÍCIO DO SWIPE
       ======================================== */

    const handleTouchStart = (
        event: React.TouchEvent<HTMLDivElement>
    ) => {

        touchStartX.current =
            event.touches[0].clientX


        touchStartY.current =
            event.touches[0].clientY
    }


    /* ========================================
       FINAL DO SWIPE
       ======================================== */

    const handleTouchEnd = (
        event: React.TouchEvent<HTMLDivElement>
    ) => {

        if (
            touchStartX.current === null ||
            touchStartY.current === null
        ) {

            return
        }


        const touchEndX =
            event.changedTouches[0].clientX


        const touchEndY =
            event.changedTouches[0].clientY


        const distanceX =
            touchEndX -
            touchStartX.current


        const distanceY =
            touchEndY -
            touchStartY.current


        const minimumSwipeDistance = 50


        /*
         * Ignora movimentos predominantemente verticais.
         */

        if (
            Math.abs(distanceY) >
            Math.abs(distanceX)
        ) {

            touchStartX.current = null

            touchStartY.current = null

            return
        }


        /*
         * Deslizou para a esquerda.
         */

        if (
            distanceX <
            -minimumSwipeDistance
        ) {

            handleNext()
        }


        /*
         * Deslizou para a direita.
         */

        else if (
            distanceX >
            minimumSwipeDistance
        ) {

            handlePrevious()
        }


        touchStartX.current = null

        touchStartY.current = null
    }


    /* ========================================
       CANCELAMENTO DO SWIPE
       ======================================== */

    const handleTouchCancel = () => {

        touchStartX.current = null

        touchStartY.current = null
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


    /* ========================================
       RENDER
       ======================================== */

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
                    disabled={
                        currentIndex === 0
                    }
                    aria-label="Produto anterior"
                >

                    <FaChevronLeft />

                </button>


                {/* ========================================
                    ÁREA VISÍVEL
                    ======================================== */}

                <div
                    className="products-carousel-viewport"

                    onTouchStart={
                        handleTouchStart
                    }

                    onTouchEnd={
                        handleTouchEnd
                    }

                    onTouchCancel={
                        handleTouchCancel
                    }
                >

                    <div
                        className="products-carousel-track"

                        style={{
                            '--carousel-index':
                                currentIndex,

                            transition:
                                isAnimating
                                    ? 'transform 0.45s ease'
                                    : 'none'
                        } as CSSProperties}

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
                                        image={
                                            product.image
                                        }

                                        name={
                                            product.name
                                        }

                                        description={
                                            product.description
                                        }

                                        price={
                                            product.price
                                        }

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