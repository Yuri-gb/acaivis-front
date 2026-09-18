import type { CartItem } from '../types/api'

const KEY = 'acaivis_cart'

export function getCart(): CartItem[] {
    try {
        return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
        return []
    }
}

export function saveCart(items: CartItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('acaivis-cart-updated'))
}

export function addToCart(item: Omit<CartItem, 'id'>) {
    const cart = getCart()
    const existing = cart.find((i) => i.productId === item.productId)

    if (existing) {
        existing.quantity += item.quantity
    } else {
        cart.push({ ...item, id: Date.now() })
    }

    saveCart(cart)

    window.dispatchEvent(new CustomEvent('acaivis-cart-added', {
        detail: {
            name: item.name,
            quantity: item.quantity
        }
    }))
}

export function updateCartQuantity(productId: number, quantity: number) {
    const cart = getCart()
        .map((i) => i.productId === productId ? { ...i, quantity } : i)
        .filter((i) => i.quantity > 0)

    saveCart(cart)
}

export function removeFromCart(productId: number) {
    saveCart(getCart().filter((i) => i.productId !== productId))
}

export function clearCart() {
    saveCart([])
}
