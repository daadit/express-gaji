const config = require("../configs/database");
const bcrypt = require("bcryptjs");

require("dotenv").config();
const { NODE_ENV, URL_DEV, URL_PRO } = process.env;

let URL;

if (NODE_ENV === "production") {
    URL = URL_PRO;
} else {
    URL = URL_DEV;
}

let mysql = require("mysql");
let pool = mysql.createPool(config);

pool.on("error", (err) => {
    console.error(err);
});

module.exports = {
    login(req, res) {
        res.render("login", {
            url: URL,
            expressFlash: req.flash("message"),
        });
    },
    loginAuth(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(`SELECT * FROM table_user WHERE user_email = ? LIMIT 1`, [username], function (error, results) {
                    if (error) throw error;
                    if (results.length > 0) {
                        if (bcrypt.compareSync(password, results[0].user_password)) {
                            if (results[0].user_is_active == 1) {
                                req.session.loggedin = true;
                                req.session.userid = results[0].user_id;
                                req.session.username = results[0].user_name;
                                res.redirect("/");
                            } else {
                                req.flash("message", "Your account is banned !");
                                res.redirect("/login");
                            }
                        } else {
                            req.flash("message", "Wrong password !");
                            res.redirect("/login");
                        }
                    } else {
                        req.flash("message", "Account not found");
                        res.redirect("/login");
                    }
                });
                connection.release();
            });
        } else {
            res.redirect("/login");
            res.end();
        }
    },
    logout(req, res) {
        // Hapus sesi user dari broser
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            // Hapus cokie yang masih tertinggal
            res.clearCookie("secretname");
            res.redirect("/login");
        });
    },
};
