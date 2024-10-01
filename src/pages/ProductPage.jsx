import { useContext, useEffect, useState } from "react";
import { Star, StarBorder, Public } from "@mui/icons-material";
import ImageCarousel from "../components/ImageCarousel";
import { Typography, Button, Snackbar, Alert } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import JoinUsModal from "../components/JoinUs";
import useAuth from "../hooks/useAuth";
import ProductPageTabs from "../components/ProductDetailsTabs";
import QuantitySelector from "../components/QuantitySelector";
import axios from "../api/axios";
import SellerRestrictionModal from "../components/SellerRestrictionbuyingAlertModal";
import useAxiosPrivate from "../api/axiosPrivate";
import { CartContext } from "../context/CartContext";

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // Default size
  const [quantity, setQuantity] = useState(0); // Default quantity is 1
  const [IsSignUpModelOpen, setIsSignUpModelOpen] = useState(false);
  const [product, setproduct] = useState({});
  const { addToCart } = useContext(CartContext);

  const [IsBuyingAlertModalOpen, setIsBuyingAlertModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    message: "",
    severity: "",
    open: false,
  }); // Snackbar message

  const { id } = useParams();

  useEffect(() => {
    const getProductById = async () => {
      console.log(quantity);

      try {
        const response = await axios.get(`/api/products/${id}`);
        console.log(response.data);
        if (response.status === 200) {
          setproduct(response.data.product);
        }
        console.log(product);
      } catch (error) {
        console.log(error);
      }
    };
    getProductById();
  }, []);

  const handleCloseSignUpModel = () => {
    setIsSignUpModelOpen(false);
  };

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCartClick = async () => {
    // Validate if color and size are selected
    if (!selectedColor) {
      setSnackbarMessage({
        message: "Please select a color before adding to cart!",
        severity: "error",
        open: true,
      });
      return;
    }

    if (!selectedSize) {
      setSnackbarMessage({
        message: "Please select a size before adding to cart!",
        severity: "error",
        open: true,
      });
      return;
    }

    if (auth?.accessToken) {
      if (auth.user.role === "seller") {
        setIsBuyingAlertModalOpen(true);
      } else {
        // Add to cart
        try {
          const payload = {
            productId: id,
            selectedColor,
            selectedSize,
            quantity,
          };
          const response = await axiosPrivate.post("/api/cart", payload);
          console.log(response.data);

          if (response.status === 200) {
            addToCart(response.data.item);
            setSnackbarMessage({
              message: "Product added to cart successfully",
              severity: "success",
              open: true,
            });
          }
        } catch (error) {
          console.log(error);
          setSnackbarMessage({
            message: "Product couldn't be added to cart!",
            severity: "error",
            open: true,
          });
        }
      }
    } else {
      setIsSignUpModelOpen(true);
    }
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarMessage((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="product-page">
      <div className="main-product-description">
        <div className="images-previewer-and-details">
          <ImageCarousel images={product?.images} />
          <div className="tumbnailimages"></div>
        </div>
        <div className="product-description-details">
          <h3>{product?.name}</h3>
          <div className="d-flex items-center gap-400">
            <div>
              {Array(5)
                .fill(0)
                .map((_, i) =>
                  i < product?.ratings ? (
                    <Star key={i} color="primary" />
                  ) : (
                    <StarBorder key={i} />
                  )
                )}
            </div>
            <p>Ratings</p>
          </div>
          <div className="brand">
            <Typography fontSize=".8rem">
              <span style={{ fontWeight: "bold" }}>Artist shop name: </span>
              <Link to="">{product?.sellerId?.storeName}</Link>
            </Typography>
          </div>
          <div className="price">
            {product?.discountedPrice === product?.price ? (
              <h3 className="actual-price">Rs. {product?.price}</h3>
            ) : (
              <div className="d-flex gap-200 flex-column">
                <div className="d-flex items-center gap-200">
                  <h3 className="discounted-price">
                    Rs. {product?.discountedPrice}
                  </h3>
                  <p
                    style={{
                      textDecoration: "line-through",
                      fontSize: "1.3rem",
                    }}
                  >
                    Rs. {product?.price}
                  </p>
                </div>

                <p className="discount-percentage">
                  {Math.round(
                    ((product?.price - product?.discountedPrice) /
                      product?.price) *
                      100
                  )}
                  % OFF
                </p>
              </div>
            )}
          </div>

          {/* Color Variations */}
          <div className="color-variations">
            <Typography fontWeight={600} variant="subtitle1">
              Select Color:
            </Typography>
            <div className="color-options">
              {product?.colors?.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "contained" : "outlined"}
                  onClick={() => handleColorChange(color)}
                  style={{
                    padding: ".1rem",
                    color: selectedColor === color ? "white" : "black",
                    fontSize: ".8rem",
                    border:
                      selectedColor === color
                        ? "2px solid #ac7420"
                        : "1px solid gray",
                    borderRadius: "5px",
                    transition: "border 0.2s",
                  }}
                >
                  {color}
                </Button>
              ))}
            </div>
            <Typography variant="subtitle2" sx={{ marginTop: "10px" }}>
              Selected Color:{" "}
              <span style={{ fontWeight: "600" }}>{selectedColor}</span>
            </Typography>
          </div>

          {/* Size Variations */}
          <div className="size-variations">
            <Typography fontWeight={600} variant="subtitle1">
              Select Size:
            </Typography>
            <div className="size-options">
              {product?.sizes?.map((size) => (
                <Button
                  variant={selectedSize === size ? "contained" : "outlined"}
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  style={{
                    padding: ".1rem",
                    color: selectedSize === size ? "white" : "black",
                    fontSize: ".8rem",
                    border:
                      selectedSize === size
                        ? "2px solid #ac7420"
                        : "1px solid gray",
                    borderRadius: "5px",
                    transition: "border 0.2s",
                    margin: "5px", // Space between buttons
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
            <Typography variant="subtitle2" sx={{ marginTop: "10px" }}>
              Selected Size:{" "}
              <span style={{ fontWeight: "600" }}>{selectedSize}</span>
            </Typography>
          </div>

          {/* Quantity Selector */}
          <QuantitySelector
            availableStock={product.stock}
            onQuantityChange={handleQuantityChange}
          />
          <div className="d-flex items-center gap-200">
            <Public sx={{ color: "#000000a1" }} fontSize="small" />
            <Typography color="#000000a1" fontSize=".8rem">
              Free shipping
            </Typography>
          </div>

          <Button onClick={handleAddToCartClick} variant="contained">
            Add to cart
          </Button>
        </div>
      </div>
      <div className="details-with-tabs">
        <ProductPageTabs product={product} />{" "}
      </div>

      <JoinUsModal
        formType="signup"
        onClose={handleCloseSignUpModel}
        open={IsSignUpModelOpen}
      />
      <SellerRestrictionModal
        isOpen={IsBuyingAlertModalOpen}
        handleClose={() => setIsBuyingAlertModalOpen(false)}
      />

      {/* Snackbar for Add to Cart */}
      <Snackbar
        open={snackbarMessage.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.severity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductPage;
