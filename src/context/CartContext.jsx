/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setcartItems] = useState([]);

  const addToCart = (cartItem) => {
    setcartItems((prev) => [...prev, cartItem]);
  };
  const removeFromCart = (id) => {
    setcartItems((prev) => prev.filter((item) => item._id !== id));
  };
  const updateCartItem = (updatedCartItem) => {
    setcartItems((prev) =>
      prev.map((item) =>
        item._id === updatedCartItem._id ? item : updateCartItem
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
