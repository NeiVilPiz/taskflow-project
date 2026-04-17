const express = require("express");
const cors = require("cors");

const { PORT } = require("./config/env");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("API TaskFlow funcionando 🚀");
});

// Montar rutas
app.use("/api/v1/tasks", taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});