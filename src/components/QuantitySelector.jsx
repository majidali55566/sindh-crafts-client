/* eslint-disable react/prop-types */
import { Button, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useState, useEffect } from "react";

const QuantitySelector = ({
  availableStock,
  onQuantityChange,
  selectedQuantity,
}) => {
  const [quantity, setQuantity] = useState(selectedQuantity || 1); // Start with a quantity of 1

  // Effect to notify the parent of the initial quantity
  useEffect(() => {
    onQuantityChange(quantity);
  }, [quantity]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;

    // Update quantity if it's within valid range
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div>
      <Typography variant="subtitle1">Select Quantity:</Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          disabled={quantity <= 1} // Disable minus button if quantity is 1
          onClick={() => handleQuantityChange(-1)}
          style={{
            minWidth: "30px",
            padding: "0",
            border: "1px solid gray",
          }}
        >
          <Remove />
        </Button>
        <Typography
          variant="body1"
          style={{
            padding: "0 15px",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {quantity} {/* Display the controlled quantity */}
        </Typography>
        <Button
          disabled={quantity >= availableStock} // Disable add button if quantity reaches available stock
          onClick={() => handleQuantityChange(1)}
          style={{
            minWidth: "30px",
            padding: "0",
            border: "1px solid gray",
          }}
        >
          <Add />
        </Button>
      </div>
      {quantity >= availableStock && <p>Maximum avaiable stock reached</p>}
    </div>
  );
};

export default QuantitySelector;
