import './ProductsBanner.css'

import {
    FaLeaf,
    FaSnowflake,
    FaHeart,
    FaCrown
} from 'react-icons/fa'

import productsBannerImage
    from '../../assets/images/products/products-banner.png'

import productsBannerMobileImage
    from '../../assets/images/products/products-banner.png'

import type { ReactNode } from 'react'


interface Benefit {
    icon: ReactNode
    title: string
    description: string
}


const benefits: Benefit[] = [
    {
        icon: <FaLeaf />,
        title: 'Açaí',
        description: 'de verdade'
    },
    {
        icon: <FaSnowflake />,
        title: 'Sempre',
        description: 'geladinho'
    },
    {
        icon: <FaHeart />,
        title: 'Sabor',
        description: 'que vicia'
    },
    {
        icon: <FaCrown />,
        title: 'Feito com',
        description: 'amor'
    }
]


function ProductsBanner() {

    return (
        <section className="products-banner">


            {/* ========================================
                BREADCRUMB
                ======================================== */}

            <div className="products-banner-breadcrumb">

                <span>
                    Início
                </span>

                <span>
                    ›
                </span>

                <span>
                    Produtos
                </span>

            </div>


            {/* ========================================
                CONTEÚDO PRINCIPAL
                ======================================== */}

            <div className="products-banner-content">


                {/* ========================================
                    TEXTO
                    ======================================== */}

                <div className="products-banner-text">

                    <span className="products-banner-label">
                        NOSSOS PRODUTOS
                    </span>

                    <h1>
                        Mais que açaí,

                        <br />

                        <span>
                            é um estilo de vida.
                        </span>
                    </h1>

                    <p>
                        Escolha seu favorito e leve mais sabor
                        para o seu dia.
                    </p>

                </div>


                {/* ========================================
                    IMAGEM
                    ======================================== */}

                <picture className="products-banner-image">

                    <source
                        media="(max-width: 792px)"
                        srcSet={productsBannerMobileImage}
                    />

                    <img
                        src={productsBannerImage}
                        alt="Garrafas de açaí Açaívis"
                    />

                </picture>


                {/* ========================================
                    BENEFÍCIOS
                    ======================================== */}

                <div className="products-banner-benefits">

                    {benefits.map((benefit) => (

                        <div
                            className="products-banner-benefit"
                            key={benefit.title}
                        >

                            <span className="products-banner-benefit-icon">
                                {benefit.icon}
                            </span>

                            <div>

                                <strong>
                                    {benefit.title}
                                </strong>

                                <span>
                                    {benefit.description}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    )
}


export default ProductsBanner