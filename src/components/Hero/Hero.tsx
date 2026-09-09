import './Hero.css'

import aGenteSabe
    from '../../assets/images/a-gente-sabe..png'

import heroBackground
    from '../../assets/images/hero-background2.png'

import heroBackgroundMobile
    from '../../assets/images/hero-background-mobile..png'


function Hero() {

    return (

        <section className="hero">

            <picture className="hero-background">

                <source
                    media="(max-width: 792px)"
                    srcSet={heroBackgroundMobile}
                />

                <img
                    src={heroBackground}
                    alt=""
                    aria-hidden="true"
                />

            </picture>


            <div className="hero-content">

                <span className="hero-brand">
                    AÇAÍVIS
                </span>


                <h1>

                    Uma garrafa

                    <br />

                    não é suficiente.

                </h1>


                <img
                    className="hero-highlight"
                    src={aGenteSabe}
                    alt="A gente sabe."
                />


                <p className="hero-description">

                    Açaí de verdade, cremoso e geladinho,

                    <br />

                    pronto para deixar seu dia mais gostoso.

                </p>


                <div className="hero-buttons">

                    <a
                        href="#carrinho"
                        className="hero-button hero-button-primary"
                    >
                        Fazer meu pedido
                    </a>


                    <a
                        href="#produtos"
                        className="hero-button hero-button-secondary"
                    >
                        Ver produtos
                    </a>

                </div>

            </div>

        </section>

    )

}


export default Hero