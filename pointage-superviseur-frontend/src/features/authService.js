import axios from "axios";

import { DEV_URL } from "../constants";

// Register user
const createUser = async (userData) => {
  const response = await axios.post(`${DEV_URL}users`, userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${DEV_URL}users/login`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// Get users by role
const getUsersByRole = async (filters, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}users`, filters, config);
  return response.data;
};

// Get all users
const getAllUsers = async (token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}users/all-users`, config);
  return response.data;
};

// Get user by id
const getUserById = async (id, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}users/${id}`, config);
  return response.data;
};

// Update user
const updateUser = async (id, user, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(`${DEV_URL}users/${id}`, user, config);
  return response.data;
};

// Update user password
const updateUserPassword = async (id, password, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(
    `${DEV_URL}users/update-password/${id}`,
    password,
    config
  );
  return response.data;
};

// Delete User
const deleteUser = async (id, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.delete(`${DEV_URL}users/${id}`, config);
  return response.data;
};

const authService = {
  createUser,
  logout,
  login,
  getUsersByRole,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserPassword,
  deleteUser,
};

export default authService;
