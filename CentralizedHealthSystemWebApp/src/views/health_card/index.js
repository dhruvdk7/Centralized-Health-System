import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Typography,
    Toolbar,
} from "@mui/material";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import QRCode from "qrcode.react";
import React, { useRef } from "react";

import logo from "../../assets/images/chs_logo.png";

const HealthCard = (props) => {
    const cardRef = useRef(null);

    const handleDownloadClick = () => {
        html2canvas(cardRef.current).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(
                    blob,
                    `${props.healthCardDetails.name.replace(
                        /\s+/g,
                        "-"
                    )}-health-card.png`
                );
            });
        });
    };

    return (
        <>
            <Dialog open={props.showHealthCard} onClose={props.healthCardClose}>
                <DialogContent ref={cardRef}>
                    <Card>
                        <CardContent style={{ border: "3px solid #000" }}>
                            <div style={{textAlign:"center" }}>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    height={40}
                                    width={180}
                                />
                            </div>
                            <Typography
                                variant="h5"
                                style={{ marginBottom: "12 px", textAlign:"center" }}
                            >
                                Health Card
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={7}>
                                    <div style={{ marginBottom: "16px" }}>
                                        <Typography
                                            style={{ fontWeight: "bold" }}
                                        >
                                            User ID: {props.healthCardDetails.patientId}
                                        </Typography>
                                        <Typography
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Name: {props.healthCardDetails.name}
                                        </Typography>
                                        <Typography
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Phone: {props.healthCardDetails.number}
                                        </Typography>
                                        <Typography
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Email: {props.healthCardDetails.email}
                                        </Typography>
                                        <Typography
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Blood Group: {props.healthCardDetails.bloodGroup}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={5}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "100%",
                                            marginRight: "15px",
                                        }}
                                    >
                                        <QRCode
                                            value={props.healthCardDetails.patientId.toString()}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.healthCardClose}>Close</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadClick}
                    >
                        Download Health Card
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default HealthCard;
