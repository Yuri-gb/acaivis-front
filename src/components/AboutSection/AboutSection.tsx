import './AboutSection.css'

import {
    FaLeaf,
    FaSnowflake,
    FaCrown,
    FaHeart,
    FaArrowRight
} from 'react-icons/fa'

import aboutDecorationLeft
    from '../../assets/images/about/l.png'

import aboutDecorationRight
    from '../../assets/images/about/r.png'


interface Benefit {
    icon: React.ReactNode
    title: string
    description: string
}


const benefits: Benefit[] = [
    {
        icon: <FaLeaf />,
        title: 'Ingredientes',
        description: 'selecionados'
    },
    {
        icon: <FaSnowflake />,
        title: 'Sempre',
        description: 'geladinho'
    },
    {
        icon: <FaCrown />,
        title: 'Qualidade',
        description: 'em cada garrafa'
    },
    {
        icon: <FaHeart />,
        title: 'Feito com',
        description: 'amor para você'
    }
]


function AboutSection() {
    return (
        <section
            className="about-section"
            id="sobre"
        >

            {/* ========================================
                DECORAÇÕES LATERAIS
                ======================================== */}

            <div className="about-section-decoration">

                <img
                    className="about-section-decoration-left"
                    src={aboutDecorationLeft}
                    alt=""
                    aria-hidden="true"
                />

                <img
                    className="about-section-decoration-right"
                    src={aboutDecorationRight}
                    alt=""
                    aria-hidden="true"
                />

            </div>


            {/* ========================================
                CONTEÚDO
                ======================================== */}

            <div className="about-section-content">

                {/* ========================================
                    TEXTO
                    ======================================== */}

                <div className="about-section-text">

                    <span className="about-section-label">
                        AÇAÍVIS
                    </span>

                    <h2>
                        Mais que açaí,
                        <br />

                        <span>
                            é um estilo de vida.
                        </span>
                    </h2>

                    <p>
                        O Açaívis nasceu com a ideia de levar sabor,
                        praticidade e qualidade para o seu dia a dia.
                        Aqui, cada garrafa é feita com carinho,
                        pensando em quem ama um açaí de verdade.
                    </p>

                    <a
                        href="#sobre"
                        className="about-section-button"
                    >
                        Conheça nossa história

                        <FaArrowRight />
                    </a>

                </div>


                {/* ========================================
                    BENEFÍCIOS
                    ======================================== */}

                <div className="about-section-benefits">

                    {benefits.map((benefit) => (

                        <div
                            className="about-section-benefit"
                            key={benefit.title}
                        >

                            <div className="about-section-benefit-icon">
                                {benefit.icon}
                            </div>

                            <div className="about-section-benefit-text">

                                <span>
                                    {benefit.title}
                                </span>

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


export default AboutSection