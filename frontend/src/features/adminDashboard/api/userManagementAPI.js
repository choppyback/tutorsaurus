import axios from "axios";
import serverBaseURL from "../../../config/api";

export const fetchAllUsers = async (token) => {
  return axios.get(`${serverBaseURL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createUser = async (token, data) => {
  return axios.post(`${serverBaseURL}/api/admin/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUser = async (token, userId, data) => {
  return axios.put(`${serverBaseURL}/api/admin/users/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteUser = async (token, userId) => {
  return axios.delete(`${serverBaseURL}/api/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
