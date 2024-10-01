/* eslint-disable react/prop-types */
import { Modal, Box, Typography, Button } from "@mui/material";

const SellerRestrictionModal = ({ isOpen, handleClose }) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Restricted Action
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Since you are logged in as a seller, you cannot purchase products.
        </Typography>
        <Button variant="contained" onClick={handleClose}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default SellerRestrictionModal;
