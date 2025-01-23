/* eslint-disable react/prop-types */
import { Box, Button, Typography, Chip } from "@mui/material";
import { useMemo } from "react";
import { format } from "date-fns";

import { MaterialReactTable } from "material-react-table";

function OrdersTable({ data, handleViewOrder }) {
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
  const columns = useMemo(
    () => [
      {
        accessorKey: "products", // Products in the order
        header: "Product Name & Qty",
        size: 200,
        Cell: ({ cell }) => {
          return (
            <Box>
              {cell?.row?.original?.products?.map((product, index) => (
                <Typography key={index} variant="body2">
                  <Typography fontSize=".7rem">
                    {product.productName}
                  </Typography>
                  <Typography fontSize=".8rem" fontWeight={700}>
                    X{product.quantity}
                  </Typography>
                </Typography>
              ))}
            </Box>
          );
        },
      },
      {
        accessorKey: "shippingDetails.address",
        header: "shipping address",
      },
      {
        accessorKey: "totalPrice", // Total price
        header: "Total Price",
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2">
            Rs. {cell.getValue().toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: "products",
        header: "Color",
        size: "100",
        Cell: ({ cell }) =>
          cell?.row?.original?.products?.map((product) => (
            <Chip
              size="small"
              key={product._id}
              label={product.selectedColor}
            />
          )),
      },
      {
        accessorKey: "products",
        header: "Size",
        size: "100",
        Cell: ({ cell }) =>
          cell?.row?.original?.products?.map((product) => (
            <Chip size="small" key={product._id} label={product.selectedSize} />
          )),
      },
      {
        accessorKey: "orderStatus", // Order status
        header: "Order Status",
        size: 100,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            sx={{ fontSize: ".8rem" }}
            label={cell.getValue()}
            color={getStatusColor(cell.getValue())}
          />
        ),
      },

      {
        accessorKey: "createdAt",
        header: "order date",
        Cell: ({ cell }) => (
          <Typography fontSize=".8rem" fontWeight={600}>
            {format(new Date(cell.getValue()), "dd MMM yyyy hh:mm a")}
          </Typography>
        ),
      },
      {
        id: "actions", // Action buttons
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="text"
              style={{
                padding: "0.5rem",
                fontSize: ".8rem",
                fontWeight: "700",
              }}
              color="primary"
              onClick={() => handleViewOrder(row.original)}
            >
              View
            </Button>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableSorting
      enableColumnFilterModes
      enableGlobalFilter
      enablePagination
      muiTablePaperProps={{
        elevation: 2,
        sx: { borderRadius: "10px", border: "none" },
      }}
    />
  );
}

export default OrdersTable;
