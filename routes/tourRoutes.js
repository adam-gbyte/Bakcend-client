const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");

router.get("/", tourController.getAllTours);
router.post("/city", tourController.addCity);
router.post("/tour", tourController.addTour);
router.put("/tour/:id", tourController.updateTour);
router.delete("/tour/:id", tourController.deleteTour);

module.exports = router;
