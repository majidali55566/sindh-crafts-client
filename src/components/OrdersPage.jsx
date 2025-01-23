import { useEffect, useState } from "react";
import useAxiosPrivate from "../api/axiosPrivate";
import { format } from "date-fns";
import { ArrowRightAlt, FlightTakeoff, LocationOn } from "@mui/icons-material";
import { Chip } from "@mui/material";

const OrdersPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const [orders, setorders] = useState([]);
  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const response = await axiosPrivate.get("/api/orders");
        console.log(response);
        if (response.status === 200) {
          setorders(response.data.orders);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllOrders();
  }, []);
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
  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      <div className="orders-container">
        {orders?.map((order) => (
          <div key={order._id} className="order-card">
            <div className="">
              <div className="d-flex justify-between flex-wrap">
                <div>
                  <p>Order Id</p>
                  <p className=" fw-md">{order._id}</p>
                </div>
                <Chip
                  label={order.orderStatus}
                  variant="outlined"
                  color={getStatusColor(order.orderStatus)}
                />
              </div>
              <div className="d-flex justify-between gap-400 flex-wrap">
                <Chip
                  label={`Order placed:${format(new Date(order.createdAt), "dd MMM yyyy hh:mm a")} `}
                />
                <Chip
                  label={`Estimated arrival:${format(new Date(order.estimatedArrivalDate), "dd MM yyyy")} `}
                />
              </div>
            </div>
            <div className="d-flex justify-between flex-wrap gap-200">
              <Chip
                label={order.sellerId.address}
                variant="outlined"
                sx={{
                  maxWidth: {
                    xs: 150, // Max width for extra-small screens
                    sm: 270, // Max width for small screens
                    // lg: 550, // Max width for large screens
                  },
                  // whiteSpace: "nowrap", // Prevent wrapping
                  // overflow: "hidden", // Hide overflow
                  // textOverflow: "ellipsis", // Add ellipsis
                }}
                icon={<FlightTakeoff />}
              />
              <ArrowRightAlt />

              <Chip
                label="Khairpur,Sindh"
                sx={{
                  maxWidth: 300, // Set a maximum width for the Chip
                  whiteSpace: "nowrap", // Prevent wrapping
                  overflow: "hidden", // Hide overflow
                  textOverflow: "ellipsis", // Add ellipsis
                }}
                variant="outlined"
                icon={<LocationOn />}
              />
            </div>
            <div className="product-details">
              <img src={order.products[0].productId.images[0].url} alt="" />
              <div className="d-flex flex-column">
                <p className="fw-md">
                  Elegant Balochi * {order.products[0].quantity}
                </p>
                <p>Total Rs.{order.totalPrice}</p>
                {order.products[0].selectedColor && (
                  <p className="fs-400">
                    color:
                    <Chip
                      label={order?.products[0]?.selectedColor}
                      size="small"
                    />
                  </p>
                )}
                {order.products[0].selectedSize && (
                  <p className="fs-400">
                    size:
                    <Chip
                      label={order?.products[0]?.selectedSize}
                      size="small"
                    />
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
