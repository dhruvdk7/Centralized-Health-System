import "@fontsource/roboto";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Alerts } from "../../../components/alert";
import HealthCard from "../../health_card";
export default function Profile() {
  const [patientId, setPatientId] = useState("");
  const [allowEdit, setAllowEdit] = useState(false);
  const [showHealthCard, setShowHealthCard] = useState(false);
  const [healthCardDetails, setHealthCardDetails] = useState(null);
  const healthCardClose = () => {
    setHealthCardDetails(null);
    setShowHealthCard(false);
  };
  const openHealthCard = (row) => {
    let patientObj = {
      name: row.name,
      email: row.email,
      patientId: row.userId,
      number: row.number,
      bloodGroup: row.bloodGroup,
    };
    setHealthCardDetails(patientObj);
    setShowHealthCard(true);
  };
  const [patientData, setPatientData] = useState({
    userId: "",
    name: "",
    number: "",
    bloodGroup: "",
    address: "",
    email: "",
  });

  const handlePatientDataChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  const userObj = useSelector((state) => state.UserReducer.oUser);
  //setPatientData
  const getPatientData = (patientId) => {
    console.log(patientId);
    axios
      .get(`users/${patientId}`)
      .then((resp) => {
        if (resp.status === 200) {
          setPatientData(resp.data);
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

  const editPatientData = () => {
    setBackdrop(true);
    if (
      patientData.number === null ||
      patientData.number === "" ||
      patientData.address === null ||
      patientData.address === "" ||
      !RegExp(/^\d{10}$/).test(patientData.number)
    ) {
      setBackdrop(false);
      setAlertMessage("Enter valid patient data");
      setAlertType("error");
      snackbarOpen();
    } else {
      axios
        .put(`patient/${patientId}`, {
          number: patientData.number,
          address: patientData.address,
        })
        .then((resp) => {
          if (resp.status === 200 || resp.status === 204) {
            setAllowEdit(false);
            setBackdrop(false);
            setAlertMessage("Information Updated!");
            setAlertType("success");
            snackbarOpen();
          }
        })
        .catch((error) => {
          setBackdrop(false);
          setAlertMessage("Something went wrong, Please try again!");
          setAlertType("error");
          snackbarOpen();
        });
    }
  };
  let runOnce = true;
  useEffect(() => {
    if (runOnce && userObj.id != null) {
      setBackdrop(true);
      setPatientId(userObj.id);
      getPatientData(userObj.id);
      runOnce = false;
    }
  }, []);

  return (
    <>
      {patientData && (
        <Box>
          <Grid container spacing={2} textAlign="left">
            <Grid item xs={6}>
              <Typography style={{ color: "gray", fontSize: "12px" }}>
                Name
              </Typography>
              <Typography>{patientData.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography style={{ color: "gray", fontSize: "12px" }}>
                Id
              </Typography>
              <Typography>{patientData.userId}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography style={{ color: "gray", fontSize: "12px" }}>
                Email Id
              </Typography>
              <Typography>{patientData.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography style={{ color: "gray", fontSize: "12px" }}>
                Blood Group
              </Typography>
              <Typography>{patientData.bloodGroup}</Typography>
            </Grid>
            <Grid item xs={6}>
              {!allowEdit && (
                <>
                  <Typography style={{ color: "gray", fontSize: "12px" }}>
                    Contact Number
                  </Typography>
                  <Typography>{patientData.number}</Typography>
                </>
              )}
              {allowEdit && (
                <TextField
                  id="number"
                  name="number"
                  label="Contact Number"
                  value={patientData.number}
                  fullWidth
                  onChange={(e) => {
                    handlePatientDataChange(e);
                  }}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {!allowEdit && (
                <>
                  <Typography style={{ color: "gray", fontSize: "12px" }}>
                    Address
                  </Typography>
                  <Typography>{patientData.address}</Typography>
                </>
              )}
              {allowEdit && (
                <TextField
                  id="address"
                  name="address"
                  label="Address"
                  value={patientData.address}
                  fullWidth
                  onChange={(e) => {
                    handlePatientDataChange(e);
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => {
                  openHealthCard(patientData);
                }}
                style={{ marginRight: "10px" }}
                variant={"outlined"}
              >
                Show Health Card
              </Button>
              {!allowEdit && (
                <Button
                  onClick={() => {
                    setAllowEdit(true);
                  }}
                  style={{ marginRight: "10px" }}
                  variant={"outlined"}
                >
                  Edit
                </Button>
              )}
              {allowEdit && (
                <Button
                  onClick={() => {
                    editPatientData();
                  }}
                  style={{ marginRight: "10px" }}
                  variant={"outlined"}
                >
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      {showHealthCard && healthCardDetails && (
        <HealthCard
          healthCardClose={healthCardClose}
          showHealthCard={showHealthCard}
          healthCardDetails={healthCardDetails}
        />
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
