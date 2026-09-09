import './HowItWorks.css'

import {
    FaShoppingBag,
    FaCreditCard,
    FaWallet,
    FaMotorcycle,
    FaChevronRight
} from 'react-icons/fa'


interface Step {
    number: string
    icon: React.ReactNode
    title: string
    description: string
}


const steps: Step[] = [
    {
        number: '01',
        icon: <FaShoppingBag />,
        title: 'Escolha seus produtos',
        description: 'Monte seu carrinho com o que você ama.'
    },
    {
        number: '02',
        icon: <FaCreditCard />,
        title: 'Finalize o pedido',
        description: 'Informe seus dados de entrega ou retirada.'
    },
    {
        number: '03',
        icon: <FaWallet />,
        title: 'Escolha o pagamento',
        description: 'Pix, cartão ou na entrega.'
    },
    {
        number: '04',
        icon: <FaMotorcycle />,
        title: 'Receba e aproveite',
        description: 'Agora é só curtir seu Açaívis!'
    }
]


function HowItWorks() {

    return (

        <section className="how-it-works">

            <div className="how-it-works-content">

                <div className="how-it-works-intro">

                    <h2>
                        Como fazer seu
                        <span>pedido?</span>
                    </h2>

                </div>


                <div className="how-it-works-steps">

                    {steps.map((step, index) => (

                        <div
                            className="how-it-works-step-wrapper"
                            key={step.number}
                        >

                            <article className="how-it-works-step">

                                <div className="how-it-works-step-header">

                                    <div className="how-it-works-icon">
                                        {step.icon}
                                    </div>

                                    <span className="how-it-works-number">
                                        {step.number}
                                    </span>

                                </div>

                                <h3>
                                    {step.title}
                                </h3>

                                <p>
                                    {step.description}
                                </p>

                            </article>


                            {index < steps.length - 1 && (

                                <div className="how-it-works-arrow">
                                    <FaChevronRight />
                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </section>

    )

}

export default HowItWorks