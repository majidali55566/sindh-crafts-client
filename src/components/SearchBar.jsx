import { useState, useEffect, useRef } from "react";
import { Box, TextField, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Search from "@mui/icons-material/Search";
import useWindowWidth from "../hooks/useWindowWidth";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const windowWidth = useWindowWidth();

  const navigate = useNavigate();
  const [isSearchBarExpanded, setisSearchBarExpanded] = useState(false);

  useEffect(() => {
    if (windowWidth <= 640) setisSearchBarExpanded(false);
    else setisSearchBarExpanded(true);
  }, [windowWidth]);

  // Function to fetch products based on search query and pagination
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get("/api/products/search", {
        params: {
          search: value,
          page: currentPage,
          limit: 10, // You can adjust the limit as needed
        },
      });
      console.log(response.data);
      setSearchResults(response.data.products || []);
      setTotalPages(response.data.totalPages);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box className="d-flex items-center">
        {windowWidth < 640 && (
          <Search
            sx={{ color: "white" }}
            onClick={() => setisSearchBarExpanded(!isSearchBarExpanded)}
          />
        )}
        {isSearchBarExpanded && (
          <TextField
            fullWidth
            placeholder="Search for products..."
            value={query}
            onChange={handleSearch}
            variant="outlined"
            sx={{
              background: "white",
              // position: "absolute",
              // right: "0",
              // bottom: "0",
              // zIndex: "9999",

              borderRadius: ".5rem",
            }}
            size="small"
          />
        )}
      </Box>
      {showResults && (
        <Box
          ref={dropdownRef}
          sx={{
            position: "absolute",
            top: "2.rem",
            padding: ".5rem",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 999,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {isSearching ? (
            <Box sx={{ textAlign: "center", padding: "1rem" }}>
              <CircularProgress size={24} />
            </Box>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <Box
                key={product._id}
                sx={{
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
                onClick={() => {
                  navigate(`/product/${product._id}`);
                  setShowResults(false); // Close dropdown on selection
                }}
              >
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    marginRight: "1rem",
                  }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rs. {product.discountedPrice || product.price}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: "center", padding: "1rem" }}>
              <Typography variant="body2" color="text.secondary">
                No results found.
              </Typography>
            </Box>
          )}
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box sx={{ padding: "0.5rem", textAlign: "center" }}>
              <button
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                {" "}
                Page {currentPage} of {totalPages}{" "}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(prevPage + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
