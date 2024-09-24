/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // For decoding JWT token
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { ArrowBack, Email } from "@mui/icons-material";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import FacebookLoginButton from "./FacebookLoginButton";

// Validation schema for both Sign Up and Sign In
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const JoinUsModal = ({ open, onClose, formType, toggleFormType }) => {
  const [isContinueWithEmailSectionOpen, setIsContinueWithEmailSectionOpen] =
    useState(false);

  // Handle Google Login Success
  const handleGoogleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;
    const userInfo = jwtDecode(credential);
    console.log("User Info: ", userInfo);
    onClose(); // Close the modal on success
  };

  const handleGoogleLoginError = () => {
    console.log("Login Failed");
    onClose(); // Close the modal even if login fails
  };

  // Toggle between Sign Up and Sign In

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogContent sx={{ padding: 0 }}>
        <Box display="flex">
          <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
            <img
              width="400px"
              height="400px"
              style={{ objectFit: "cover" }}
              src="/images/artisian1.png"
              alt="background"
            />
          </Box>
          {!isContinueWithEmailSectionOpen && (
            <Box>
              <Box padding="1rem" sx={{ display: { xs: "block", sm: "none" } }}>
                <h2>
                  Success{" "}
                  <span style={{ color: "hsl(20, 80%, 32%)" }}>starts</span>{" "}
                  here
                </h2>
              </Box>
              <Box
                sx={{ padding: "1rem" }}
                display="flex"
                flexDirection="column"
                gap="1rem"
              >
                <h4>
                  {formType === "signup"
                    ? "Create a new account"
                    : "Sign in to your account"}
                </h4>
                <Typography>
                  {formType === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <span
                        onClick={toggleFormType}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        Sign In
                      </span>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <span
                        onClick={toggleFormType}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        Sign Up
                      </span>
                    </>
                  )}
                </Typography>
                <GoogleLogin
                  text={formType === "signin" ? "signin_with" : "continue_with"}
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                />
                <FacebookLoginButton />
                <Box
                  display="flex"
                  border="1px solid #e3dbdb"
                  borderRadius=".3rem"
                  sx={{ cursor: "pointer" }}
                  gap=".5rem"
                  padding=".4rem"
                  maxWidth="fit-content"
                  onClick={() => setIsContinueWithEmailSectionOpen(true)}
                >
                  <Email />
                  <Typography>
                    {formType === "signin"
                      ? "Sign in with email"
                      : "Continue with email"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          {isContinueWithEmailSectionOpen && (
            <Box
              padding="1rem"
              display="flex"
              flexDirection="column"
              gap="1rem"
            >
              <div className="d-flex items-center flex-wrap">
                <IconButton
                  onClick={() => setIsContinueWithEmailSectionOpen(false)}
                >
                  <ArrowBack />
                </IconButton>
                <h4>
                  {formType === "signin"
                    ? "Sign in with email"
                    : "Continue with email"}
                </h4>
              </div>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  console.log(
                    formType === "signup" ? "Sign Up values" : "Sign In values",
                    values
                  );
                  // Add your submission logic for Sign Up or Sign In here
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="d-flex flex-column gap-400">
                    <div>
                      <Field
                        as={TextField}
                        name="email"
                        label="Email"
                        fullWidth
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        style={{ color: "red", fontSize: ".8rem" }}
                      />
                    </div>
                    <div>
                      <Field
                        as={TextField}
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        style={{ color: "red", fontSize: ".8rem" }}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? formType === "signup"
                          ? "Signing Up..."
                          : "Signing In..."
                        : formType === "signup"
                        ? "Sign Up"
                        : "Sign In"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default JoinUsModal;
