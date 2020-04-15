"use strict";
require("dotenv").config();
const log = console.log;
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const { mongoose } = require("../../backend/db/mongoose");

const expressApp = express();

expressApp.use(upload.single("xml"));

expressApp.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

/* Routes from router */
const patientRoutes = require("../../backend/routes/patient");
const formRoutes = require("../../backend/routes/form");
const accountRoutes = require("../../backend/routes/account");
/* Routes from router end */

expressApp.use(bodyParser.json());

/* Server Resource Routes */
expressApp.use("/api/v1/patient", patientRoutes);
expressApp.use("/api/v1/form", formRoutes);
expressApp.use("/api/v1/account", accountRoutes);
/* Server Resource Routes End */

/* Frontend Resource Routes */
expressApp.use(express.static(path.resolve(__dirname, "..//build")));
expressApp.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build/index.html"));
});

const port = process.env.PORT || 3001;
expressApp.listen(port, () => {
  log(
    `Server is running on port: ${port}... \n For development use http://localhost:${port}/ \n For API use http://localhost:${port}/api/v1/`
  );
});

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const url = require("url");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1170, height: 884 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3001"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

module.exports = expressApp;
