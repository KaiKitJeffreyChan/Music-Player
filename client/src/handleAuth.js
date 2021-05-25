import { useState, useEffect } from "react";
import axios from "axios";

//update hooks names must be in capitial, calling -> use lowercase
export default function HandleAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);

        //remove code from browser search bar
        window.history.pushState({}, null, "/");
      })
      //if tokens expire then redirect to login again
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  //useEffect used to check if refresh or expiresIn changes, then uses
  //refreshToken to get new tokens, by making post request to own server
  //Automates refresh
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        //if tokens expire then redirect to login again
        .catch(() => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
