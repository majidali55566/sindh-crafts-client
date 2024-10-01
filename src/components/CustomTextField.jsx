/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import { ErrorMessage, Field } from "formik";
export const CustomTextField = ({ name, label, ...props }) => (
  <div className="d-flex flex-column">
    <Field
      as={TextField}
      margin="dense"
      name={name}
      label={label}
      fullWidth
      {...props}
    />
    <ErrorMessage name={name} component="div" className="error" />
  </div>
);
