import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
    TableRow, TextField,
    Typography
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alerts } from "../../components/alert";
import { apiBaseUrl } from "../../config/commonConfig";
export function Admin() {
    const [modal, setModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [pendingRequestsData, setPendingRequestsData] = useState(null);
    const [currentRecordRemark, setCurrentRecordRemark] = useState("");

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
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const openDataModal = (row) => {
        setCurrentRecord(row);
        setCurrentRecordRemark(row["remarks"] !== null ? row["remarks"] : "");
        setModal(true);
    };
    const closeDataModal = (row) => {
        setModal(false);
        setCurrentRecord(null);
        setCurrentRecordRemark("");
    };

    const getPendingRequests = () => {
        axios
            .post("users/filter", { status: "PENDING" })
            .then((resp) => {
                if (resp.status === 200) {
                    console.log(resp.data);

                    setPendingRequestsData(resp.data);
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
    };

    const updateRecord = (status) => {
        setBackdrop(true);
        axios
            .put(apiBaseUrl + "users/" + currentRecord["userId"], {
                status: status,
                remarks: currentRecordRemark,
            })
            .then((resp) => {
                if (resp.status === 204) {
                    console.log(resp);

                    let message = "";

                    if (status === "PENDING") {
                        message = "Remarks udated";
                        setBackdrop(false);
                    } else if (status === "APPROVED") {
                        message = "User request approved";
                        closeDataModal();
                        getPendingRequests();
                    } else if (status === "REJECTED") {
                        message = "User request rejected";
                        closeDataModal();
                        getPendingRequests();
                    }
                    setAlertMessage(message);
                    setAlertType("success");
                    snackbarOpen();
                }
            })
            .catch((error) => {
                console.log(error.config);
                console.log(error.message);
                console.log(error.response);
                setBackdrop(false);
                setAlertMessage("Something went wrong, please try again!");
                setAlertType("error");
                snackbarOpen();
            });
    };

    useEffect(() => {
        setBackdrop(true);
        getPendingRequests();
    }, []);

    return (
        <>
            <Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Id</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Document</TableCell>
                                <TableCell align="left">Profile</TableCell>
                            </TableRow>
                        </TableHead>
                        {pendingRequestsData && (
                            <TableBody>
                                {pendingRequestsData.map((row) => (
                                    <TableRow
                                        key={row.userId}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell align="left">
                                            {row.userId}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.statusName}
                                        </TableCell>
                                        <TableCell align="left">
                                            {moment(row.createdAt).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton>
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton
                                                onClick={() => {
                                                    openDataModal(row);
                                                }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
                {currentRecord && (
                    <Modal
                        open={modal}
                        onClose={() => {
                            setModal(!modal);
                        }}
                    >
                        <Box sx={style}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography
                                        style={{ textAlign: "center" }}
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                    >
                                        User details
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>User ID:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        {currentRecord["userId"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Name:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        {currentRecord["name"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Email:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        {currentRecord["email"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Contact Number:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        {currentRecord["number"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Blood Group:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        {currentRecord["bloodGroup"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Address:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        {currentRecord["address"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Remarks:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        multiline
                                        rows={2}
                                        id="remarks"
                                        name="remarks"
                                        value={currentRecordRemark}
                                        onChange={(e) => {
                                            setCurrentRecordRemark(
                                                e.target.value
                                            );
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    style={{ textAlign: "right" }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            updateRecord("PENDING");
                                        }}
                                        style={{ marginRight: "10px" }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            updateRecord("APPROVED");
                                        }}
                                        style={{ marginRight: "10px" }}
                                        color="success"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            updateRecord("REJECTED");
                                        }}
                                        style={{ marginRight: "10px" }}
                                        color="error"
                                    >
                                        Reject
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
                    zIndex: (theme) => theme.zIndex.modal + 1,
                }}
                open={backdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}
