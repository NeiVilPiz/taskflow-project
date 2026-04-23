"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_utils_1 = require("./math-utils");
// Datos de prueba
const datos = [10, 12, 14, 16, 18, 100];
// Pruebas
try {
    console.log("Datos:", datos);
    const media = (0, math_utils_1.calcularMedia)(datos);
    console.log("Media:", media);
    const mediana = (0, math_utils_1.calcularMediana)(datos);
    console.log("Mediana:", mediana);
    const filtrados = (0, math_utils_1.filtrarAtipicos)(datos, 20);
    console.log("Sin atípicos:", filtrados);
}
catch (error) {
    console.error("Error:", error);
}
