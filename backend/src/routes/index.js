const { Router } = require("express");
const authRoutes = require("../app/http/modules/auth/auth.routes");

const router = Router();

router.use("/auth", authRoutes);

module.exports = router;