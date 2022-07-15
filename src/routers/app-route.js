const router = require("express").Router();
const homeController = require("../controllers").home;
const gajiController = require("../controllers").gaji;
const verifyUser = require("../configs/verify");

router.get("/", verifyUser.isLogin, homeController.home);
// Category
router.get("/gaji", verifyUser.isLogin, gajiController.list);
router.post("/gaji/save", verifyUser.isLogin, gajiController.save);
router.post("/gaji/update", verifyUser.isLogin, gajiController.update);
router.post("/gaji/delete", verifyUser.isLogin, gajiController.delete);
router.get("/gaji/report", verifyUser.isLogin, gajiController.report);

module.exports = router;
