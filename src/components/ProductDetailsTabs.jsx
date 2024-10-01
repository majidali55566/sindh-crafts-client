/* eslint-disable react/prop-types */
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Paper, Modal } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default function ProductPageTabs({ product }) {
  const [value, setValue] = React.useState(0);
  const [selectedImage, setSelectedImage] = React.useState(null); // State for image preview

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set selected image for preview
  };

  const handleClose = () => {
    setSelectedImage(null); // Close the image preview
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ bgcolor: "#fff" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="product page tabs example"
        >
          <Tab label="Description" />
          <Tab label="Reviews" />
          <Tab label="Support" />
        </Tabs>
        <TabPanel value={value} index={0}>
          {product.description}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {product?.reviews?.length > 0 ? (
            product?.reviews?.map((review, idx) => (
              <Paper
                sx={{ padding: "1rem", marginBlock: ".5rem" }}
                elevation={3}
                key={idx}
              >
                <div className="d-flex justify-between">
                  <Typography fontSize=".8rem" fontWeight={600}>
                    {review?.username}
                  </Typography>
                  <Typography fontSize=".8rem" fontWeight={600}>
                    2 days ago
                  </Typography>
                </div>
                <Typography>
                  {Array(5)
                    .fill(0)
                    .map((_, i) =>
                      i < review?.stars ? (
                        <Star fontSize="small" key={i} color="primary" />
                      ) : (
                        <StarBorder fontSize="small" key={i} />
                      )
                    )}
                </Typography>
                <Typography fontSize=".9rem">{review?.comment}</Typography>
                <div className="d-flex items-center">
                  {review?.images?.map((image, index) => (
                    <img
                      width={50}
                      style={{ marginInline: ".5rem", cursor: "pointer" }}
                      height={50}
                      key={index}
                      src={image.url}
                      alt={`Review ${index}`}
                      onClick={() => handleImageClick(image.url)} // On image click, show preview
                    />
                  ))}
                </div>
              </Paper>
            ))
          ) : (
            <Typography>No reviews yet.</Typography>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Support information will go here.</Typography>
        </TabPanel>
      </Box>

      {/* Modal for image preview */}
      <Modal
        open={!!selectedImage}
        onClose={handleClose}
        aria-labelledby="image-preview-modal"
        aria-describedby="image-preview-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
            maxWidth: 600,
            maxHeight: 600,
          }}
        >
          <img
            src={selectedImage}
            alt="Review Preview"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
