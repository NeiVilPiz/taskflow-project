# Sistema Universitario

Este documento describe las decisiones de diseño tomadas en el modelado de datos del sistema, así como el uso de TypeScript para garantizar seguridad, escalabilidad y mantenibilidad.

---

## Entidades principales

Se han definido dos entidades base:

### Estudiante

```ts
interface Estudiante {
  readonly id: string;
  nombre: string;
  edad: number;
  matricula: EstadoMatricula;
}