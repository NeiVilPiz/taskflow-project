// src/config/env.js

require("dotenv").config();

// Validación manual
if (!process.env.PORT) {
  throw new Error("El puerto no está definido");
}

module.exports = {
  PORT: process.env.PORT
};