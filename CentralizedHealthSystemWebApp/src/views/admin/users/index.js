import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Alerts } from "../../../components/alert";
export function AdminUsers() {
    const [modal, setModal] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState("");
    const currentRecord = useState(null);
    const [usersData, setUsersData] = useState(null);
    const [currentRecordRemark, setCurrentRecordRemark] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const statusFilter = "APPROVED";
    const [nameFilter, setNameFilter] = useState("");

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

    const roleList = [
        {
            value: "ADMIN",
            label: "Admin",
        },
        {
            value: "DOCTOR",
            label: "Doctor",
        },
        {
            value: "PHARMACY",
            label: "Pharmacy",
        },
        {
            value: "PATIENT",
            label: "Patient",
        },
    ];

    // const openDataModal = (row) => {
    //     setBackdrop(true);
    //     setCurrentRecord(row);
    //     setCurrentRecordRemark(row["remarks"] !== null ? row["remarks"] : "");
    //     axios
    //         .get("users/" + row.userId)
    //         .then((resp) => {
    //             if (resp.status === 200) {
    //                 console.log(resp.data);
    //                 resp.data.userId = row.userId;
    //                 setCurrentRecord(resp.data);
    //                 setBackdrop(false);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error.config);
    //             console.log(error.message);
    //             console.log(error.response);
    //             setBackdrop(false);
    //             setAlertMessage("Something went wrong, Please try again");
    //             setAlertType("error");
    //             snackbarOpen();
    //         });
    //     setModal(true);
    // };
    // const closeDataModal = (row) => {
    //     setModal(false);
    //     setCurrentRecord(null);
    //     setCurrentRecordRemark("");
    // };

    const downloadDocument = (row) => {
        setBackdrop(true);

        axios
            .get("users/" + row.userId)
            .then((resp) => {
                if (resp.status === 200) {
                    console.log(resp.data);
                    resp.data.userId = row.userId;
                    let a = document.createElement("a");
                    //a.href = "data:application/octet-stream;base64,"+data64;
                    a.href = resp.data.file;
                    a.download = "document.pdf";
                    a.click();
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
    const getData = () => {
        setBackdrop(true);
        let searchObj = {
            status: statusFilter,
        };
        let flag1 = false;
        let flag2 = false;
        if (nameFilter !== "" && nameFilter !== null) {
            searchObj = { ...searchObj, name: nameFilter };
            flag1 = true;
        }
        if (roleFilter !== "" && roleFilter !== null) {
            searchObj = { ...searchObj, role: roleFilter };
            flag2 = true;
        }
        if (flag1 || flag2) {
            axios
                .post("users/filter", searchObj)
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
            setAlertMessage("Enter a search parameter!");
            setAlertType("error");
            snackbarOpen();
        }
    };

    const deleteUser = (deleteUserId) => {
        setBackdrop(true);
        setDeleteDialog(false);
        axios
            .delete("users/" + deleteUserId)
            .then((resp) => {
                if (resp.status === 204) {
                    setBackdrop(false);
                    console.log(resp);
                    setAlertMessage(`User ${deleteUserId} deleted`);
                    setAlertType("success");
                    snackbarOpen();
                    setDeleteUserId("");
                    getData();
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
                        <Grid item xs={3}>
                            <TextField
                                id="roleFilter"
                                select
                                label="Role"
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                }}
                                fullWidth
                            >
                                {roleList.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                        <Grid item xs={1}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                endIcon={<ClearIcon />}
                                style={{ marginTop: "10px" }}
                                onClick={() => {
                                    setNameFilter("");
                                    setRoleFilter("");
                                }}
                            >
                                Clear
                            </Button>
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
                                <TableCell align="left">Address</TableCell>
                                <TableCell align="left">Document</TableCell>
                                <TableCell align="left">Role</TableCell>
                                <TableCell align="left">Date</TableCell>
                                {/* <TableCell align="left">View</TableCell> */}
                                <TableCell align="left">Remove</TableCell>
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
                                        <TableCell align="left">
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
                                        <TableCell align="left">
                                            {row.address}
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton
                                                onClick={() => {
                                                    downloadDocument(row);
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.roleName}
                                        </TableCell>

                                        <TableCell align="left">
                                            {moment(row.createdAt).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => {
                                                    setDeleteUserId(row.userId);
                                                    setDeleteDialog(true);
                                                }}
                                            >
                                                <DeleteIcon />
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
                                    <Typography>Document:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <IconButton
                                        onClick={() => {
                                            downloadDocument();
                                        }}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
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
                                {currentRecord["statusName"] === "PENDING" && (
                                    <Grid
                                        item
                                        xs={12}
                                        style={{ textAlign: "right" }}
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={() => {}}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {}}
                                            style={{ marginRight: "10px" }}
                                            color="success"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {}}
                                            style={{ marginRight: "10px" }}
                                            color="error"
                                        >
                                            Reject
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Modal>
                )}

                <Dialog
                    open={deleteDialog}
                    onClose={() => {
                        setDeleteDialog(false);
                    }}
                >
                    <DialogTitle>Delete User {deleteUserId}?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Permanently delete User {deleteUserId} from the
                            application?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDeleteDialog(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                deleteUser(deleteUserId);
                            }}
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
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
