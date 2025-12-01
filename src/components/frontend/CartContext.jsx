import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            let updatedCart;
            if (existing) {
                updatedCart = prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedCart = [...prev, { ...product, quantity: 1 }];
            }
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // persist
            return updatedCart;
        });
        console.log("Added to cart:", product);
    };

    const increaseQuantity = (id) => {
        setCartItems((prev) => {
            const updated = prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
            localStorage.setItem("cart", JSON.stringify(updated));
            return updated;
        });
    };

    const decreaseQuantity = (id) => {
        setCartItems((prev) => {
            const updated = prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0);
            localStorage.setItem("cart", JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => {
            const updated = prev.filter((item) => item.id !== id);
            localStorage.setItem("cart", JSON.stringify(updated));
            return updated;
        });
    };

    // Sync cartItems from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
