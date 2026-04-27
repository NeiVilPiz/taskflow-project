# Data Model – University Management System

> Diseño tipado y escalable del modelo de datos utilizando TypeScript

---

## Overview

Este módulo define la estructura central del sistema mediante **tipado estático fuerte**, permitiendo construir una base sólida, segura y mantenible.

El objetivo principal es:

* Garantizar la **integridad de los datos**
* Reducir errores en tiempo de desarrollo
* Facilitar la **escalabilidad del sistema**

---

## Domain Entities

### Estudiante

```ts
interface Estudiante {
  readonly id: string;
  nombre: string;
  edad: number;
  matricula: EstadoMatricula;
}
```

### Asignatura

```ts
interface Asignatura {
  readonly id: string;
  nombre: string;
  creditos: number;
}
```

### Design Decisions

* `readonly id` → asegura **inmutabilidad** y evita inconsistencias
*  Uso de `interface` → pensado para **modelado de dominio y extensibilidad futura**
*  Representan contratos claros entre capas del sistema

---

## Enrollment State (Discriminated Union)

```ts
type EstadoMatricula =
  | MatriculaActiva
  | MatriculaSuspendida
  | MatriculaFinalizada;
```

### Estados disponibles

| Estado        | Descripción                      |
| ------------- | -------------------------------- |
|    ACTIVA     | Contiene un array de asignaturas |
|    SUSPENDIDA | Incluye un motivo de suspensión  |
|    FINALIZADA | Incluye la nota media            |

### Why this approach?

El uso de una **unión discriminada** permite:

* ✔ *Type narrowing* automático en estructuras `switch`
* ✔ Acceso seguro a propiedades según el estado
* ✔ Eliminación de errores en runtime

---

## Smart Type Safety Example

```ts
switch (estado.tipo) {
  case "ACTIVA":
    return estado.asignaturas.length;

  case "SUSPENDIDA":
    return estado.motivo;

  case "FINALIZADA":
    return estado.notaMedia;
}
```

> TypeScript garantiza que cada caso accede únicamente a propiedades válidas.

---

##  Interface vs Type

| Uso         | Motivo                                                     |
| ----------- | ---------------------------------------------------------- |
| `interface` | Modelado de entidades → extensibles y orientadas a objetos |
| `type`      | Uniones y composición → mayor flexibilidad estructural     |

  Esta combinación permite un diseño **limpio y escalable**

---

## Generic API Layer

```ts
interface RespuestaAPI<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### Why Generics?

El uso de `<T>` permite desacoplar la estructura de la respuesta de su contenido:

```ts
RespuestaAPI<Estudiante[]>
RespuestaAPI<Asignatura[]>
```

### Beneficios

* Reutilización total del código
* Tipado dinámico pero seguro
* Mejor autocompletado y DX (Developer Experience)

---

## Architectural Impact

Este enfoque permite:

* Separación clara de responsabilidades
* Tipado consistente entre frontend y backend
* Preparación para integración con APIs reales

---

## Future Improvements

* Validación en runtime (Zod / Joi)
* Generación automática de tipos (OpenAPI / Swagger)
* Persistencia en base de datos real

---

## Conclusion

El modelo implementado proporciona:

* Seguridad de tipos
* Escalabilidad
* Modularidad
* Mejor experiencia de desarrollo

> Este diseño sienta las bases para aplicaciones robustas y mantenibles en entornos reales.