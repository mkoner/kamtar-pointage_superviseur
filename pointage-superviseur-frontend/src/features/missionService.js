import axios from "axios";

import { DEV_URL } from "../constants";

//create mission
const createMission = async (missionData, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.post(`${DEV_URL}missions`, missionData, config);
  return response.data;
};

const getMissions = async (filters, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}missions`, filters, config);
  return response.data;
};

const getMissionById = async (id, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}missions/${id}`, config);
  return response.data;
};

const updateMission = async (id, mission, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(`${DEV_URL}missions/${id}`, mission, config);
  return response.data;
};

const deleteMission = async (id, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.get(`${DEV_URL}missions/${id}`, config);
  return response.data;
};

const validateDate = async (id, reqBody, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(`${DEV_URL}missions/validate/${id}`, reqBody, config);
  return response.data;
};

const finMission = async (id, reqBody, token) => {
  const config = {
    Headers: {
      Authorization: `Kamtar ${token}`,
    },
  };

  const response = await axios.put(`${DEV_URL}missions/fin/${id}`, reqBody, config);
  return response.data;
};

const MissionService = {
  createMission,
  getMissions,
  getMissionById,
  updateMission,
  deleteMission,
  validateDate,
  finMission,
};

export default MissionService;
