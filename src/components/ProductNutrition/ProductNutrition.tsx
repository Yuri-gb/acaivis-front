import { useState } from 'react'
import type { MockProduct } from '../../dev/mockProduct'
import NutritionModal from '../NutritionModal/NutritionModal'


interface ProductNutritionProps {
    product: MockProduct
}


function ProductNutrition({
    product
}: ProductNutritionProps) {
    const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false)

    const nutrition = [
        {
            value: '120 kcal',
            label: 'Por porção'
        },
        {
            value: '0 g',
            label: 'Gorduras trans'
        },
        {
            value: '28 g',
            label: 'Carboidratos'
        },
        {
            value: '1,5 g',
            label: 'Proteínas'
        }
    ]


    return (
        <>
            <section className="product-details-nutrition">

            <div className="product-details-nutrition-header">

                <h2>
                    Informações nutricionais
                </h2>

                <button
                    type="button"
                    className="product-details-nutrition-link"
                    onClick={() => setIsNutritionModalOpen(true)}
                >
                    Ver tabela completa →
                </button>

            </div>


            <div className="product-details-nutrition-grid">

                {nutrition.map((item) => (

                    <div
                        key={item.label}
                        className="product-details-nutrition-item"
                    >

                        <strong>
                            {item.value}
                        </strong>

                        <span>
                            {item.label}
                        </span>

                    </div>

                ))}

            </div>

        </section>

            <NutritionModal
                isOpen={isNutritionModalOpen}
                onClose={() => setIsNutritionModalOpen(false)}
                product={product}
            />
        </> 
    )
}


export default ProductNutrition
