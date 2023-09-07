import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
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
  TextField,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alerts } from "../../../components/alert";
import { validNumberRegex } from "../../../config/commonConfig";
import { fontBold, noPointerEvent } from "../../../config/commonStyles";
export default function Prescription(props) {
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

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [details, setDetails] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [disablePatientInfo, setDisablePatientInfo] = useState(false);
  const [medicineData, setMedicineData] = useState(null);
  const [addMedicineModal, setAddMedicineModal] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [allowEdit, setAllowEdit] = useState(true);

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

  const [medicine, setMedicine] = useState({
    medicineName: "",
    medicineQuantity: "",
    note: "",
    id: null,
  });

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setMedicine((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const userObj = useSelector((state) => state.UserReducer.oUser);
  const doctorId = userObj.id;

  const addMedicine = () => {
    setBackdrop(true);
    const medicineObj = medicineData != null ? medicineData : [];
    debugger;

    if (
      !RegExp(/^\d+$/).test(medicine.medicineQuantity) ||
      parseInt(medicine.medicineQuantity) < 1 ||
      !medicine.medicineName ||
      !medicine.note
    ) {
      {
        setBackdrop(false);
        setMedicine({
          medicineId: null,
          medicineName: "",
          medicineQuantity: "",
          note: "",
        });
        setAlertMessage("Enter valid medicine details");
        setAlertType("error");
        snackbarOpen();
      }
    } else {
      medicineObj.push(medicine);

      setMedicineData(medicineObj);
      setMedicine({
        medicineId: null,
        medicineName: "",
        medicineQuantity: "",
        note: "",
      });
      setAddMedicineModal(false);
      setBackdrop(false);
      setAlertMessage("Medicine Added!");
      setAlertType("success");
      snackbarOpen();
    }
  };

  const deleteMedicineRow = (row) => {
    let medObj = medicineData.filter((item) => item !== row);
    setMedicineData(medObj);
  };

  const getPrescriptionData = (prescriptionId) => {
    setBackdrop(true);
    axios
      .get(`prescriptions/${prescriptionId}`)
      .then((resp) => {
        if (resp.status === 200) {
          console.log(resp.data);
          setPrescriptionData(resp.data.prescriptions);

          setDetails(resp.data.details);
          setCreatedAt(resp.data.createdAt);

          setMedicineData(resp.data.medicines);
          console.log(resp.data.medicines);
          setAllowEdit(doctorId === resp.data.doctorId);

          setBackdrop(false);
        } else {
          setBackdrop(false);
          setAlertMessage(resp.response.data.message);
          setAlertType("error");
        }
      })
      .catch((error) => {
        console.log(error.config);
        console.log(error.message);
        console.log(error.response);
        setBackdrop(false);
        setAlertMessage("Login failed");
        setAlertType("error");
        snackbarOpen();
      });
  };

  const insertNewPrescription = () => {
    let prescriptionObj = {};
    let medicines = [];
    if (medicineData === null || medicineData.length === 0) {
      setBackdrop(false);
      setAlertMessage("Please add atleast 1 medicine");
      setAlertType("error");
      snackbarOpen();
    } else {
      for (let i = 0; i < medicineData.length; i++) {
        let tempObj = {};
        tempObj.medicineName = medicineData[i].medicineName;
        tempObj.medicineQuantity = medicineData[i].medicineQuantity;
        tempObj.note = medicineData[i].note;
        medicines.push(tempObj);
      }
      prescriptionObj.medicines = medicines;
      prescriptionObj.details = details;
      prescriptionObj.patientId = patientId;
      console.log(prescriptionObj);

      axios
        .post(`prescriptions`, prescriptionObj)
        .then((resp) => {
          if (resp.status === 200) {
            console.log(resp.data);
            setPrescriptionId(resp.data.prescriptionId);
            getPrescriptionData(resp.data.prescriptionId);

            setBackdrop(false);
            setAlertMessage("Prescription Added!");
            setAlertType("success");
            snackbarOpen();
          } else {
            setBackdrop(false);
            setAlertMessage(resp.response.data.message);
            setAlertType("error");
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
    }
  };

  const updatePrescription = () => {
    let prescriptionObj = {};
    let medicines = [];
    if (medicineData === null || medicineData.length === 0) {
      setBackdrop(false);
      setAlertMessage("Please add atleast 1 medicine");
      setAlertType("error");
      snackbarOpen();
    } else {
      for (let i = 0; i < medicineData.length; i++) {
        let tempObj = {};
        tempObj.medicineName = medicineData[i].medicineName;
        tempObj.medicineQuantity = medicineData[i].medicineQuantity;
        tempObj.note = medicineData[i].note;
        medicines.push(tempObj);
      }
      prescriptionObj.medicines = medicines;
      prescriptionObj.details = details;

      console.log(prescriptionObj);

      axios
        .put(`prescriptions/${prescriptionId}`, prescriptionObj)
        .then((resp) => {
          if (resp.status === 204) {
            setBackdrop(false);
            setAlertMessage("Prescription Updated!");
            setAlertType("success");
            snackbarOpen();
          } else {
            console.log(resp);
            setBackdrop(false);
            setAlertMessage(resp.response.data.message);
            setAlertType("error");
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
    }
  };

  //   const updateMedicine = (row) => {
  //     axios
  //       .put(`prescriptions/${prescriptionId}/medicine/${row.medicineId}`, {
  //         medicineName: row.medicineName,
  //         medicineQuantity: row.medicineQuantity,
  //         note: row.note,
  //       })
  //       .then((resp) => {
  //         if (resp.status === 204) {
  //           setBackdrop(false);
  //           getPrescriptionData(prescriptionId);
  //           setAlertMessage("Medicine Updated!");
  //           setAlertType("success");
  //           snackbarOpen();
  //         } else {
  //           setBackdrop(false);
  //           setAlertMessage(resp.response.data.message);
  //           setAlertType("error");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error.config);
  //         console.log(error.message);
  //         console.log(error.response);
  //         setBackdrop(false);
  //         setAlertMessage("Something went wrong, Please try again!");
  //         setAlertType("error");
  //         snackbarOpen();
  //       });
  //   };

  const savePrescription = () => {
    setBackdrop(true);
    if (prescriptionId) {
      updatePrescription();
    } else {
      insertNewPrescription();
    }
  };

  let runOnce = true;
  useEffect(() => {
    if (runOnce) {
      if (props.patientId !== null) {
        setPatientId(props.patientId);
        setPatientName(props.patientName);
        setDisablePatientInfo(true);
        if (props.prescriptionId) {
          setPrescriptionId(props.prescriptionId);
          getPrescriptionData(props.prescriptionId);
        } else {
          setCreatedAt(new Date().toLocaleDateString());
        }
      }
      runOnce = false;
    }
  }, []);

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" style={{ display: "inline" }}>
              Prescription
            </Typography>
            {prescriptionId && <> (Id: {prescriptionId})</>}
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="patientName"
              name="patientName"
              label="Patient Name"
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
              }}
              fullWidth
              style={disablePatientInfo ? noPointerEvent : {}}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="createdAt"
              name="createdAt"
              label="Date"
              value={moment(createdAt).format("YYYY-MM-DD")}
              fullWidth
              sx={noPointerEvent}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="details"
              name="details"
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
              fullWidth
              multiline
              label="Details"
              minRows={2}
              style={allowEdit ? {} : noPointerEvent}
            />
          </Grid>
          <Grid item xs={12} textAlign="left" style={{ display: "inline" }}>
            <Typography variant="h5" style={{ display: "inline" }}>
              Medicine
            </Typography>
            {allowEdit && (
              <IconButton
                style={{ display: "inline" }}
                onClick={() => {
                  setAddMedicineModal(true);
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {allowEdit && (
                      <>
                        <TableCell style={fontBold} width="10%">
                          Delete
                        </TableCell>
                      </>
                    )}
                    <TableCell style={fontBold}>Name</TableCell>
                    <TableCell style={fontBold}>Quantity</TableCell>
                    <TableCell style={fontBold}>Note</TableCell>
                  </TableRow>
                </TableHead>
                {medicineData && (
                  <>
                    <TableBody>
                      {medicineData.map((row, index) => (
                        <TableRow key={index}>
                          {allowEdit && (
                            <>
                              <TableCell>
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    deleteMedicineRow(row);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </>
                          )}
                          <TableCell>{row.medicineName}</TableCell>
                          <TableCell>{row.medicineQuantity}</TableCell>
                          <TableCell>{row.note}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                )}
              </Table>
            </TableContainer>
          </Grid>
          {allowEdit && (
            <Grid item xs={12} textAlign="right" style={{ display: "inline" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  savePrescription();
                }}
                disabled={patientId === doctorId}
              >
                Save Prescription
              </Button>
            </Grid>
          )}
        </Grid>
        {addMedicineModal && (
          <Modal
            open={addMedicineModal}
            onClose={() => {
              setAddMedicineModal(!addMedicineModal);
            }}
          >
            <Box sx={style}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    style={{ textAlign: "center" }}
                    variant="h5"
                    component="h2"
                  >
                    Medicine
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="medicineName"
                    name="medicineName"
                    label="Medicine Name"
                    value={medicine.medicineName}
                    onChange={(e) => {
                      handleMedicineChange(e);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="medicineQuantity"
                    name="medicineQuantity"
                    label="Medicine Quantity"
                    value={medicine.medicineQuantity}
                    onChange={(e) => {
                      handleMedicineChange(e);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={2}
                    id="note"
                    name="note"
                    label="Note"
                    value={medicine.note}
                    onChange={(e) => {
                      handleMedicineChange(e);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} style={{ textAlign: "right" }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      //   if (medicine.medicineId !== null) {
                      //     addMedicine();
                      //   } else {
                      //     updateMedicine(medicine);
                      //   }
                      addMedicine();
                    }}
                  >
                    {medicine.medicineId == null && <>Add Medicine</>}
                    {medicine.medicineId != null && <>Update Medicine</>}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
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
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
