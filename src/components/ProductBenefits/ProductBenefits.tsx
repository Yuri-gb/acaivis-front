import {
    FaLeaf,
    FaSnowflake,
    FaHeart,
    FaCrown
} from 'react-icons/fa'

import type { MockProduct } from '../../dev/mockProduct'
import './ProductBenefits.css'


interface ProductBenefitsProps {
    product: MockProduct
}


function ProductBenefits({
    product: _product
}: ProductBenefitsProps) {

    const benefits = [
        {
            icon: FaLeaf,
            title: 'Açaí',
            text: 'de verdade'
        },
        {
            icon: FaSnowflake,
            title: 'Sempre',
            text: 'geladinho'
        },
        {
            icon: FaHeart,
            title: 'Sabor',
            text: 'que vicia'
        },
        {
            icon: FaCrown,
            title: 'Feito com',
            text: 'amor'
        }
    ]


    return (

        <section className="product-details-benefits">

            {benefits.map((benefit) => {

                const Icon = benefit.icon

                return (

                    <div
                        key={benefit.title}
                        className="product-details-benefit"
                    >

                        <Icon />

                        <div>
                            <strong>
                                {benefit.title}
                            </strong>

                            <span>
                                {benefit.text}
                            </span>
                        </div>

                    </div>

                )

            })}

        </section>

    )
}


export default ProductBenefits
