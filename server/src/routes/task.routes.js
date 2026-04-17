const express = require("express");
const router = express.Router();

const taskController = require("../controllers/task.controller");

// recibir /api/v1/tasks
router.get("/", taskController.getTasks);

// Colocar /api/v1/tasks
router.post("/", taskController.createTask);

// Eliminar /api/v1/tasks/:id
router.delete("/:id", taskController.deleteTask);

module.exports = router;