import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Alerts = (props) => {
  const alertMessage = props.alertObj.alertMessage;
  const alertType = props.alertObj.alertType;
  return (
    <>
      <Snackbar
        open={props.snackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={props.snackbarClose}
      >
        <Alert onClose={props.snackbarClose} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
