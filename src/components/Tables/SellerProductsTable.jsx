/* eslint-disable react/prop-types */
import { Box, Button, Badge, Typography, Chip } from "@mui/material";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";

function ProductsTable({ data, handleView }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "images", // Assuming the first image is in the 'images' array
        header: "Image",
        size: 100,
        Cell: ({ cell }) => {
          const productImage = cell?.row?.original?.images;
          if (productImage && productImage?.length > 0) {
            return (
              <img
                src={productImage[0]?.url}
                alt="Product"
                style={{
                  objectFit: "contain",
                  width: "70px",
                  height: "70px",
                  borderRadius: "8px",
                }}
              />
            );
          }
          return null;
        },
      },
      {
        accessorKey: "name",
        header: "Product Name",
        size: 200,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        size: 100,
        Cell: ({ cell }) => (
          <Badge color={cell.getValue() > 0 ? "success" : "error"}>
            {cell.getValue()}{" "}
            {cell.getValue() > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2">
            Rs. {cell.getValue().toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: "discountedPrice",
        header: "Discount (%)",
        size: 100,
        Cell: ({ row }) => {
          const originalPrice = row.original.price;
          const discountedPrice = row.original.discountedPrice;

          // Calculate the discount percentage
          const discountPercentage =
            originalPrice && discountedPrice
              ? ((originalPrice - discountedPrice) / originalPrice) * 100
              : 0;

          // Determine badge color based on discount percentage
          let badgeColor;
          if (discountPercentage > 20) {
            badgeColor = "error"; // High discount
          } else if (discountPercentage > 0) {
            badgeColor = "warning"; // Moderate discount
          } else {
            badgeColor = "default"; // No discount
          }

          return (
            <Chip
              color={badgeColor}
              label={
                discountPercentage > 0
                  ? `${discountPercentage.toFixed(0)}%`
                  : "No Discount"
              }
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
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
              onClick={() => handleView(row.original)}
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

export default ProductsTable;
