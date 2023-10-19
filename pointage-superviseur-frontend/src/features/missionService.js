import axios from "axios";

import { DEV_URL } from "../constants";

//create mission
const createMission = async (missionData, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.post(`${DEV_URL}missions`, missionData, config);
  return response.data;
};

const getAllMissions = async (token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}missions`, config);
  return response.data;
};

const getAllMissionsByMonth = async (month, year,token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}missions/all/${month}/${year}`, config);
  return response.data;
};


// Get missions by Sup
const getMissionsBySup = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };
  const response = await axios.get(`${DEV_URL}missions/superviseur/${id}`, config);
  return response.data;
};

// Get missions by Sup
const getMissionsBySupAndMonth = async (id, month, year, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };
  const response = await axios.get(`${DEV_URL}missions/superviseur/${id}/${month}/${year}`, config);
  return response.data;
};

const getMissionById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}missions/${id}`, config);
  return response.data[0];
};

const updateMission = async (id, mission, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(`${DEV_URL}missions/${id}`, mission, config);
  return response.data;
};

const deleteMission = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.delete(`${DEV_URL}missions/${id}`, config);
  return response.data;
};

const validateDate = async (id, reqBody, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(`${DEV_URL}missions/validate/${id}`, reqBody, config);
  return response.data;
};

const finMission = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Kamtar ${token}`,
    },
  };
  const response = await axios.put(`${DEV_URL}missions/fin/${id}`, null, config);
  return response.data;
};

const MissionService = {
  createMission,
  getAllMissions,
  getAllMissionsByMonth,
  getMissionsBySup,
  getMissionsBySupAndMonth,
  getMissionById,
  updateMission,
  deleteMission,
  validateDate,
  finMission,
};

export default MissionService;
