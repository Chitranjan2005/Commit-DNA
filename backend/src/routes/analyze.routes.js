const express = require("express");
const router = express.Router();

const analyzeController = require("../controllers/analyze.controller");

router.post("/analyze", analyzeController.analyzeRepo);
router.post("/burnout", analyzeController.burnoutRepo);

module.exports = router;