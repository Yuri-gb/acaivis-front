import './Navbar.css'

import logo from '../../assets/images/acaivis-logo.png.png'

import { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'

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

                <a href="/">

                    <img
                        src={logo}
                        alt="Açaívis"
                    />

                </a>

            </div>


            {/* ========================================
                LINKS DESKTOP
                ======================================== */}

            <div className="navbar-links">


                {/* Início */}

                <a
                    className={
                        isHomeActive
                            ? 'active'
                            : ''
                    }
                    href="/"
                >
                    Início
                </a>


                {/* Produtos */}

                <a
                    className={
                        isProductsActive
                            ? 'active'
                            : ''
                    }
                    href="/produtos"
                >
                    Produtos
                </a>


                {/* Como Funciona */}

                <a
                    className={
                        isHowItWorksActive
                            ? 'active'
                            : ''
                    }
                    href="/#como-funciona"
                >
                    Como Funciona
                </a>


                {/* Depoimentos */}

                <a
                    className={
                        isTestimonialsActive
                            ? 'active'
                            : ''
                    }
                    href="/#depoimentos"
                >
                    Depoimentos
                </a>


                {/* Sobre */}

                <a
                    className={
                        isAboutActive
                            ? 'active'
                            : ''
                    }
                    href="/#sobre"
                >
                    Sobre
                </a>

            </div>


            {/* ========================================
                AÇÕES
                ======================================== */}

            <div className="navbar-actions">


                {/* ========================================
                    CARRINHO
                    ======================================== */}

                <a
                    className={
                        `cart-button ${
                            isCartActive
                                ? 'active'
                                : ''
                        }`
                    }
                    href="/carrinho"
                >

                    <FaShoppingCart />

                    <span className="cart-count">
                        0
                    </span>

                </a>


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

                        <a
                            className={
                                `mobile-menu-item ${
                                    isHomeActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            href="/"
                        >

                            <FaHome />

                            <span>
                                Início
                            </span>

                            <FaChevronRight />

                        </a>


                        {/* ========================================
                            PRODUTOS
                            ======================================== */}

                        <a
                            className={
                                `mobile-menu-item ${
                                    isProductsActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            href="/produtos"
                        >

                            <FaBox />

                            <span>
                                Produtos
                            </span>

                            <FaChevronRight />

                        </a>


                        {/* ========================================
                            COMO FUNCIONA
                            ======================================== */}

                        <a
                            className={
                                `mobile-menu-item ${
                                    isHowItWorksActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            href="/#como-funciona"
                        >

                            <FaQuestionCircle />

                            <span>
                                Como Funciona
                            </span>

                            <FaChevronRight />

                        </a>


                        {/* ========================================
                            DEPOIMENTOS
                            ======================================== */}

                        <a
                            className={
                                `mobile-menu-item ${
                                    isTestimonialsActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            href="/#depoimentos"
                        >

                            <FaStar />

                            <span>
                                Depoimentos
                            </span>

                            <FaChevronRight />

                        </a>


                        {/* ========================================
                            SOBRE
                            ======================================== */}

                        <a
                            className={
                                `mobile-menu-item ${
                                    isAboutActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            href="/#sobre"
                        >

                            <FaInfoCircle />

                            <span>
                                Sobre
                            </span>

                            <FaChevronRight />

                        </a>


                        {/* ========================================
                            SEPARADOR
                            ======================================== */}

                        <div className="mobile-menu-divider">
                        </div>


                        {/* ========================================
                            CARRINHO
                            ======================================== */}

                        <a
                            className={
                                `mobile-menu-cart ${
                                    isCartActive
                                        ? 'active'
                                        : ''
                                }`
                            }
                            href="/carrinho"
                        >

                            <FaShoppingCart />

                            <span>
                                Carrinho
                            </span>

                            <FaChevronRight />

                        </a>


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