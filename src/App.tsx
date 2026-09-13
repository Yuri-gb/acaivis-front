import { lazy, Suspense } from 'react'

import {
    BrowserRouter,
    Routes,
    Route
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
