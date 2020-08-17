import React from "react";
import { auth } from "../firebase";
import * as firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Base from "../core/Base";
import siginImg from "../assets/signin.svg";

const Login = () => {
  var uiConfig = {
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    signInSuccessUrl: "/",
    signInFlow: "popup",
  };

  function login() {
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
        localStorage.setItem("user", user.displayName);
        localStorage.setItem("email", user.email);
      }
    });
  }

  return (
    <div>
      <Base title="Image Classifier" />

      <div className="col-12 text-center p-5">
        <div
          className="card m-auto border border-dark"
          style={{ width: "70vw" }}>
          <p className="h3 text-center p-3">Sign in to continue</p>
          <img
            src={siginImg}
            alt="signinImg"
            className="img-fluid m-auto pb-4"
            width="500"
          />
          <div className="bg-dark">
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        </div>
      </div>

      {login()}
    </div>
  );
};

export default Login;
