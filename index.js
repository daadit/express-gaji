const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("req-flash");
const app = express();

require("dotenv").config();
const { NODE_ENV, PORT_SERVER_DEV, PORT_SERVER_PRO, SECR_KEY } = process.env;

let PORT, KEY;
if (NODE_ENV === "production") {
    PORT = PORT_SERVER_PRO;
    KEY = SECR_KEY;
} else {
    PORT = PORT_SERVER_DEV;
    KEY = SECR_KEY;
}

const appRouting = require("./src/routers/app-route");
const loginRouting = require("./src/routers/login-route");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: KEY,
        name: "secretName",
        cookie: {
            sameSite: true,
            maxAge: 100000000,
        },
    })
);
app.use(flash());

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.use("/assets", express.static(path.join(__dirname, "src/assets")));

app.use("/", appRouting);
app.use("/login", loginRouting);

app.listen(PORT, () => {
    console.log("Application running in port : " + PORT);
});

module.exports = app;
