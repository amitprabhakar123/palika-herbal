import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const signup = (data) => API.post("/auth/signup", data);

export const login = (data) => API.post("/auth/login", data);

export const addToCart = (data) => API.post("/cart/add", data);

export const getCart = (userId) => API.get(`/cart/${userId}`);

export const updateCart = (data) => API.put("/cart/update", data);

export const removeFromCart = (data) => API.delete("/cart/remove", {
  data,
});

export default API;