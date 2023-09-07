import "@fontsource/roboto";
import Visibility from "@mui/icons-material/Visibility";
import {
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alerts } from "../../../components/alert";
import Prescription from "../../../components/prescription";
import { fontBold, prescriptionModalstyle } from "../../../config/commonStyles";
export default function MyPrescriptions() {

  const [patientId, setPatientId] = useState("");
  const [prescriptionMetadata, setPrescriptionMetadata] = useState(null);

  
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(null);

  const userObj = useSelector((state) => state.UserReducer.oUser);

  //Alert
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const alertObj = {
    alertMessage: alertMessage,
    alertType: alertType,
  };
  const [snackbar, setSnackbar] = React.useState(false);
  const snackbarOpen = () => {
    setSnackbar(true);
  };
  const snackbarClose = () => {
    setSnackbar(false);
  };

  const [backdrop, setBackdrop] = React.useState(false);

  const getPrescriptions = (patientId) => {
    axios
      .get(`patient/${patientId}/prescriptions`)
      .then((resp) => {
        if (resp.status === 200) {
          setPrescriptionMetadata(resp.data);
          console.log(resp.data);
          setBackdrop(false);
        }
      })
      .catch((error) => {
        console.log(error.config);
        console.log(error.message);
        console.log(error.response);
        setBackdrop(false);
        setAlertMessage("Something went wrong, Please try again!");
        setAlertType("error");
        snackbarOpen();
      });
  };
  let runOnce = true;
  useEffect(() => {
    if (runOnce && userObj != null) {
      setPatientId(userObj.id);
      setBackdrop(true);
      getPrescriptions(userObj.id);
      runOnce = false;
    }
  }, []);

  return (
    <>
      {prescriptionMetadata && (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="left">
              <Typography
                variant="h5"
                style={{ display: "inline", marginRight: "10px" }}
              >
                Medical History
              </Typography>
            </Grid>
            {prescriptionMetadata && (
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ paddingLeft: "10px" }}
                          style={fontBold}
                        >
                          Details
                        </TableCell>
                        <TableCell
                          width="15%"
                          sx={{ paddingLeft: "10px" }}
                          style={fontBold}
                        >
                          Doctor Name
                        </TableCell>
                        <TableCell
                          width="15%"
                          sx={{ paddingLeft: "10px" }}
                          style={fontBold}
                        >
                          Created Date
                        </TableCell>
                        <TableCell
                          width="15%"
                          sx={{ paddingLeft: "10px" }}
                          style={fontBold}
                        >
                          Updated Date
                        </TableCell>
                        <TableCell
                          width="5%"
                          sx={{ paddingLeft: "10px" }}
                          style={fontBold}
                        >
                          View
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {prescriptionMetadata.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ padding: "0", paddingLeft: "10px" }}>
                            <pre style={{ fontFamily: "Roboto" }}>
                              {row.details}
                            </pre>
                          </TableCell>
                          <TableCell sx={{ padding: "0", paddingLeft: "10px" }}>
                            {row.doctorName}
                          </TableCell>
                          <TableCell sx={{ padding: "0", paddingLeft: "10px" }}>
                            {moment(row.createdAt).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell sx={{ padding: "0", paddingLeft: "10px" }}>
                            {moment(row.updatedAt).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell sx={{ padding: "0", paddingLeft: "10px" }}>
                            <IconButton
                              onClick={() => {
                                setCurrentPrescriptionId(row.prescriptionId);
                                setShowPrescriptionModal(true);
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
          {showPrescriptionModal && (
            <Modal
              open={showPrescriptionModal}
              onClose={() => {
                setShowPrescriptionModal(false);
                setBackdrop(true);
                getPrescriptions(patientId);
              }}
            >
              <Box sx={prescriptionModalstyle}>
                <Prescription
                  patientId={userObj.userId}
                  patientName={userObj.name}
                  prescriptionId={currentPrescriptionId}
                />
              </Box>
            </Modal>
          )}
        </Box>
      )}
      {snackbar && (
        <Alerts
          alertObj={alertObj}
          snackbar={snackbar}
          snackbarClose={snackbarClose}
        />
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
