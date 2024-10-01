/* eslint-disable react/prop-types */
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme, useMediaQuery, Box } from "@mui/material";

const ImageCarousel = ({ images, imgStyles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small

  const handleSlideChange = (index) => {
    setCurrentIndex(index);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{ maxWidth: 300, margin: "auto", position: "relative" }}>
      <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={false}
        autoPlay={false}
        selectedItem={currentIndex}
        onChange={handleSlideChange}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{
                position: "absolute",
                zIndex: 2,
                top: "calc(50% - 15px)",
                left: 15,
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "50%",
                padding: "0.5rem",
                border: "none",
                display: "grid",
                placeContent: "center",
              }}
            >
              <KeyboardArrowLeft style={{ color: "black" }} />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{
                position: "absolute",
                zIndex: 2,
                top: "calc(50% - 15px)",
                right: 15,
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "50%",
                padding: "0.5rem",
                border: "none",
                display: "grid",
                placeContent: "center",
              }}
            >
              <KeyboardArrowRight style={{ color: "black" }} />
            </button>
          )
        }
      >
        {images?.map((image, index) => (
          <div key={index}>
            <img
              src={image.url}
              alt={`Slide ${index + 1}`}
              style={{
                height: isSmallScreen ? "300px" : "300px",
                width: "100%",
                objectFit: "cover",
                borderRadius: "1rem",
                ...imgStyles,
              }}
            />
          </div>
        ))}
      </Carousel>

      {/* Thumbnails Section */}
      <Box
        sx={{
          display: "flex",
          gap: ".5rem",
          flexWrap: "wrap",
          marginTop: "1rem",
        }}
      >
        {images?.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => handleThumbnailClick(index)}
            style={{
              cursor: "pointer",
              width: "50px",
              height: "50px",
              marginRight: "8px",
              borderRadius: "4px",
              border: currentIndex === index ? "2px solid #ac7420" : "none",
            }}
          />
        ))}
      </Box>
    </div>
  );
};

export default ImageCarousel;
