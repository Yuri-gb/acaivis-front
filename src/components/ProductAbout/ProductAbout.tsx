import {
    FaGlassWhiskey,
    FaSnowflake,
    FaLeaf,
    FaHeart
} from 'react-icons/fa'
import './ProductAbout.css'

import type { MockProduct } from '../../dev/mockProduct'


interface ProductAboutProps {
    product: MockProduct
}


function ProductAbout({
    product
}: ProductAboutProps) {

    const features = [
        {
            icon: FaGlassWhiskey,
            title: product.size,
            text: 'Porção ideal'
        },
        {
            icon: FaSnowflake,
            title: 'Sempre gelado',
            text: 'Direto do freezer'
        },
        {
            icon: FaLeaf,
            title: '100% natural',
            text: 'Sem conservantes'
        },
        {
            icon: FaHeart,
            title: 'Sabor único',
            text: 'Que só a Açaívis tem'
        }
    ]


    return (

        <section className="product-details-about">

            <h2>
                Sobre o produto
            </h2>

            <p>
                {product.description}
                {' '}
                Feito com ingredientes selecionados,
                trazendo todo o sabor e a energia que você precisa.
                Cremoso, geladinho e perfeito para qualquer hora do dia.
            </p>


            <div className="product-details-about-features">

                {features.map((feature) => {

                    const Icon = feature.icon

                    return (

                        <div
                            key={feature.title}
                            className="product-details-about-feature"
                        >

                            <Icon />

                            <div>

                                <strong>
                                    {feature.title}
                                </strong>

                                <span>
                                    {feature.text}
                                </span>

                            </div>

                        </div>

                    )

                })}

            </div>

        </section>

    )
}


export default ProductAbout
