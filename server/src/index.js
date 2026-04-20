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

app.use((err, req, res, next) => {
  // Error controlado
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({
      error: "Recurso no encontrado"
    });
  }

  // Error no controlado
  console.error(err);

  res.status(500).json({
    error: "Error interno del servidor"
  });
});