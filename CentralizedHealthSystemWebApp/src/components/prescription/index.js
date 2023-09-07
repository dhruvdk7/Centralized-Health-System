import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { fontBold } from "../../config/commonStyles";

export default function Prescription(props) {
  const [patientName, setPatientName] = useState("");
  const [details, setDetails] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [medicineData, setMedicineData] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);

  const [backdrop, setBackdrop] = React.useState(false);

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
          setBackdrop(false);
        }
      })
      .catch((error) => {
        console.log(error.config);
        console.log(error.message);
        console.log(error.response);
        setBackdrop(false);
      });
  };

  let runOnce = true;
  useEffect(() => {
    if (runOnce) {
      if (props.patientId !== null) {
        setPatientName(props.patientName);
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
            <Typography style={{ color: "gray", fontSize: "12px" }}>
              Patient Name
            </Typography>
            <Typography>{patientName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{ color: "gray", fontSize: "12px" }}>
              Date
            </Typography>
            <Typography>{moment(createdAt).format("YYYY-MM-DD")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ color: "gray", fontSize: "12px" }}>
              Details
            </Typography>
            <Typography>{details}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="left" style={{ display: "inline" }}>
            <Typography variant="h5" style={{ display: "inline" }}>
              Medicine
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
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
        </Grid>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
