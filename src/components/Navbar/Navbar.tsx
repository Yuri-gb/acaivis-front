import './Navbar.css'

import logo from '../../assets/images/acaivis-logo.webp'

import { useEffect, useState } from 'react'

import {
    Link,
    useLocation
} from 'react-router-dom'

import {
    FaWhatsapp,
    FaBars,
    FaTimes,
    FaHome,
    FaBox,
    FaQuestionCircle,
    FaStar,
    FaInfoCircle,
    FaChevronRight,
    FaShoppingCart
} from 'react-icons/fa'


function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false)
    const [menuClosing, setMenuClosing] = useState(false)

    const location = useLocation()


    const closeMenu = () => {

        setMenuClosing(true)

        setTimeout(() => {

            setMenuOpen(false)
            setMenuClosing(false)

        }, 300)

    }


    const toggleMenu = () => {

        if (menuOpen) {

            closeMenu()

            return
        }

        setMenuOpen(true)

    }


    useEffect(() => {

        const handleResize = () => {

            if (window.innerWidth > 792) {

                setMenuOpen(false)
                setMenuClosing(false)

            }

        }


        window.addEventListener(
            'resize',
            handleResize
        )


        return () => {

            window.removeEventListener(
                'resize',
                handleResize
            )

        }

    }, [])


    /*
    ========================================
    ROTAS ATIVAS
    ========================================
    */

    const isHomeActive =
        location.pathname === '/'

    const isProductsActive =
        location.pathname === '/produtos'

    const isCartActive =
        location.pathname === '/carrinho'

    const isHowItWorksActive =
        location.pathname === '/como-funciona'

    const isTestimonialsActive =
        location.pathname === '/depoimentos'

    const isAboutActive =
        location.pathname === '/sobre'


    return (

        <nav className="navbar">


            {/* ========================================
                LOGO
                ======================================== */}

            <div className="navbar-logo">

                <Link to="/">

                    <img
                        src={logo}
                        alt="Açaívis"
                    />

                </Link>

            </div>


            {/* ========================================
                LINKS DESKTOP
                ======================================== */}

            <div className="navbar-links">


                {/* Início */}

                <Link
                    className={
                        isHomeActive
                            ? 'active'
                            : ''
                    }
                    to="/"
                >
                    Início
                </Link>


                {/* Produtos */}

                <Link
                    className={
                        isProductsActive
                            ? 'active'
                            : ''
                    }
                    to="/produtos"
                >
                    Produtos
                </Link>


                {/* Como Funciona */}

                <Link
                    className={
                        isHowItWorksActive
                            ? 'active'
                            : ''
                    }
                    to="/#como-funciona"
                >
                    Como Funciona
                </Link>


                {/* Depoimentos */}

                <Link
                    className={
                        isTestimonialsActive
                            ? 'active'
                            : ''
                    }
                    to="/#depoimentos"
                >
                    Depoimentos
                </Link>


                {/* Sobre */}

                <Link
                    className={
                        isAboutActive
                            ? 'active'
                            : ''
                    }
                    to="/#sobre"
                >
                    Sobre
                </Link>


            </div>


            {/* ========================================
                AÇÕES
                ======================================== */}

            <div className="navbar-actions">


                {/* ========================================
                    CARRINHO
                    ======================================== */}

                <Link
                    className={
                        `cart-button ${
                            isCartActive
                                ? 'active'
                                : ''
                        }`
                    }
                    to="/carrinho"
                >

                    <FaShoppingCart />

                    <span className="cart-count">
                        0
                    </span>

                </Link>


                {/* ========================================
                    WHATSAPP
                    ======================================== */}

                <a
                    className="whatsapp-button"
                    href="https://wa.me/557591729956?text=Ol%C3%A1%21%20Gostaria%20de%20fazer%20um%20pedido"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    <FaWhatsapp />

                    Peça agora no WhatsApp

                </a>


                {/* ========================================
                    BOTÃO MENU
                    ======================================== */}

                <button
                    className="menu-button"
                    onClick={toggleMenu}
                    aria-label="Abrir menu"
                >

                    {menuOpen

                        ? <FaTimes />

                        : <FaBars />

                    }

                </button>


            </div>


            {/* ========================================
                MENU MOBILE
                ======================================== */}

            {menuOpen && (

                <>

                    {/* Overlay */}

                    <div
                        className={`mobile-menu-overlay ${
                            menuClosing
                                ? 'closing'
                                : ''
                        }`}
                        onClick={closeMenu}
                    >
                    </div>


                    {/* Painel */}

                    <div
                        className={`mobile-menu ${
                            menuClosing
                                ? 'closing'
                                : ''
                        }`}
                    >


                        {/* ========================================
                            CABEÇALHO
                            ======================================== */}

                        <div className="mobile-menu-header">

                            <img
                                src={logo}
                                alt="Açaívis"
                            />

                            <button
                                className="mobile-menu-close"
                                onClick={closeMenu}
                                aria-label="Fechar menu"
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* ========================================
                            INÍCIO
                            ======================================== */}

                        <Link
                            className={
                                `mobile-menu-item ${
                                    isHomeActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            to="/"
                            onClick={closeMenu}
                        >

                            <FaHome />

                            <span>
                                Início
                            </span>

                            <FaChevronRight />

                        </Link>


                        {/* ========================================
                            PRODUTOS
                            ======================================== */}

                        <Link
                            className={
                                `mobile-menu-item ${
                                    isProductsActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            to="/produtos"
                            onClick={closeMenu}
                        >

                            <FaBox />

                            <span>
                                Produtos
                            </span>

                            <FaChevronRight />

                        </Link>


                        {/* ========================================
                            COMO FUNCIONA
                            ======================================== */}

                        <Link
                            className={
                                `mobile-menu-item ${
                                    isHowItWorksActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            to="/#como-funciona"
                            onClick={closeMenu}
                        >

                            <FaQuestionCircle />

                            <span>
                                Como Funciona
                            </span>

                            <FaChevronRight />

                        </Link>


                        {/* ========================================
                            DEPOIMENTOS
                            ======================================== */}

                        <Link
                            className={
                                `mobile-menu-item ${
                                    isTestimonialsActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            to="/#depoimentos"
                            onClick={closeMenu}
                        >

                            <FaStar />

                            <span>
                                Depoimentos
                            </span>

                            <FaChevronRight />

                        </Link>


                        {/* ========================================
                            SOBRE
                            ======================================== */}

                        <Link
                            className={
                                `mobile-menu-item ${
                                    isAboutActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            to="/#sobre"
                            onClick={closeMenu}
                        >

                            <FaInfoCircle />

                            <span>
                                Sobre
                            </span>

                            <FaChevronRight />

                        </Link>


                        {/* ========================================
                            SEPARADOR
                            ======================================== */}

                        <div className="mobile-menu-divider">
                        </div>


                        {/* ========================================
                            CARRINHO
                            ======================================== */}

                        <Link
                            className={
                                `mobile-menu-cart ${
                                    isCartActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            to="/carrinho"
                            onClick={closeMenu}
                        >

                            <FaShoppingCart />

                            <span>
                                Carrinho
                            </span>

                            <FaChevronRight />

                        </Link>


                        {/* ========================================
                            WHATSAPP
                            ======================================== */}

                        <a
                            className="mobile-menu-whatsapp"
                            href="https://wa.me/557591729956?text=Ol%C3%A1%21%20Gostaria%20de%20fazer%20um%20pedido"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            <FaWhatsapp />

                            <span>
                                Peça agora no WhatsApp
                            </span>

                            <FaChevronRight />

                        </a>


                    </div>

                </>

            )}


        </nav>

    )

}


export default Navbar