/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setcartItems] = useState([]);

  const addToCart = (cartItem) => {
    // Check if item already exists in the cart
    const existingItem = cartItems.find((item) => item._id === cartItem._id);

    if (existingItem) {
      // If item exists, update its quantity
      setcartItems((prev) =>
        prev.map((item) =>
          item._id === cartItem._id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        )
      );
    } else {
      // If item does not exist, add new item to the cart
      setcartItems((prev) => [...prev, cartItem]);
    }
  };
  const removeFromCart = (id) => {
    setcartItems((prev) => prev.filter((item) => item._id !== id));
  };
  const updateCartItem = (updatedCartItem) => {
    setcartItems((prev) =>
      prev.map((item) =>
        item._id === updatedCartItem._id ? updatedCartItem : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        setcartItems,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
