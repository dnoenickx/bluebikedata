import { LatLngExpression } from "leaflet";
import { API_URL } from "../constants/api";

export const saveShape = async (
  shape: { id: string; loc: LatLngExpression }[],
  id: string
) => {
  const body = { id: id, shape: shape };
  const response = await fetch(`${API_URL}/api/saveshape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to save shape.");
  }
  return id;
};

export const getShape = async (id: string) => {
  const url = new URL(`${API_URL}/api/getshape`, window.location.origin);
  url.searchParams.append("id", id);
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch shape");
  return await response.json();
};