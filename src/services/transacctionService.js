import { BASE_URL } from "../utils/constants";

// Obtener todas las transacciones
export const getTransactions = async ({ userId, startDate, endDate }) => {
  const response = await fetch(
    `${BASE_URL}/transaction?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) throw new Error("Error al obtener transacciones");
  return await response.json();
};

// Obtener una transacción por ID
export const getTransactionById = async (id) => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`);
  if (!response.ok) throw new Error("Error al obtener la transacción");
  return await response.json();
};

// Crear una nueva transacción
export const createTransaction = async (transactionData) => {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) throw new Error("Error al crear la transacción");
  return await response.json();
};

// Actualizar una transacción existente
export const updateTransaction = async (id, transactionData) => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) throw new Error("Error al actualizar la transacción");
  return await response.json();
};

// Eliminar una transacción
export const deleteTransaction = async (id) => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la transacción");
  return await response.json();
};
