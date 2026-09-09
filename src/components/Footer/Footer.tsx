import './Footer.css'

import {
    FaInstagram,
    FaWhatsapp,
    FaMapMarkerAlt,
    FaHeart
} from 'react-icons/fa'

import logo from '../../assets/images/acaivis-logo.png.png'


function Footer() {

    return (

        <footer className="footer">


            <div className="footer-main">


                {/* LOGO */}

                <a
                    href="/"
                    className="footer-logo"
                >

                    <img
                        src={logo}
                        alt="Açaívis"
                    />

                </a>


                {/* NAVEGAÇÃO */}

                <nav className="footer-navigation">

                    <a href="/">
                        Início
                    </a>

                    <a href="/produtos">
                        Produtos
                    </a>

                    <a href="#como-funciona">
                        Como Funciona
                    </a>

                    <a href="#depoimentos">
                        Depoimentos
                    </a>

                    <a href="#sobre">
                        Sobre
                    </a>
                </nav>


                {/* CONTATOS */}

                <div className="footer-contact">


                    {/* Instagram */}

                    <a
                        href="https://www.instagram.com/acaivis75/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social"
                        aria-label="Instagram do Açaívis"
                    >

                        <FaInstagram />

                    </a>


                    {/* WhatsApp */}

                    <a
                        href="https://wa.me/557591729956?text=Ol%C3%A1%21%20Gostaria%20de%20fazer%20um%20pedido"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social"
                        aria-label="WhatsApp do Açaívis"
                    >

                        <FaWhatsapp />

                    </a>


                    {/* Localização */}

                    <span className="footer-location">

                        <FaMapMarkerAlt />

                        <span>
                            Feira de Santana - BA
                        </span>

                    </span>


                </div>

            </div>


            {/* LINHA INFERIOR */}

            <div className="footer-bottom">


                <p>

                    Açaívis. Mais sabor, mais momentos.

                    <FaHeart />

                </p>


                <span className="footer-developed">

                    Desenvolvido com

                    <FaHeart />

                </span>


            </div>


        </footer>

    )

}


export default Footer