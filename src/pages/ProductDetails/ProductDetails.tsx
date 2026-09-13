import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import './ProductDetails.css'

import Navbar
    from '../../components/Navbar/Navbar'

import Footer
    from '../../components/Footer/Footer'

import ProductGallery
    from '../../components/ProductGallery/ProductGallery'

import ProductInfo
    from '../../components/ProductInfo/ProductInfo'


import ProductAbout
    from '../../components/ProductAbout/ProductAbout'

import ProductNutrition
    from '../../components/ProductNutrition/ProductNutrition'

import ProductsCarousel, {
    CarouselProduct
} from '../../components/ProductsCarousel/ProductsCarousel'

import { mockProducts } from '../../dev/mockProduct'


/* ========================================
   PÁGINA DE DETALHES DO PRODUTO
   ======================================== */

function ProductDetails() {

    const { id } = useParams()


    /* ========================================
       PRODUTO ATUAL
       ======================================== */

    const productId = Number(id)

    const product = useMemo(() => {

        if (!Number.isInteger(productId)) {
            return undefined
        }

        return mockProducts.find(
            (item) => item.id === productId
        )

    }, [productId])


    /* ========================================
       PRODUTOS RELACIONADOS
       ======================================== */

    const relatedProducts = useMemo<CarouselProduct[]>(() => {

        if (!product) {
            return []
        }

        return mockProducts
            .filter(
                (item) =>
                    item.id !== product.id &&
                    item.available
            )
            .slice(0, 3)
            .map((item) => ({
                id: item.id,
                image: item.image,
                name: item.name,
                description: item.description,
                price: item.price
            }))

    }, [product])


    /* ========================================
       PRODUTO NÃO ENCONTRADO
       ======================================== */

    if (!product) {
        return <Navigate to="/produtos" replace />
    }


    return (

        <>

            <Navbar />


            <main className="product-details-page">


                {/* ========================================
                    BREADCRUMB
                    ======================================== */}

                <div className="product-details-breadcrumb">

                    <a href="/">
                        Início
                    </a>

                    <span>
                        &gt;
                    </span>

                    <a href="/produtos">
                        Produtos
                    </a>

                    <span>
                        &gt;
                    </span>

                    <span>
                        {product.name}
                    </span>

                </div>


                {/* ========================================
                    PRODUTO
                    ======================================== */}

                <section className="product-details-main">

                    <ProductGallery
                        product={product}
                    />


                    <ProductInfo
                        product={product}
                    />

                </section>


                {/* ========================================
                    BENEFÍCIOS
                    ======================================== */}




                {/* ========================================
                    SOBRE O PRODUTO
                    ======================================== */}

                <ProductAbout
                    product={product}
                />


                {/* ========================================
                    INFORMAÇÕES NUTRICIONAIS
                    ======================================== */}

                <ProductNutrition
                    product={product}
                />


                {/* ========================================
                    VOCÊ TAMBÉM PODE GOSTAR
                    ======================================== */}

                {relatedProducts.length > 0 && (

                    <section className="product-details-related">

                        <div className="product-details-related-header">

                            <h2>
                                Você também pode <em>gostar</em>
                            </h2>

                        </div>


                        <ProductsCarousel
                            products={relatedProducts}
                        />

                    </section>

                )}

            </main>


            <Footer />

        </>

    )
}


export default ProductDetails
