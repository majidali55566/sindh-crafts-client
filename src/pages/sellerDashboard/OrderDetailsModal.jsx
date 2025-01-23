/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const OrderDetailsModal = ({
  open,
  handleClose,
  orderData,
  onUpdateOrderStatus,
  handleUpdateEstimatedDateArrival,
}) => {
  const {
    buyerId,
    products,
    shippingDetails,
    paymentMethod,
    paymentStatus,
    orderStatus,
    totalPrice,
    createdAt,
  } = orderData || {};

  const [status, setStatus] = useState(null); // Default value
  console.log(orderData.estimatedArrivalDate);

  const [selectedDate, setSelectedDate] = useState(null); // Initial value as a Day.js object
  useEffect(() => {
    setSelectedDate(
      orderData.estimatedArrivalDate
        ? dayjs(orderData.estimatedArrivalDate)
        : null
    );
    setStatus(orderData.orderStatus);
  }, [orderData]);
  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "warning";
      case "Shipped":
        return "info";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "default"; // Default color if no match
    }
  };
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    console.log(status);
  };

  const handleSave = () => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderData._id, status); // Assume `_id` is the unique identifier
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="order-details-dialog"
    >
      <DialogTitle id="order-details-dialog">
        <div className="d-flex justify-between">
          <Typography>Order Details</Typography>
          <Chip
            label={orderData.orderStatus}
            variant="outlined"
            color={getStatusColor(orderData.orderStatus)}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Buyer Information:
          </Typography>
          <div className="d-flex justify-around">
            <div>
              <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                Name
              </Typography>
              <Typography fontSize=".8rem">{buyerId?.name}</Typography>
            </div>
            <div>
              <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                Email
              </Typography>
              <Typography fontSize=".8rem">{buyerId?.email}</Typography>
            </div>
          </div>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Shipping Details:
          </Typography>
          <div className="d-flex justify-around">
            <div className="d-flex flex-column gap-200">
              <div>
                <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                  Full Name
                </Typography>
                <Typography fontSize=".8rem">
                  {shippingDetails?.fullName}
                </Typography>
              </div>
              <div>
                <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                  Contact
                </Typography>
                <Typography fontSize=".8rem">
                  {shippingDetails?.contactNumber}
                </Typography>
              </div>
            </div>

            <div className="d-flex flex-column gap-200">
              <div>
                <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                  Address
                </Typography>
                <Typography fontSize=".8rem">
                  {shippingDetails?.address}
                </Typography>
              </div>
              <div>
                <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                  Postal Code
                </Typography>
                <Typography fontSize=".8rem">
                  {shippingDetails?.postalCode}
                </Typography>
              </div>
            </div>
          </div>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Product:
          </Typography>
          {products?.map((product, index) => (
            <Box
              key={index}
              mb={2}
              p={2}
              sx={{ border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <div className="d-flex justify-around gap-200">
                {/* Image Section */}
                <div>
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    style={{ width: "100px", borderRadius: "5px" }}
                  />
                </div>

                {/* Product Details Section */}
                <div className="d-flex flex-column gap-200">
                  <div>
                    <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                      Name
                    </Typography>
                    <Typography fontSize=".8rem">
                      {product.productName}
                    </Typography>
                  </div>
                  <div>
                    <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                      Color
                    </Typography>
                    <Typography fontSize=".8rem">
                      {product.selectedColor}
                    </Typography>
                  </div>
                </div>

                <div className="d-flex flex-column gap-200">
                  <div>
                    <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                      Price
                    </Typography>
                    <Typography fontSize=".8rem">
                      {product.discountedPrice}
                    </Typography>
                  </div>
                  <div>
                    <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                      Quantity
                    </Typography>
                    <Typography fontSize=".8rem">{product.quantity}</Typography>
                  </div>
                </div>

                <div className="d-flex flex-column gap-200">
                  <div>
                    <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                      Stock Remaining
                    </Typography>
                    <Typography fontSize=".8rem">
                      {product.stockRemaining}
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>
          ))}
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Payment Information:
          </Typography>
          <div className="d-flex justify-around">
            <div>
              <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                Method
              </Typography>
              <Typography fontSize=".8rem">{paymentMethod}</Typography>
            </div>
            <div>
              <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                Status
              </Typography>
              <Typography fontSize=".8rem">{paymentStatus}</Typography>
            </div>
          </div>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Order Information:
          </Typography>
          <div className="d-flex justify-around">
            <div>
              <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                Status
              </Typography>

              <Typography fontSize=".8rem">{orderStatus}</Typography>
            </div>
            <div>
              <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                Total Price
              </Typography>
              <Typography fontSize=".8rem">{totalPrice}</Typography>
            </div>
            <div>
              <Typography color="rgba(0,0,0,0.6)" fontSize=".8rem">
                Order Date
              </Typography>
              <Typography fontSize=".8rem">{formatDate(createdAt)}</Typography>
            </div>
          </div>
        </Box>
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Estimated Arrival Date:
          </Typography>
          <div className="d-flex justify-between items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Estimated Arrival Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              disabled={selectedDate?.isSame(
                dayjs(orderData.estimatedArrivalDate)
              )}
              size="small"
              onClick={() =>
                handleUpdateEstimatedDateArrival(selectedDate, orderData._id)
              }
            >
              Update
            </Button>
          </div>
        </Box>
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Update Order Status:
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="order-status-label">Status</InputLabel>
            <div className="d-flex justify-between items-center">
              <FormControl size="small">
                <InputLabel id="order-status-label">Order Status</InputLabel>
                <Select
                  labelId="order-status-label"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSave}
                disabled={status === orderStatus} // Disable if no change
              >
                Save Status
              </Button>
            </div>
          </FormControl>
          <Box mt={2}></Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
