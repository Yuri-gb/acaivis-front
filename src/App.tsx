import { lazy, Suspense, useEffect } from 'react'

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from 'react-router-dom'

import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ProductsSection from './components/ProductsSection/ProductsSection'
import HowItWorks from './components/HowItWorks/HowItWorks'
import AboutSection from './components/AboutSection/AboutSection'
import Footer from './components/Footer/Footer'

const Products = lazy(
    () => import('./pages/Products/Products')
)

import ProductDetails from './pages/ProductDetails/ProductDetails'
import Cart from './pages/Cart/Cart'

function ScrollToTop() {
    const {
        pathname,
        hash
    } = useLocation()

    useEffect(() => {
        if (hash) {
            const id = decodeURIComponent(
                hash.slice(1)
            )

            const element =
                document.getElementById(id)

            if (element) {
                element.scrollIntoView()
                return
            }
        }

        window.scrollTo(0, 0)
    }, [pathname, hash])

    return null
}

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <ProductsSection />
            <HowItWorks />
            <AboutSection />
            <Footer />
        </>
    )
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Suspense fallback={null}>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/produtos"
                        element={<Products />}
                    />

                    <Route
                        path="/produtos/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/carrinho"
                        element={<Cart />}
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App