import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ProductsSection from './components/ProductsSection/ProductsSection'
import HowItWorks from './components/HowItWorks/HowItWorks'
import AboutSection from './components/AboutSection/AboutSection'
import Footer from './components/Footer/Footer'

import Products from './pages/Products/Products'
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
                    path="/carrinho"
                    element={<Cart />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App