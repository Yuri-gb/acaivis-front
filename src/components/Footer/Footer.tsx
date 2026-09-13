import './Footer.css'

import {
    FaInstagram,
    FaWhatsapp,
    FaMapMarkerAlt,
    FaHeart
} from 'react-icons/fa'

import { Link } from 'react-router-dom'

import logo from '../../assets/images/acaivis-logo.webp'


function Footer() {

    return (

        <footer className="footer">


            <div className="footer-main">


                {/* LOGO */}

                <Link
                    to="/"
                    className="footer-logo"
                >

                    <img
                        src={logo}
                        alt="Açaívis"
                    />

                </Link>


                {/* NAVEGAÇÃO */}

                <nav className="footer-navigation">

                    <Link to="/">
                        Início
                    </Link>

                    <Link to="/produtos">
                        Produtos
                    </Link>

                    <Link to="/#como-funciona">
                        Como Funciona
                    </Link>

                    <Link to="/#depoimentos">
                        Depoimentos
                    </Link>

                    <Link to="/#sobre">
                        Sobre
                    </Link>

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