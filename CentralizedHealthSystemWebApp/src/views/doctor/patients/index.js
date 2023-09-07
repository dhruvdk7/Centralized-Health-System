import { useEffect, useRef } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alerts } from "../../../components/alert";
import HealthCard from "../../health_card";
import QrReader from "react-qr-scanner";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CloseIcon from "@mui/icons-material/Close";
export default function Patients() {
  let navigate = useNavigate();

  const [usersData, setUsersData] = useState(null);
  const [searchId, setSearchId] = useState("");
  const ref = useRef(null);
  const [myPatient, setMyPatient] = useState(true);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientModal, setNewPatientModal] = useState(false);
  const [showHealthCard, setShowHealthCard] = useState(false);
  const [healthCardDetails, setHealthCardDetails] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const healthCardClose = () => {
    setHealthCardDetails(null);
    setShowHealthCard(false);
  };
  const openHealthCard = (row) => {
    console.log(row);
    let patientObj = {
      name: row.name,
      email: row.email,
      patientId: row.userId,
      bloodGroup: row.bloodGroup,
      number: row.number,
    };
    setHealthCardDetails(patientObj);
    setShowHealthCard(true);
  };

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
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff",
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
  };

  const getData = (check) => {
    setBackdrop(true);

    if (
      (searchId !== "" &&
        searchId !== null &&
        RegExp(/^\d+$/).test(searchId)) ||
      !check
    ) {
      let searchObj = {};
      searchObj.myPatient = !check;
      if (searchId !== "" && check) searchObj.searchId = searchId;

      //   if()
      axios
        .post("doctor/filter", searchObj)
        .then((resp) => {
          if (resp.status === 200) {
            console.log(resp.data);
            setUsersData(resp.data);
            setBackdrop(false);
            setMyPatient(false);
          }
        })
        .catch((error) => {
          console.log(error.config);
          console.log(error.message);
          console.log(error.response);
          setBackdrop(false);
          setAlertMessage("Something went wrong, Please try again");
          setAlertType("error");
          snackbarOpen();
        });
    } else {
      setBackdrop(false);
      setAlertMessage("Enter a valid patient Id");
      setAlertType("error");
      snackbarOpen();
    }
  };
  const addNewPatient = () => {
    setBackdrop(true);
    if (
      newPatientEmail === "" ||
      newPatientEmail === null ||
      newPatientName === "" ||
      newPatientName === null ||
      !newPatientEmail.includes("@") ||
      newPatientName.includes("@") ||
      !newPatientEmail.includes(".") ||
      newPatientName.includes(".")
    ) {
      setBackdrop(false);
      setAlertMessage("Enter valid patient's details");
      setAlertType("error");
      snackbarOpen();
    } else {
      axios
        .post("doctor/create-user", {
          name: newPatientName,
          email: newPatientEmail,
        })
        .then((resp) => {
          if (resp.status === 204) {
            setBackdrop(false);
            setNewPatientModal(false);
            setNewPatientEmail("");
            setNewPatientName("");
            setAlertMessage("New patient added");
            setAlertType("success");
            snackbarOpen();
          } else {
            setBackdrop(false);
            setAlertMessage(resp.response.data.message);
            setAlertType("error");
            snackbarOpen();
          }
        })
        .catch((error) => {
          console.log(error.config);
          console.log(error.message);
          console.log(error.response);
          setBackdrop(false);
          setAlertMessage("Something went wrong, Please try again");
          setAlertType("error");
          snackbarOpen();
        });
    }
  };
  const getDoctorsPatients = () => {
    setSearchId("");
    setMyPatient(true);
    setBackdrop(true);
    getData(false);
  };

  const handleScan = (e) => {
    if (e) {
      setIsRecording(false);
      setSearchId(e.text);

      //alert(e.text);
      closeCam();
    }
  };
  const closeCam = async () => {
    setIsRecording(false);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: false,
    });
  };

  useEffect(() => {
    getDoctorsPatients();
  }, []);

  return (
    <>
      <Box>
        <div>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <TextField
                id="searchId"
                label="Patient Id"
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                }}
                fullWidth
              />
              {/* 
              <div>
                <input
                  value={myPatient}
                  onClick={() => {
                    setMyPatient(!myPatient);
                  }}
                  checked={myPatient}
                  type="checkbox"
                />
                Only show my patients
              </div> */}
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Search">
                <IconButton
                  style={{
                    marginTop: "8px",
                    marginLeft: "0px",
                    paddingLeft: "0px",
                  }}
                  color="success"
                  onClick={() => {
                    getData(true);
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Scan">
                <IconButton
                  style={{
                    marginTop: "8px",
                    marginLeft: "0px",
                    paddingLeft: "0px",
                  }}
                  color="warning"
                  onClick={() => {
                    setIsRecording(true);
                  }}
                >
                  <QrCodeScannerIcon />
                </IconButton>
              </Tooltip>
              {isRecording && (
                <>
                  <Tooltip title="Close Scanner">
                    <IconButton
                      style={{
                        marginTop: "8px",
                        marginLeft: "0px",
                        paddingLeft: "0px",
                      }}
                      onClick={() => {
                        closeCam(true);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Grid>

            <Grid item xs={3}></Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  getDoctorsPatients();
                }}
              >
                Show my patients
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="outlined"
                color="success"
                endIcon={<PersonAddIcon />}
                style={{ marginTop: "10px" }}
                onClick={() => {
                  setNewPatientModal(true);
                }}
              >
                Add New Patient
              </Button>
            </Grid>
          </Grid>
        </div>
        {isRecording && (
          <>
            <QrReader
              delay={100}
              style={{
                height: "240px",
                width: "920px",
                display: "flex",
                //  position: "relative",
                top: "13%",
                left: "49%",
              }}
              //onError={this.handleError}
              onScan={handleScan}
              ref={ref}
            />
          </>
        )}
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#e6e6e6" }}>
              <TableRow>
                <TableCell align="left">Id</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Number</TableCell>
                <TableCell align="left">Blood Group</TableCell>
                <TableCell align="left">Health Card</TableCell>
              </TableRow>
            </TableHead>
            {usersData && (
              <TableBody>
                {usersData.map((row) => (
                  <TableRow
                    key={row.userId}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "#e6e6e6 !important",
                      },
                    }}
                  >
                    <TableCell align="left">{row.userId}</TableCell>
                    <TableCell
                      align="left"
                      onClick={() => {
                        navigate(`/patient/${row.userId}`);
                      }}
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.number}</TableCell>
                    <TableCell align="left">{row.bloodGroup}</TableCell>
                    <TableCell
                      align="left"
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        openHealthCard(row);
                      }}
                    >
                      View
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {newPatientModal && (
          <Modal
            open={newPatientModal}
            onClose={() => {
              setNewPatientModal(false);
            }}
          >
            <Box sx={style}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Add new patient</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    name="name"
                    value={newPatientName}
                    label="Patient Name"
                    onChange={(e) => {
                      setNewPatientName(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="email"
                    name="email"
                    label="Patient Email"
                    value={newPatientEmail}
                    onChange={(e) => {
                      setNewPatientEmail(e.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    onClick={() => {
                      addNewPatient();
                    }}
                    variant="outlined"
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        )}

        {showHealthCard && healthCardDetails && (
          <HealthCard
            healthCardClose={healthCardClose}
            showHealthCard={showHealthCard}
            healthCardDetails={healthCardDetails}
          />
        )}
      </Box>
      {snackbar && (
        <Alerts
          alertObj={alertObj}
          snackbar={snackbar}
          snackbarClose={snackbarClose}
        />
      )}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
