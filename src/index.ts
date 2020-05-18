// require is used to import modules that exist in other files
// const express = require("express");
import express from "express";
import path from "path";
import dotenv from "dotenv";

// initialize configuration
dotenv.config();

// port is now avialable to the node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

// creates an express app, the express() function is a top level function exported by the express module
const app = express();
// const port = 8080; // default port to listen

// configure express to use ejs
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

// define a route handler for the default home page
app.get("/", (req:any, res:any) => {
    // res.send("Hello world!");
    // render the index template
    res.render("index");

});

// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});