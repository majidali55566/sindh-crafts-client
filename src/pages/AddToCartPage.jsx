import { Divider, Paper, Typography, Chip, Button } from "@mui/material";
import QuantitySelector from "../components/QuantitySelector"; // Import the QuantitySelector component
import { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../api/axiosPrivate";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const AddToCartPage = () => {
  const { cartItems, setcartItems } = useContext(CartContext);
  const [initialQuantities, setInitialQuantities] = useState({});
  const [subtotal, setSubtotal] = useState(0); // State to store the subtotal
  const [updatedItems, setUpdatedItems] = useState({}); // State to track if individual quantities have changed
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getUserCart = async () => {
      try {
        const response = await axiosPrivate.get("/api/cart");
        if (response.status === 200) {
          setcartItems(response.data.items);

          // Ensure all items are reflected in initialQuantities
          const quantities = response.data.items.reduce((acc, item) => {
            acc[item._id] = item.quantity;
            return acc;
          }, {});
          setInitialQuantities(quantities); // Save initial quantities

          // Initialize updatedItems: none of the items should be marked as updated initially
          const updatedState = response.data.items.reduce((acc, item) => {
            acc[item._id] = false; // Mark all items as not updated initially
            return acc;
          }, {});
          setUpdatedItems(updatedState);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserCart();
  }, []);

  console.log("Cart container rendered");

  // Ensure initialQuantities are updated when cartItems change (including new items)
  useEffect(() => {
    const newQuantities = cartItems.reduce((acc, item) => {
      if (!(item._id in initialQuantities)) {
        acc[item._id] = item.quantity;
      }
      return acc;
    }, {});

    if (Object.keys(newQuantities).length > 0) {
      setInitialQuantities((prevQuantities) => ({
        ...prevQuantities,
        ...newQuantities,
      }));
    }
  }, [cartItems]);

  // Handle quantity change for a specific product
  const handleQuantityChange = (id, newQuantity) => {
    setcartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // Check if the new quantity is different from the initial quantity
    if (newQuantity !== initialQuantities[id]) {
      setUpdatedItems((prevUpdatedItems) => ({
        ...prevUpdatedItems,
        [id]: true, // Mark this item as updated
      }));
    } else {
      setUpdatedItems((prevUpdatedItems) => ({
        ...prevUpdatedItems,
        [id]: false, // Reset if the quantity matches the initial quantity
      }));
    }
  };

  // Calculate the subtotal whenever cartItems are updated
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.discountedPrice * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  // Handle the update button click to save changes for a specific item
  const handleUpdateItem = async (item) => {
    try {
      const response = await axiosPrivate.put(`/api/cart/update-quantity/`, {
        quantity: item.quantity,
        productId: item.product._id,
      });
      if (response.status === 200) {
        setInitialQuantities((prevQuantities) => ({
          ...prevQuantities,
          [item._id]: item.quantity,
        })); // Reset the initial quantity for this item
        setUpdatedItems((prevUpdatedItems) => ({
          ...prevUpdatedItems,
          [item._id]: false, // Reset the updated state for this item
        }));
        console.log(`Item ${item._id} updated successfully`);
      }
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  const handleDeleteItemFromCart = async (item) => {
    try {
      const response = await axiosPrivate.post("/api/cart/products/delete", {
        productId: item.product._id,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      });
      if (response.status === 200) {
        setcartItems((prev) =>
          prev.filter(
            (cartItem) =>
              // Check all three properties: product ID, selectedColor, and selectedSize
              !(
                cartItem.product._id === response.data.productId &&
                cartItem.selectedColor === response.data.selectedColor &&
                cartItem.selectedSize === response.data.selectedSize
              )
          )
        );
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-to-cart-page">
      <Paper sx={{ padding: "1rem" }}>
        <div className="d-flex items-center justify-between">
          <h3>Shopping Cart</h3>
          <p className="price-label">Price</p>
        </div>
        <Divider />
        {cartItems?.map((item) => (
          <div
            key={item._id}
            className="cart-product"
            style={{ marginBottom: "1rem" }}
          >
            <div className="product-details">
              <img src={item?.product?.images[0].url} alt={item.product.name} />
              <div className="d-flex flex-column gap-200">
                <h4>{item.product.name}</h4>
                <Typography color="green" fontSize=".8rem">
                  {item.product.stock > 0 && "In Stock"}
                </Typography>
                <Typography fontSize=".8rem">
                  <span style={{ fontWeight: "600" }}>Color:</span>{" "}
                  {item.selectedColor}
                </Typography>
                <Typography fontSize=".8rem">
                  <span style={{ fontWeight: "600" }}>Size:</span>{" "}
                  {item.selectedSize}
                </Typography>
                {/* Add QuantitySelector */}
                <QuantitySelector
                  selectedQuantity={item.quantity}
                  availableStock={item.product.stock}
                  onQuantityChange={(newQuantity) =>
                    handleQuantityChange(item._id, newQuantity)
                  }
                />
                <Divider orientation="horizontal" />
                <div className="d-flex">
                  {updatedItems[item._id] && (
                    <Chip
                      color="success"
                      label="Update"
                      clickable
                      sx={{ fontSize: ".6rem" }}
                      onClick={() => handleUpdateItem(item)}
                    />
                  )}
                  <Chip
                    onClick={() => handleDeleteItemFromCart(item)}
                    clickable
                    variant="outlined"
                    label="Delete"
                  />
                </div>
              </div>
            </div>
            <div className="price d-flex items-center gap-200">
              <p className="price-label-2">Price: </p>
              <Typography fontSize=".8rem" fontWeight="bold">
                {/* Use discountedPrice for the calculation */}
                Rs. {item.product.discountedPrice * item.quantity}
              </Typography>
            </div>
            <Divider sx={{ display: { xs: "block", sm: "none" } }} />
          </div>
        ))}
        <Divider />
        <div className="sub-total-price">
          <Typography fontWeight="bold">
            Subtotal ({cartItems?.length} product(s)): Rs. {subtotal}
          </Typography>
          <Link to="/checkout">
            <Button variant="contained" disabled={cartItems.length === 0}>
              Proceed to checkout
            </Button>
          </Link>
        </div>
      </Paper>
    </div>
  );
};

export default AddToCartPage;
