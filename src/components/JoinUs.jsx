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
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowBack, Email } from "@mui/icons-material";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const { setAuth } = useAuth();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle Google Login Success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    const userInfo = jwtDecode(credential);
    const userPayload = {
      googleId: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      profilePicture: userInfo.picture,
    };
    try {
      const response = await axios.post("/api/auth/signup/google", userPayload);
      if (response.status === 200) {
        const { token: accessToken, user } = response.data;
        setAuth({ accessToken, user });
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Show success snackbar
        setAlert({
          message: "Login Successful!",
          severity: "success",
        });
        setSnackbarOpen(true);

        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignUpWithEmail = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let response;
      if (formType === "signup") {
        response = await axios.post("/api/auth/signup/email", values);
        if (response.status === 200) {
          const { token: accessToken, user } = response.data;
          setAuth({ accessToken, user });
          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));

          setAlert({ message: "Sign Up successful", severity: "success" });
          setSnackbarOpen(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } else {
        response = await axios.post("/api/auth/signin/email", values);
        if (response.status === 200) {
          const { token: accessToken, user } = response.data;
          setAuth({ accessToken, user });
          setAlert({ message: "Sign In successful", severity: "success" });
          setSnackbarOpen(true);
          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));

          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message:
          error.response?.status === 400
            ? formType === "signup"
              ? "User already exists with this email"
              : "Invalid credentials"
            : "Internal Server Error",
      });
      setSnackbarOpen(true);
      console.log(error);
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* Main modal content */}
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <DialogContent sx={{ padding: 0 }}>
          <Box display="flex">
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              <img
                style={{ objectFit: "cover", flexShrink: 0, maxWidth: "300px" }}
                src="/images/artisian1.png"
                alt="background"
              />
            </Box>
            {!isContinueWithEmailSectionOpen && (
              <Box>
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
                    text={
                      formType === "signin" ? "signin_with" : "continue_with"
                    }
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => console.log("Login Failed")}
                    redirect_uri="https://sindh-crafts.netlify.app"
                  />
                  <LoginWithFaceBook
                    setAlert={setAlert}
                    setSnackbarOpen={setSnackbarOpen}
                    onClose={onClose}
                  />
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
                  onSubmit={handleSignUpWithEmail}
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

      {/* Snackbar for success/error notifications */}
      <Snackbar
        open={snackbarOpen}
        color="main.primary"
        autoHideDuration={8000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JoinUsModal;

const LoginWithFaceBook = ({ setAlert, setSnackbarOpen, onClose }) => {
  const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
  const { setAuth } = useAuth();

  return (
    <LoginSocialFacebook
      key={APP_ID}
      appId={APP_ID}
      onResolve={async (response) => {
        const { email, id: facebookId, name, picture } = response.data;
        const userData = {
          name,
          email,
          facebookId,
          profilePicture: picture?.data?.url,
        };
        try {
          const response = await axios.post(
            "/api/auth/signup/facebook",
            userData
          );
          if (response.status === 200) {
            const { token: accessToken, user } = response.data;
            setAuth({ accessToken, user });
            localStorage.setItem("authToken", accessToken);
            localStorage.setItem("user", JSON.stringify(user));
            console.log("User login/signup successful");
            setAlert({
              message: "User login/signup successful",
              severity: "success",
            });
            setSnackbarOpen(true);
            onClose();
          }
        } catch (err) {
          console.log(err);
        }
      }}
      onReject={(error) => {
        console.log(error);
      }}
    >
      <FacebookLoginButton style={{ fontSize: ".8rem" }} />
    </LoginSocialFacebook>
  );
};
