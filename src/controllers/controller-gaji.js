const config = require("../configs/database");
const path = require("path");

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
    list(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM table_gaji;
                `,
                function (error, results) {
                    if (error) throw error;
                    res.render("gaji", {
                        url: URL,
                        userName: req.session.username,
                        userId: req.session.userid,
                        gaji: results,
                        expressFlash: req.flash("message"),
                        nourut: 1,
                    });
                }
            );
            connection.release();
        });
    },
    save(req, res){
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `INSERT INTO table_gaji SET ? `,
                {
                    gaji_bulan: req.body.bulan,
                    gaji_tahun: req.body.tahun,
                    gaji_nama: req.body.nama,
                    gaji_golongan: req.body.golongan,
                    gaji_gaji_pokok: req.body.gajipokok,
                    gaji_jabatan: req.body.jabatan,
                    gaji_tunjangan_jabatan: req.body.tunjanganjabatan,
                    gaji_status_pernikahan: req.body.statuspernikahan,
                    gaji_jumlah_anak: req.body.jumlahanak,
                    gaji_tunjangan_keluarga: req.body.tunjangankeluarga,
                    gaji_tunjangan_anak: req.body.tunjangananak,
                    gaji_total_gaji: req.body.totalgaji,
                },
                function (error, results) {
                    if (error) throw error;
                    res.redirect("/gaji");
                }
            );
            connection.release();
        });
    },
    update(req, res){
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `UPDATE table_gaji SET 
                    table_gaji.gaji_bulan = ?,
                    table_gaji.gaji_tahun = ?,
                    table_gaji.gaji_nama = ?,
                    table_gaji.gaji_golongan = ?,
                    table_gaji.gaji_gaji_pokok = ?,
                    table_gaji.gaji_jabatan = ?,
                    table_gaji.gaji_tunjangan_jabatan = ?,
                    table_gaji.gaji_status_pernikahan = ?,
                    table_gaji.gaji_jumlah_anak = ?,
                    table_gaji.gaji_tunjangan_keluarga = ?,
                    table_gaji.gaji_tunjangan_anak = ?,
                    table_gaji.gaji_total_gaji = ?
                WHERE table_gaji.gaji_id = ?`,
                [
                    req.body.bulanupdate,
                    req.body.tahunupdate,
                    req.body.namaupdate,
                    req.body.golonganupdate,
                    req.body.gajipokokupdate,
                    req.body.jabatanupdate,
                    req.body.tunjanganjabatanupdate,
                    req.body.statuspernikahanupdate,
                    req.body.jumlahanakupdate,
                    req.body.tunjangankeluargaupdate,
                    req.body.tunjangananakupdate,
                    req.body.totalgajiupdate,
                    req.body.id
                ],
                function (error, results) {
                    if (error) throw error;
                    res.redirect("/gaji");
                }
            );
            connection.release();
        });
    },
    delete(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `
                    DELETE FROM table_gaji WHERE gaji_id = ?
                `,
                [req.body.id],
                function (error, results) {
                    if (error) throw error;
                    res.redirect("/gaji");
                }
            );
            connection.release();
        });
    },
    report(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM table_gaji;
                `,
                function (error, results) {
                    if (error) throw error;
                    res.render("report", {
                        url: URL,
                        userName: req.session.username,
                        userId: req.session.userid,
                        gaji: results,
                        expressFlash: req.flash("message"),
                        nourut: 1,
                    });
                }
            );
            connection.release();
        });
    },
};
