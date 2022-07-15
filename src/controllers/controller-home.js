require("dotenv").config();
const { NODE_ENV, URL_DEV, URL_PRO } = process.env;

let URL;

if (NODE_ENV === "production") {
    URL = URL_PRO;
} else {
    URL = URL_DEV;
}

module.exports = {
    home(req, res) {
        res.render("home", {
            url: URL,
            userName: req.session.username,
        });
    },
};
