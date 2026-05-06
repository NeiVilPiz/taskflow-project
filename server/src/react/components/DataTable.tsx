import { useState } from "react";
import { Column } from "../types";

type Props<T> = {
  data: T[];
  columns: Column<T>[];
};

export function DataTable<T extends { id: string }>({ data, columns }: Props<T>) {
  const [editingRow, setEditingRow] = useState<Partial<T> | null>(null);

  function startEdit(row: T) {
    setEditingRow({ ...row });
  }

  function cancelEdit() {
    setEditingRow(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {String(row[col.key])}
                </td>
              ))}

              <td>
                <button onClick={() => startEdit(row)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRow && (
        <div style={{ marginTop: 20 }}>
          <h3>Editando fila</h3>

          <pre>{JSON.stringify(editingRow, null, 2)}</pre>

          <button onClick={cancelEdit}>Cancelar</button>
        </div>
      )}
    </div>
  );
}