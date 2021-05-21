const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task");
const userAuthentication = require("../middleware/user-authentication");

router.get("/", taskController.get_all_task);
router.get("/booked", userAuthentication, taskController.get_booked_task);
router.get("/download", taskController.download_task);
router.post("/", taskController.task_upload);
router.delete("/:id", taskController.delete_task);

module.exports = router;
