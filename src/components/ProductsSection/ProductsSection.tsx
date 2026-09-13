import './ProductsSection.css'

import ProductsCarousel, {
    CarouselProduct
} from '../ProductsCarousel/ProductsCarousel'

import { mockProducts } from '../../dev/mockProduct'


/* ========================================
   PRODUTOS
   ======================================== */

const products: CarouselProduct[] =
    mockProducts
        .filter((product) => product.available)
        .slice(0, 3)
        .map((product) => ({
            id: product.id,
            image: product.image,
            name: product.name,
            description: product.description,
            price: product.price
        }))


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

