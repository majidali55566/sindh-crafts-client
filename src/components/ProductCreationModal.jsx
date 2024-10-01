/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Slide,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Box,
  TextField,
  InputAdornment,
  Snackbar,
  CircularProgress, // Import Snackbar for notifications
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CustomTextField } from "./CustomTextField";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Add, Delete } from "@mui/icons-material";
import UploadFilesDropZone from "./UploadFileDropZone";
import useAxiosPrivate from "../api/axiosPrivate";
import MuiAlert from "@mui/material/Alert"; // For alert messages

// Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Transition for the Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required")
    .max(100, "Product name cannot exceed 100 characters"),
  description: Yup.string()
    .required("Product description is required")
    .max(2000, "Description cannot exceed 2000 characters"),
  price: Yup.number()
    .required("Product price is required")
    .positive("Price must be positive"),
  discountedPrice: Yup.number().required(
    "discounted price is required (if you don't want to give discount,remain discount price to same as actual price "
  ),
  stock: Yup.number()
    .required("Product stock is required")
    .min(0, "Stock cannot be negative"),
  categories: Yup.array()
    .of(Yup.string())
    .min(1, "At least one category is required"),
  colors: Yup.array()
    .of(Yup.string())
    .required("At least one color is required"),
  sizes: Yup.array().of(Yup.string()).required("At least one size is required"),
  images: Yup.array()
    .min(1, "Please upload at least 1 image")
    .required("Images of product are required"),
});

// Predefined category options
const predefinedCategories = [
  "Clothing",
  "Jewelry",
  "Accessories",
  "Handicrafts",
  "Home Decor",
  "Furniture",
  "Art and Paintings",
  "Musical Instruments",
  "Artifacts",
  "Textiles",
  "Footwear",
];

export default function CreateProductDialog({
  open,
  onClose,
  handleAddTotalProducts,
  hanldeUpdateProduct,
  isEditMode = false,
  productData,
}) {
  const [categories, setCategories] = useState(predefinedCategories); // State to store predefined and custom categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // State for snackbar severity
  const axiosPrivate = useAxiosPrivate();

  // Handle custom category addition
  const handleAddCustomCategory = (customCategory) => {
    if (customCategory && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
      setSelectedCategories([...selectedCategories, customCategory]);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true); // Set loading to true
    try {
      const id = productData._id;
      const uri = isEditMode ? `/api/products/${id}` : "/api/products";

      const method = isEditMode ? "put" : "post";
      const response = await axiosPrivate[method](uri, values);

      if (response.status === isEditMode ? "200" : "201") {
        setSnackbarMessage(
          isEditMode
            ? "Product Updated sucessfully"
            : "Product created successfully!"
        );
        setSnackbarSeverity("success");
        if (!isEditMode) handleAddTotalProducts(response?.data?.product);
        else hanldeUpdateProduct(response?.data?.product);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      setSnackbarMessage(
        isEditMode ? "Failed to update product" : "Failed to create product."
      );
      setSnackbarSeverity("error");
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false
      setSnackbarOpen(true); // Show snackbar
    }
    setSubmitting(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog
      className="seller-creation-product-modal"
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {isEditMode ? "Edit Product" : "Create Product"}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="modal-container">
        <h2>Product Information</h2>
        <Formik
          initialValues={
            isEditMode
              ? productData
              : {
                  name: "",
                  description: "",
                  price: "",
                  stock: "",
                  discountedPrice: "",
                  categories: [],
                  colors: [""], // Start with one empty color
                  sizes: [""], // Start with one empty size
                  images: [],
                }
          }
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form className="d-flex flex-column gap-400">
              <CustomTextField name="name" label="Product Name" />
              <CustomTextField
                name="description"
                label="Product Description"
                multiline
                rows={4}
              />
              <div className="upload-product-images">
                <p>Upload Product Images</p>
                <div>
                  <UploadFilesDropZone
                    accept={{
                      "image/*": [".jpeg", ".png", ".jpg"],
                    }}
                    onDrop={(uploadedImages) => {
                      const allImages = [...values.images, ...uploadedImages];
                      setFieldValue("images", allImages);
                    }}
                    files={values.images}
                    maxFiles={10}
                    onRemove={(deletedImage) => {
                      setFieldValue(
                        "images",
                        values.images.filter(
                          (image) => image.public_id !== deletedImage.public_id
                        )
                      );
                    }}
                  />
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className="d-flex gap-400">
                <CustomTextField
                  name="price"
                  label="Actual Price"
                  type="number"
                />
                <CustomTextField
                  name="discountedPrice"
                  label="Discounted Price"
                  type="number"
                />
                <CustomTextField name="stock" label="Stock" type="number" />
              </div>

              {/* Multiple Select for Categories */}
              <Box className="d-flex flex-column gap-400">
                <Typography fontWeight={600}>Select Categories</Typography>
                <Select
                  label="Categories"
                  multiple
                  value={values.categories} // Use Formik's field value
                  onChange={(event) =>
                    setFieldValue("categories", event.target.value)
                  } // Set Formik field
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>

                {/* Custom Category Input */}
                <Box mt={2}>
                  <TextField
                    label="Add Custom Category"
                    fullWidth
                    value={customCategory} // Use a state to manage the input value
                    onChange={(event) => setCustomCategory(event.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={!customCategory.trim()} // Disable if the input is empty
                            onClick={() => {
                              handleAddCustomCategory(customCategory.trim());
                              setCustomCategory(""); // Clear the input after adding
                            }}
                          >
                            Add
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              {/* Colors and Sizes Field Arrays */}
              <div className="colors-sizes">
                <div className="color-attributes">
                  <Typography fontWeight={600}>Add Colors</Typography>
                  <FieldArray name="colors">
                    {({ push, remove }) => (
                      <div>
                        {values.colors.map((color, index) => (
                          <div className="d-flex" key={index}>
                            <CustomTextField
                              name={`colors[${index}]`}
                              label={`Color ${index + 1}`}
                              value={color}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <IconButton
                              variant="outlined"
                              color="secondary"
                              onClick={() => remove(index)}
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        ))}
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => push("")}
                          startIcon={<Add />}
                        >
                          Add Color
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="size-attributes">
                  <Typography fontWeight={600}>Add Sizes</Typography>
                  <FieldArray name="sizes">
                    {({ push, remove }) => (
                      <div>
                        {values.sizes.map((size, index) => (
                          <div className="d-flex" key={index}>
                            <CustomTextField
                              name={`sizes[${index}]`}
                              label={`Size ${index + 1}`}
                              value={size}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <IconButton
                              variant="outlined"
                              color="secondary"
                              onClick={() => remove(index)}
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        ))}
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => push("")}
                          startIcon={<Add />}
                        >
                          Add Size
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* Submit Button with Loading Spinner */}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading} // Disable button while loading
                sx={{ marginTop: 2 }}
              >
                {loading
                  ? "Creating..."
                  : isEditMode
                    ? "Edit Product"
                    : "Create Product"}
                {loading && (
                  <CircularProgress size={24} sx={{ position: "absolute" }} />
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
