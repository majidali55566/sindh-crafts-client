import { useContext, useEffect, useState } from "react";
import { Paper, Button, Typography, Divider, Box, Modal } from "@mui/material";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../api/axiosPrivate";
import { CustomTextField } from "../components/CustomTextField";
import { Formik, Form } from "formik";
import * as Yup from "yup"; // For validation
import { LocalAtm } from "@mui/icons-material";

const CheckoutPage = () => {
  const { cartItems, setcartItems } = useContext(CartContext);
  const axiosPrivate = useAxiosPrivate();
  const [isModalOpen, setisModalOpen] = useState(false);
  const navigate = useNavigate();
  const [orderStatus, setorderStatus] = useState("");

  const [subTotal, setsubTotal] = useState(0);

  // Calculate the subtotal whenever cartItems are updated
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.discountedPrice * item.quantity,
      0
    );
    setsubTotal(total);
    console.log(cartItems);
  }, [cartItems]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    address: Yup.string().required("Address is required"),
    postalCode: Yup.string()
      .required("Postal code is required")
      .matches(/^\d{5}$/, "Postal code should be 5 digits"),
    contactNumber: Yup.string()
      .required("Contact number is required")
      .matches(/^\d{10}$/, "Contact number should be 10 digits"),
  });

  const handlePlaceOrder = async (values) => {
    console.log(values);
    try {
      const response = await axiosPrivate.post("/api/orders", {
        shippingDetails: values, // Pass Formik values as shipping details
      });
      console.log(response);

      if (response.status === 201) {
        setorderStatus("success");
        setisModalOpen(true);
        setcartItems([]);
      }
    } catch (error) {
      setorderStatus("error");
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="checkout-page">
      {/* Shipping Details Form */}
      <div className="summary">
        <Paper>
          <Typography>Summary</Typography>
          {cartItems?.map((item) => (
            <div
              style={{ padding: ".5rem" }}
              className="d-flex justify-between"
              key={item._id}
            >
              <div className="d-flex gap-200">
                <img
                  style={{ height: "4rem", width: "4rem", objectFit: "cover" }}
                  src={item.product.images[0].url}
                  alt=""
                />
                <div className="d-flex gap-200 flex-wrap">
                  <Typography>{item.product.name}</Typography>
                  <Typography fontWeight={700}> *{item.quantity}</Typography>
                </div>
              </div>
              <Typography fontWeight={700}>
                {item.product.discountedPrice * item.quantity}
              </Typography>
            </div>
          ))}
          <div>
            <Typography fontWeight={700} padding=".5rem">
              Sub Total : {subTotal}
            </Typography>
          </div>
        </Paper>
      </div>
      <Formik
        initialValues={{
          fullName: "",
          address: "",
          postalCode: "",
          contactNumber: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handlePlaceOrder}
      >
        {() => (
          <Form>
            <Paper sx={{ padding: "2rem", marginBottom: "2rem" }}>
              <Typography variant="h6" gutterBottom>
                Shipping Details
              </Typography>
              <div className="d-flex flex-wrap gap-400">
                <CustomTextField name="fullName" label="Full Name" />

                <CustomTextField name="address" label="Address" />

                <CustomTextField name="postalCode" label="Postal Code" />

                <CustomTextField name="contactNumber" label="Contact Number" />
              </div>
            </Paper>

            {/* Payment Section */}
            <Paper sx={{ padding: "2rem", marginBottom: "2rem" }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
                <div className="cash-on-delievery">
                  <LocalAtm color="primary" />
                  <Typography fontWeight={600} fontSize=".8rem">
                    cash on delievery
                  </Typography>
                </div>
              </Typography>

              {/* Placeholder for payment options (you can add your radio buttons here) */}
              <Divider sx={{ marginBottom: "1rem" }} />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Place Order
              </Button>
            </Paper>
          </Form>
        )}
      </Formik>
      <Modal
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}
        aria-labelledby="order-status-title"
        aria-describedby="order-status-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: 400,
          }}
        >
          <Typography
            id="order-status-title"
            variant="h6"
            component="h2"
            align="center"
            sx={{ mb: 2 }}
          >
            {orderStatus === "success"
              ? "🎉 Order Placed Successfully!"
              : "❌ Order Failed"}
          </Typography>
          <Typography
            id="order-status-description"
            align="center"
            sx={{ mb: 3 }}
          >
            {orderStatus === "success"
              ? "Thank you for your purchase. Your order has been placed successfully!"
              : "We couldn't process your order. Please try again later."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setisModalOpen(false);
              if (orderStatus === "success") {
                navigate("/");
              }
            }}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
