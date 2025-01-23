import { Box, Typography, Snackbar, Alert } from "@mui/material";
import OrdersTable from "../../components/Tables/OrdersTable";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../api/axiosPrivate";
import OrderDetailsModal from "./OrderDetailsModal";

function OrdersPage() {
  const axiosPrivate = useAxiosPrivate();

  const [sellerOrders, setsellerOrders] = useState([]);
  const [SelectedOrder, setSelectedOrder] = useState({});
  const [isDetailsModalOpen, setisDetailsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  useEffect(() => {
    async function getSellerOrders() {
      try {
        const response = await axiosPrivate.get("/api/orders/seller");
        console.log(response.data);
        setsellerOrders(response.data.orders);
      } catch (error) {
        console.log(error);
      }
    }
    getSellerOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosPrivate.patch("/api/orders/update-status", {
        newStatus,
        orderId,
      });
      setsellerOrders((prev) => {
        return prev.map((ord) =>
          ord._id === response.data.order._id ? response.data.order : ord
        );
      });

      // Show success message and close modal
      setSnackbarMessage("Order status updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setisDetailsModalOpen(false);

      console.log(response.data);
    } catch (error) {
      console.log(error);
      // Show error message
      setSnackbarMessage("Failed to update order status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateEstimatedDateArrival = async (selectedDate, orderId) => {
    if (!selectedDate) {
      console.error("No date selected");
      setSnackbarMessage("Please select a valid date.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Convert selectedDate to ISO format
      const formattedDate = selectedDate.toISOString();
      console.log(`Formatted Date: ${formattedDate}, Order ID: ${orderId}`);

      const response = await axiosPrivate.patch(
        "/api/orders/add-estimated-date",
        {
          orderId,
          estimatedDate: formattedDate,
        }
      );
      console.log("Response:", response.data);
      setsellerOrders((prev) => {
        return prev.map((ord) =>
          ord._id === response.data.order._id
            ? {
                ...ord,
                estimatedArrivalDate: response.data.order.estimatedArrivalDate,
              }
            : ord
        );
      });

      // Show success message and close modal
      setSnackbarMessage("Estimated arrival date updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setisDetailsModalOpen(false);
    } catch (error) {
      console.error("Error updating estimated arrival date:", error);
      // Show error message
      setSnackbarMessage("Failed to update estimated arrival date.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setisDetailsModalOpen(true);
    console.log(order);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h5">Your Orders</Typography>
      <OrdersTable data={sellerOrders} handleViewOrder={handleViewOrder} />
      <OrderDetailsModal
        orderData={SelectedOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        open={isDetailsModalOpen}
        handleUpdateEstimatedDateArrival={handleUpdateEstimatedDateArrival}
        handleClose={() => setisDetailsModalOpen(false)}
      />

      {/* Snackbar for success or error messages */}
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
    </Box>
  );
}

export default OrdersPage;
