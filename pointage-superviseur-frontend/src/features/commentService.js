import axios from "axios";

import { DEV_URL } from "../constants";

// Create a comment
const createComment = async (userData, token) => {
    const config = {
      headers: {
        Authorization: `Kamtar ${token}`,
      },
    };
    const response = await axios.post(`${DEV_URL}comments`, userData, config);
    return response.data;
};


// Get comment by id
const getCommentById = async (id, token) => {
    const config = {
      headers: {
        Authorization: `Kamtar ${token}`,
      },
    };
  
    const response = await axios.get(`${DEV_URL}comments/${id}`, config);
    return response.data;
};
  

// Get comment by mission
const getCommentsByMission = async (id, token) => {
    const config = {
      headers: {
        Authorization: `Kamtar ${token}`,
      },
    };
  
    const response = await axios.get(`${DEV_URL}comments/mission/${id}`, config);
    return response.data;
};
  

// Respond to a comment
const respondToComment = async (data, token) => {
    const config = {
      headers: {
        Authorization: `Kamtar ${token}`,
      },
    };
  
    const response = await axios.put(`${DEV_URL}comments/${data.id}`, data, config);
    return response.data;
};
  
// Delete comment
const deleteComment = async (id, token) => {
    const config = {
      headers: {
        Authorization: `Kamtar ${token}`,
      },
    };
  
    const response = await axios.put(`${DEV_URL}comments/${id}`, config);
    return response.data;
};
  
const commentService = {
    deleteComment,
    getCommentById,
    getCommentsByMission,
    createComment,
    respondToComment,
}

export default commentService;


  
