/* eslint-disable react/no-unescaped-entities */
import { Button, Chip, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BecomeASellerModal from "../components/Forms/BecomeASeller";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import JoinUsModal from "../components/JoinUs";
import axios from "../api/axios";

const HomePage = () => {
  const categories = [
    { imgPath: "/images/categories/image19.jpg", name: "Dholak" },
    { imgPath: "/images/categories/image20.jpg", name: "Purse" },
    { imgPath: "/images/categories/image21.jpg", name: "Topi" },
    { imgPath: "/images/categories/image22.jpg", name: "Pillows" },
    { imgPath: "/images/categories/image23.jpg", name: "Bedsheets" },
    { imgPath: "/images/categories/image24.png", name: "Cultural suits" },
  ];

  const navigate = useNavigate();
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Check if more products exist
  const limit = 5; // Products per page

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `/api/products?page=${currentPage}&limit=${limit}`
      );
      const newProducts = response.data.products;

      // Append new products to the existing list
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);

      // Check if there are more products
      if (newProducts.length < limit) {
        setHasMore(false); // Stop further requests if fewer products are returned
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const loadMoreProducts = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1); // Fetch next page
    }
  };

  const [IsBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState(false);
  const [IsJoinUsModalOpen, setIsJoinUsModalOpen] = useState(false);

  const handleBecomeMemberCloseModal = () => {
    setIsBecomeSellerModalOpen(false);
  };

  const handleStartSellingClick = () => {
    if (auth.accessToken) {
      if (auth.user.role === "buyer") setIsBecomeSellerModalOpen(true);
      else navigate("/seller-dashboard");
    } else {
      setIsJoinUsModalOpen(true);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <img src="/images/cap-banner.jpg" />
        <div className="intro">
          <h1>Sindh's Finest Crafts</h1>
          <p>
            Sindh's Rich Heritage, Crafted into Every Handmade Masterpiece,
            Where Artisans Blend Tradition
          </p>
          <Button onClick={handleStartSellingClick} variant="contained">
            Start selling
          </Button>
        </div>
      </div>

      <div className="different-categories">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <div className="image-container">
              <img src={category.imgPath} alt={`alt ${category.name}`} />
            </div>
            <p>{category.name}</p>
          </div>
        ))}
      </div>

      <div className="featured-products">
        <div className="d-flex items-center justify-between">
          <div className="d-flex flex-column">
            <h3>Browse</h3>
            <h3>Our Products</h3>
          </div>
        </div>

        <div className="products">
          {products.map((product, index) => (
            <div
              onClick={() => navigate(`/product/${product._id}`)}
              key={index}
              className="product-card"
            >
              <div className="image-chip-container">
                <img
                  className="product-image"
                  src={product.images[0]?.url}
                  alt={product.name}
                />
                {product.discountedPrice !== product.price && (
                  <Chip
                    className="sell-chip"
                    label="Sell"
                    color="primary"
                    sx={{
                      color: "white",
                      fontSize: ".9rem",
                    }}
                  />
                )}
              </div>
              <Divider
                sx={{
                  color: "main.primary",
                  width: "4rem",
                  borderBottomWidth: ".2rem",
                }}
                orientation="horizontal"
              />
              <p className="name">{product.name}</p>
              <p className="details">{product.details}</p>
              <div>
                {product.price === product.discountedPrice ? (
                  <p className="price">Rs. {product.price}</p>
                ) : (
                  <div className="d-flex items-center gap-200">
                    <p className="discounted-price">
                      Rs. {product.discountedPrice}
                    </p>
                    <p
                      style={{
                        fontSize: ".9rem",
                        textDecoration: "line-through",
                      }}
                    >
                      {product.price}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="d-flex justify-center items-center">
            <Button onClick={loadMoreProducts} variant="contained">
              Load More
            </Button>
          </div>
        )}
      </div>

      <BecomeASellerModal
        open={IsBecomeSellerModalOpen}
        onClose={handleBecomeMemberCloseModal}
      />
      <JoinUsModal
        formType="signin"
        open={IsJoinUsModalOpen}
        onClose={() => setIsJoinUsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
