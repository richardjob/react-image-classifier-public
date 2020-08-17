import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { auth } from "../firebase";
import Base from "./Base";
import axios from "axios";
import welcomeImg from "../assets/welcome.svg";

const Home = () => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const name = localStorage.getItem("user");
  const email = localStorage.getItem("email");

  document.getElementById("image");

  const uploadImage = async () => {
    setLoading(true);

    let formData = new FormData();
    formData.append("email", email);
    formData.append("image", document.getElementById("image").files[0]);

    let res = await axios.post(
      "https://rj-image-classifier.herokuapp.com/upload",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    );
    if (res.data.status === "success") {
      setUrl(res.data.url);
      setLoading(false);
      setRedirect(true);
    } else setLoading(false);
  };

  const doLoading = () => {
    if (loading) {
      return (
        <button className="btn btn-success mt-3" type="button" disabled>
          <span
            className="spinner-border spinner-border-sm p-2"
            role="status"
            aria-hidden="true"></span>
          <span className="ml-2">Uploading</span>
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-success mt-3"
          onClick={(e) => {
            e.preventDefault();
            uploadImage();
          }}>
          Upload Image
        </button>
      );
    }
  };

  const doRedirect = () => {
    if (redirect) {
      return <Redirect to={{ pathname: "/result", state: { url: url } }} />;
    }
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      localStorage.clear();
      window.location.replace("/login");
    });
  };

  return (
    <div>
      <Base title="Image Classifier" />
      <div className="container row m-auto">
        <div className="m-auto text-center p-4" width="100">
          <img src={welcomeImg} alt="welcomeImg" className="img-fluid m-auto" width="500" />
        </div>
      </div>
      <div className="container row">
        <div className="col-md-8 pl-3 p-4" style={{ width: "100%" }}>
          <form id="form">
            <div className="form-group">
              <label htmlFor="image" className="h5 md-3">
                Click a Picture or upload a Image
              </label>
              <p className="mt-2 mb-3">Maximum size: 8MB</p>
              <input
                type="file"
                className="form-control-file"
                accept="image/*"
                id="image"
              />
              <div id="upload">{doLoading()}</div>
            </div>
          </form>
        </div>
        <div className="col-md-4 pl-3 p-4">
          <h3>Name: {name}</h3>
          <h5>Email: {email}</h5>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleSignOut();
            }}>
            sign out
          </button>
        </div>
      </div>
      {doRedirect()}
    </div>
  );
};

export default Home;
