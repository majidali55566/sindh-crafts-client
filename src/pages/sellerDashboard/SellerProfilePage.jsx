/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import StoreIcon from "@mui/icons-material/Store";
import DescriptionIcon from "@mui/icons-material/Description";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../api/axiosPrivate";

function SellerProfilePage() {
  const [sellerInfo, setsellerInfo] = useState({});
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const getSellerInfo = async () => {
      try {
        const response = await axiosPrivate.get("/api/sellers/info");
        if (response.status === 200) setsellerInfo(response?.data?.seller);
        console.log(response.data.seller);
      } catch (error) {
        console.log(error);
      }
    };
    getSellerInfo();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      {/* Profile Picture and Seller Name */}
      <Card sx={{ maxWidth: 600, width: "100%", mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Avatar
              alt={sellerInfo?.userId?.name}
              src={sellerInfo?.userId?.profilePicture}
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h5">{sellerInfo?.userId?.name}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Seller Info in Cards */}
      <Grid container spacing={2} sx={{ maxWidth: 600, width: "100%" }}>
        {/* Email */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <EmailIcon color="primary" />
                <Typography variant="body1">
                  {sellerInfo?.userId?.email}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PhoneIcon color="primary" />
                <Typography variant="body1">{sellerInfo?.contact}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <HomeIcon color="primary" />
                <Typography variant="body1">
                  {sellerInfo.address}, {sellerInfo.zipCode}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Store Name */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <StoreIcon color="primary" />
                <Typography variant="body1">{sellerInfo?.storeName}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Store Description */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <DescriptionIcon color="primary" />
                <Typography variant="body1">
                  {sellerInfo?.storeDescription}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SellerProfilePage;
