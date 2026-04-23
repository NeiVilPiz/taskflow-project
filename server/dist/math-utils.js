"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularMedia = calcularMedia;
exports.calcularMediana = calcularMediana;
exports.filtrarAtipicos = filtrarAtipicos;
// Calcula la media (promedio) de un array de números
function calcularMedia(array) {
    if (array.length === 0) {
        throw new Error("El array no puede estar vacío");
    }
    const suma = array.reduce((acc, num) => acc + num, 0);
    return suma / array.length;
}
//Calcula la mediana de un array de números
function calcularMediana(array) {
    if (array.length === 0) {
        throw new Error("El array no puede estar vacío");
    }
    const sorted = [...array].sort((a, b) => a - b);
    const mitad = Math.floor(sorted.length / 2);
    // Si es impar
    if (sorted.length % 2 !== 0) {
        return sorted[mitad];
    }
    // Si es par
    return (sorted[mitad - 1] + sorted[mitad]) / 2;
}
// Filtra valores atípicos según un límite
// Devuelve los valores dentro del rango permiti/
function filtrarAtipicos(array, limite) {
    if (array.length === 0) {
        throw new Error("El array no puede estar vacío");
    }
    const media = calcularMedia(array);
    return array.filter(num => Math.abs(num - media) <= limite);
}
