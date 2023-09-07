import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alerts } from "../../../components/alert";
import HealthCard from "../../health_card";
export default function Patients() {
    let navigate = useNavigate();

    const [usersData, setUsersData] = useState(null);
    
    const [nameFilter, setNameFilter] = useState("");

    const [myPatient, setMyPatient] = useState(false);

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
            bloodGroup: row.bloodGroup,
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

    const getData = () => {
        setBackdrop(true);
        if (nameFilter !== "" && nameFilter !== null) {
            axios
                .post("doctor/filter", { searchName: nameFilter, myPatient })
                .then((resp) => {
                    if (resp.status === 200) {
                        console.log(resp.data);
                        setUsersData(resp.data);
                        setBackdrop(false);
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
            setAlertMessage("Enter a patient's name");
            setAlertType("error");
            snackbarOpen();
        }
    };

    return (
        <>
            <Box>
                <div>
                    <Grid container spacing={1}>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="nameFilter"
                                label="Name"
                                value={nameFilter}
                                onChange={(e) => {
                                    setNameFilter(e.target.value);
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button
                                fullWidth
                                variant="outlined"
                                endIcon={<SearchIcon />}
                                style={{ marginTop: "10px" }}
                                onClick={() => {
                                    getData();
                                }}
                            >
                                Search
                            </Button>
                        </Grid>
                        <Grid>
                            <input
                                value={myPatient}
                                onClick={() => {
                                    setMyPatient(!myPatient);
                                }}
                                type="checkbox"
                            />
                            Only show my patients
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </div>
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
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                            "&:hover": {
                                                backgroundColor:
                                                    "#e6e6e6 !important",
                                            },
                                        }}
                                    >
                                        <TableCell align="left">
                                            {row.userId}
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            onClick={() => {
                                                navigate(
                                                    `/patient/${row.userId}`
                                                );
                                            }}
                                            style={{
                                                color: "blue",
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.number}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.bloodGroup}
                                        </TableCell>
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
