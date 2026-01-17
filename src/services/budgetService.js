import { BASE_URL } from "../utils/constants";
export async function getBudgets({ userId, startDate, endDate }) {
  const response = await fetch(
    `${BASE_URL}/budget/data?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) throw new Error("Error al obtener presupuestos");
  return response.json();
}

export async function getBudgetById(id) {
  const response = await fetch(`${BASE_URL}budget/${id}/`);
  if (!response.ok) throw new Error("Error al obtener el presupuesto");
  return response.json();
}

export async function createBudget(data) {
  const response = await fetch(`${BASE_URL}/budget/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear el presupuesto");
  return response.json();
}

export async function updateBudget(id, data) {
  const response = await fetch(`${BASE_URL}/budget/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar el presupuesto");
  return response.json();
}

export async function deleteBudget(id) {
  const response = await fetch(`${BASE_URL}/budget/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el presupuesto");
  return true;
}
