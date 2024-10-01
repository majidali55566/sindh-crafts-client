import { Button } from "@mui/material";
import CreateProductDialog from "../../components/ProductCreationModal";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../api/axiosPrivate";
import ProductsTable from "../../components/Tables/SellerProductsTable";
import { Add } from "@mui/icons-material";

const SellerProductPage = () => {
  const [isProductCreationModalOpen, setIsProductCreationModalOpen] =
    useState(false);
  const [isEditModalProductOpen, setIsEditModalProductOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [productSelectedForView, setProductSelectedForView] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await axiosPrivate.get("/api/sellers/products");
        console.log(response.data.products);
        if (response.status === 200) setAllProducts(response?.data?.products);
      } catch (error) {
        console.log(error);
      }
    };
    getAllProducts();
  }, []);

  const handleViewProduct = (product) => {
    setProductSelectedForView(product);
    setIsEditModalProductOpen(true);
    setIsProductCreationModalOpen(true); // Reuse the same modal with different state
  };

  const handleAddTotalProducts = (newProduct) => {
    setAllProducts((products) => [...products, newProduct]);
  };

  const handleUpdateProduct = (newProduct) => {
    setAllProducts((products) =>
      products.map((product) =>
        product._id === newProduct._id ? newProduct : product
      )
    );
  };

  return (
    <div className="seller-product-page">
      <div className="d-flex flex-column gap-400">
        <Button
          onClick={() => setIsProductCreationModalOpen(true)}
          fullWidth
          variant="contained"
        >
          <Add /> New Product
        </Button>
        <ProductsTable handleView={handleViewProduct} data={allProducts} />
      </div>

      {/* Reuse the same dialog for both create and edit */}
      <CreateProductDialog
        handleAddTotalProducts={handleAddTotalProducts}
        hanldeUpdateProduct={handleUpdateProduct}
        open={isProductCreationModalOpen}
        isEditMode={isEditModalProductOpen} // Controls whether in edit or create mode
        productData={productSelectedForView} // Pass the selected product for editing
        onClose={() => {
          setIsProductCreationModalOpen(false);
          setIsEditModalProductOpen(false);
        }}
      />
    </div>
  );
};

export default SellerProductPage;
