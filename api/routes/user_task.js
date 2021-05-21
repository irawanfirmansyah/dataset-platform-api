const express = require("express");
const router = express.Router();
const userTaskController = require("../controllers/user_task");

router.get("/", userTaskController.get_all_user_task);
router.post("/", userTaskController.book_task);
router.delete("/", userTaskController.revoke_task);

module.exports = router;
