import { Button, Divider } from "@mui/material";

/* eslint-disable react/no-unescaped-entities */
const HomePage = () => {
  const categories = [
    { imgPath: "/images/categories/image19.jpg", name: "Dholak" },
    { imgPath: "/images/categories/image20.jpg", name: "Purse" },
    { imgPath: "/images/categories/image21.jpg", name: "Topi" },
    { imgPath: "/images/categories/image22.jpg", name: "Pillows" },
    { imgPath: "/images/categories/image23.jpg", name: "Bedsheets" },
    { imgPath: "/images/categories/image24.png", name: "Cultural suits" },
  ];

  const products = [
    {
      url: "/images/image 18.png",
      name: "Sindhi Purse",
      price: "2304",
      details:
        " Exquisite Sindh handicrafts: timeless elegance, heritage woven,artisanal excellence",
    },
    {
      url: "/images/image 18.png",
      name: "Sindhi Purse",
      price: "2304",
      details:
        " Exquisite Sindh handicrafts: timeless elegance, heritage woven,artisanal excellence",
    },
    {
      url: "/images/image 18.png",
      name: "Sindhi Purse",
      price: "2304",
      details:
        " Exquisite Sindh handicrafts: timeless elegance, heritage woven,artisanal excellence",
    },
    {
      url: "/images/image 18.png",
      name: "Sindhi Purse",
      price: "2304",
      details:
        " Exquisite Sindh handicrafts: timeless elegance, heritage woven,artisanal excellence",
    },
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <img src="/images/cap-banner.jpg" />
        <div className="intro">
          <h1>Sindh's Finest Crafts </h1>
          <p>
            Sindh's Rich Heritage, Crafted into Every Handmade Masterpiece,
            Where Artisans Blend Tradition
          </p>
          <Button variant="contained">Start selling</Button>
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
            <h3>Our</h3>
            <h3>Featured Products</h3>
          </div>
          <Button
            sx={{ display: { xs: "none", sm: "none", md: "block" } }}
            variant="contained"
          >
            See All
          </Button>
        </div>

        <div className="products">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.url} alt={product.name} />
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
              <p className="price">Rs. {product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
