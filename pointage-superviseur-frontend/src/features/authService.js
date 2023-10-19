import axios from "axios";
import jwt_decode from "jwt-decode";

import { DEV_URL } from "../constants";

const user = JSON.parse(localStorage.getItem("user"));


// Register user
const createUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };
  const response = await axios.post(`${DEV_URL}users`, userData, config);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${DEV_URL}users/login`, userData);

 const token= response.headers.token
  var decoded = jwt_decode(token);
  
  const user = await axios.get(`${DEV_URL}users/byid1/${decoded.id}`,);
  
  const user1 = user.data;
  user1.token= token

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(user1));
  }

  return user1;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// Get users by role
const getUsersByRole = async (role, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  if (role == "Superviseur") {
    const response = await axios.get(`${DEV_URL}users/superviseurs`, config);
    return response.data;
  }

  if (role == "Manager") {
    const response = await axios.get(`${DEV_URL}users/managers`, config);
    return response.data;
  }

  if (role == "Admin") {
    const response = await axios.get(`${DEV_URL}users/admins`, config);
    return response.data;
  }
  

};

// Get all users
const getAllUsers = async (token) => {
  const config = { 
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}users/all-users`, config);
  return response.data;
};

// Get user by id
const getUserById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}users/user/${id}`, config);
  return response.data;
};

// Get user by id1
const getUserById1 = async (id) => {

  const response = await axios.get(`${DEV_URL}users/byid1/${id}`);
  return response.data;
};

// Update user
const updateUser = async (id, user, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(`${DEV_URL}users/user/${id}`, user, config);
  return response.data;
};

// Update user password
const updateUserPassword = async (id, password, token) => {
  const config = {
    headers: {
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
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.delete(`${DEV_URL}users/user/${id}`, config);
  return response.data;
};

const authService = {
  createUser,
  logout,
  login,
  getUsersByRole,
  getAllUsers,
  getUserById,
  getUserById1,
  updateUser,
  updateUserPassword,
  deleteUser,
};

export default authService;
