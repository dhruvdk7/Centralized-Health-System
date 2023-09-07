import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
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
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Alerts } from "../../../components/alert";
import HealthCard from "../../health_card";
import QrReader from "react-qr-scanner";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CloseIcon from "@mui/icons-material/Close";
export default function SearchUsers() {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1100,
        bgcolor: "#fff",
        //border: '2px solid #000',
        boxShadow: 24,
        borderRadius: "10px",
        p: 4,
    };

    let navigate = useNavigate();
    const [usersData, setUsersData] = useState(null);
    const ref = useRef(null);
    const [searchId, setSearchId] = useState("");

    const [showHealthCard, setShowHealthCard] = useState(false);

    const [healthCardDetails, setHealthCardDetails] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
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

    const getData = () => {
        setBackdrop(true);

        if (
            searchId !== "" &&
            searchId !== null &&
            RegExp(/^\d+$/).test(searchId)
        ) {
            axios
                .post("doctor/filter", { searchId: searchId })
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
            setAlertMessage("Enter a valid patient id");
            setAlertType("error");
            snackbarOpen();
        }
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

    return (
        <>
            <Box>
                <div>
                    <Grid container spacing={1}>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="searchId"
                                label="User Id"
                                value={searchId}
                                onChange={(e) => {
                                    setSearchId(e.target.value);
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button
                                fullWidth
                                variant="contained"
                                endIcon={<SearchIcon />}
                                color="success"
                                style={{
                                    marginTop: "10px",
                                }}
                                onClick={() => {
                                    getData();
                                }}
                            >
                                Search
                            </Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Button
                                fullWidth
                                variant="contained"
                                endIcon={<QrCodeScannerIcon />}
                                style={{
                                    marginTop: "10px",
                                    //height: "56px",
                                }}
                                onClick={() => {
                                    setIsRecording(true);
                                }}
                            >
                                Scan
                            </Button>
                        </Grid>
                        <Grid item xs={1}>
                            {isRecording && (
                                <>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="warning"
                                        endIcon={<CloseIcon />}
                                        style={{
                                            marginTop: "10px",
                                            //height: "56px",
                                        }}
                                        onClick={() => {
                                            closeCam();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={4}></Grid>
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
                                                navigate(`/user/${row.userId}`);
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
