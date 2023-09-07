import React, { lazy, Suspense, useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { removeJwtToken } from "./action/TokenAction.js";
import { removeUserDetails } from "./action/UserAction.js";
import { AdminRequests } from "./views/admin/requests/index.js";
import { AdminUsers } from "./views/admin/users/index.js";
import Patient from "./views/doctor/patient/index.js";
import Patients from "./views/doctor/patients/index.js";
import AddPrescription from "./views/doctor/prescription/index.js";
import MyPrescriptions from "./views/patient/myprescriptions/index.js";
import Profile from "./views/patient/profile/index.js";
import SearchPatients from "./views/pharmacy/search_user/index.js";
import User from "./views/pharmacy/user/index.js";

const EmailVerification = lazy(() =>
  import("./views/email_verification/index.js")
);
const LoginPage = lazy(() => import("./views/login"));
const Header = lazy(() => import("./components/Header/index.js"));
const SignupPage = lazy(() => import("./views/registration"));
const Page401 = lazy(() => import("./views/error/page401/index.js"));
const Page404 = lazy(() => import("./views/error/page404/index.js"));
const ForgotPassword = lazy(() => import("./views/forgot_password/index.js"));
const ResetPassword = lazy(() => import("./views/reset_password/index.js"));

const Nav = () => {
  let dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.TokenReducer.jwtToken);
  if (jwtToken !== null) {
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = jwtToken;
      return config;
    });
  }
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error);
      //debugger;
      //alert(error);
      if (
        !window.location.href.toLocaleLowerCase().includes("login") &&
        !window.location.href.toLocaleLowerCase().includes("registration") &&
        !window.location.href.toLocaleLowerCase().includes("verify") && 
        !window.location.href.toLocaleLowerCase().includes("patient")
      ) {
        if (error.response.status === 401 || error.response.status === 403) {
          dispatch(removeJwtToken());
          dispatch(removeUserDetails());
          localStorage.clear();
          window.location.href = "/401";
        } else if (error.response.status === 400) {
          dispatch(removeJwtToken());
          dispatch(removeUserDetails());
          localStorage.clear();
          window.location.href = "/404";
        }
      }
      return error;
    }
  );

  const SuspenseLoading = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
      let timeout = setTimeout(() => setShow(true), 300);
      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <>
        <AnimatePresence>
          {show && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <CircularProgress loading={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          <Route>
            {/* <Route index element={<LoginPage />} /> */}
            <Route index element={<Navigate to="/Login" />} />

            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Registration" element={<SignupPage />} />
            <Route path="/Verify/" element={<EmailVerification />} />
            <Route path="/Reset" element={<ResetPassword />} />
            <Route path="/" element={<Header />}>
              <Route path="/Requests" element={<AdminRequests />} />
              <Route path="/Users" element={<AdminUsers />} />
              <Route path="/Patients" element={<Patients />} />
              <Route path="/AddPrescription" element={<AddPrescription />} />
              <Route path="/Patient/:patientId" element={<Patient />} />
              <Route path="/SearchUsers" element={<SearchPatients />} />
              <Route path="/User/:patientId" element={<User />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/MyPrescriptions" element={<MyPrescriptions />} />
            </Route>
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/401" element={<Page401 />} />
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Nav;
