/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";
import JoinUsModal from "./JoinUs";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // If the user is not authenticated, open the modal
    if (!auth || !auth.accessToken) {
      setIsModalOpen(true);
    }
  }, [auth]);

  // Show loading indicator if the authentication state is still loading
  if (loading) return <CircularProgress />;

  // If the user is authenticated but doesn't have the allowed role, redirect to an unauthorized page
  if (auth && auth.accessToken && !allowedRoles.includes(auth.user.role)) {
    return navigate("/unauthorized/");
  }

  // If authenticated and the role is allowed, render the child components
  if (auth && auth.accessToken && allowedRoles.includes(auth.user.role)) {
    return <Outlet />;
  }

  // If the user is not authenticated, open the modal
  return (
    <>
      <JoinUsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        formType="signin"
      />
    </>
  );
};

export default RequireAuth;
