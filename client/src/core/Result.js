import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import Base from "./Base";
import { Redirect } from "react-router";
const request = require("request");

const Result = ({ location }) => {
  let url;

  if (location.state) {
    url = location.state.url;
  } else {
    window.location.replace("/");
  }

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [err, setErr] = useState(false);

  const name = localStorage.getItem("user");
  const email = localStorage.getItem("email");

  const apiKey = ""; // Imagga API Key
  const apiSecret = ""; // Imagga API Secret

  useEffect(() => {
    setLoading(true);
    console.log("predict");
    request
      .get(
        "https://api.imagga.com/v2/tags?image_url=" +
          encodeURIComponent(url) +
          "&limit=4",
        function (error, response, body) {
          body = JSON.parse(body);
          if (body.status.type === "error") {
            setLoading(false);
            setErr(true);
            console.log(body.status.text);
          } else {
            setLoading(false);
            setPredictions(body.result.tags);
          }
        }
      )
      .auth(apiKey, apiSecret, true);
  }, [url]);

  const doRedirect = () => {
    if (redirect) {
      return <Redirect to="/" />;
    }
  };

  const showLoading = () => {
    if(loading) {
      return (
        <tr className="table-primary text-center">
          <td colSpan="3">Processing . . . . .</td>
        </tr>
      );
    }
  }

  const showError = () => {
    if (err) {
      return (
        <tr className="table-danger text-center">
          <th scope="row">error</th>
          <td colSpan="2">Overall limit of 2000 requests per month exceeded</td>
        </tr>
      );
    }
  };

  const goBack = () => {
    setRedirect(true);
  };

  function handleSignOut() {
    auth.signOut().then(() => {
      localStorage.clear();
      window.location.replace("/login");
    });
  }
  return (
    <div>
      <Base title="Classifier Result" />
      <div className="container row pl-4 pt-4">
        <button
          className="btn btn-info"
          onClick={() => {
            goBack();
          }}>
          Go Back
        </button>
      </div>
      <div className="container row m-auto">
        <div className="col-md-8 m-auto p-4 text-center">
          <img
            id="image"
            src={url}
            className="img-fluid m-auto"
            alt="uploaded"></img>

          <div className="p-4 row">
            <table className="table">
              <thead>
                <tr className="text-center">
                  <th scope="col">#</th>
                  <th scope="col">Prediction</th>
                  <th scope="col">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {showLoading()}
                {showError()}
                {predictions.length > 0 &&
                  predictions.map((prediction, i) => {
                    let { tag, confidence } = prediction;
                    confidence = confidence.toFixed(2) + " %";
                    if (i < 2) {
                      return (
                        <tr key={i} className="table-success text-center">
                          <th scope="row">{i + 1}</th>
                          <td>{tag.en}</td>
                          <td>{confidence}</td>
                        </tr>
                      );
                    } else if (i === 2) {
                      return (
                        <tr key={i} className="table-warning text-center">
                          <th scope="row">{i + 1}</th>
                          <td>{tag.en}</td>
                          <td>{confidence}</td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={i} className="table-danger text-center">
                          <th scope="row">{i + 1}</th>
                          <td>{tag.en}</td>
                          <td>{confidence}</td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-4 m-auto pl-4 pb-4">
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

export default Result;
