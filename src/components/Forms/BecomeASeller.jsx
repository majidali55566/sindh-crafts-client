/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CustomTextField } from "../CustomTextField";
import useAxiosPrivate from "../../api/axiosPrivate";
import { useState } from "react";

const BecomeASellerModal = ({ open, onClose }) => {
  const initialValues = {
    storeName: "",
    storeDescription: "",
    contact: "",
    address: "",
    zipCode: "",
  };
  const axiosPrivate = useAxiosPrivate();

  const validationSchema = Yup.object().shape({
    storeName: Yup.string().required("Store name is required"),
    storeDescription: Yup.string().required("Store description is required"),
    contact: Yup.string().required("Contact number is required"),
    address: Yup.string().required("Address is required"),
    zipCode: Yup.string().required("Zip code is required"),
  });
  const [BecomeSellerAlert, setBecomeSellerAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axiosPrivate.post(
        "/api/sellers/become-a-seller",
        values
      );
      console.log(response);
      if (response.status === 201) {
        setBecomeSellerAlert((prev) => ({
          ...prev,
          open: true,
          message: "You are successfully registered",
          severity: "success",
        }));
        const user = JSON.parse(localStorage.getItem("user"));
        user.role = "seller";

        localStorage.setItem("user", JSON.stringify(user));
        resetForm();

        setTimeout(() => {
          onClose();
          setBecomeSellerAlert((prev) => ({
            ...prev,
            open: false,
            message: "",
            severity: "",
          }));
        }, 4000);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setBecomeSellerAlert((prev) => ({
          ...prev,
          open: true,
          message: "A seller is already registered with this email",
          severity: "error",
        }));
        setTimeout(() => {
          setBecomeSellerAlert((prev) => ({
            ...prev,
            open: false,
            message: "",
            severity: "",
          }));
        }, 4000);
      } else {
        setBecomeSellerAlert((prev) => ({
          ...prev,
          open: true,
          message: "Internal server Error",
          severity: "error",
        }));
        setTimeout(() => {
          setBecomeSellerAlert((prev) => ({
            ...prev,
            open: false,
            message: "",
            severity: "",
          }));
        }, 4000);
      }
      console.log(error);
    }
    // Handle the form submission
    console.log("Form values:", values);
    // You can add your API call here to save seller details
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Become a Seller</DialogTitle>
      {BecomeSellerAlert.open && (
        <Alert severity={BecomeSellerAlert.severity}>
          {BecomeSellerAlert.message}
        </Alert>
      )}
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Please fill in the details to become a seller.
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <CustomTextField name="storeName" label="Store Name" />
              <CustomTextField
                name="storeDescription"
                label="Store Description"
                multiline
                rows={4}
              />
              <CustomTextField name="contact" label="Contact Number" />
              <CustomTextField name="address" label="Address" />
              <CustomTextField name="zipCode" label="Zip Code" />
              <DialogActions>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeASellerModal;
