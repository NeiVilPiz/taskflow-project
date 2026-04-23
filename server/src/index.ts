import {
  calcularMedia,
  calcularMediana,
  filtrarAtipicos
} from "./math-utils";

// Datos de prueba
const datos: number[] = [10, 12, 14, 16, 18, 100];

// Pruebas
try {
  console.log("Datos:", datos);

  const media = calcularMedia(datos);
  console.log("Media:", media);

  const mediana = calcularMediana(datos);
  console.log("Mediana:", mediana);

  const filtrados = filtrarAtipicos(datos, 20);
  console.log("Sin atípicos:", filtrados);

} catch (error) {
  console.error("Error:", error);
}