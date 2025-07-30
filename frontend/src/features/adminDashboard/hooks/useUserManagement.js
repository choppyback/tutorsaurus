import { useState, useEffect } from "react";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userManagementAPI";

export const useUserManagement = (navigate) => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const getUsers = async () => {
    try {
      const res = await fetchAllUsers(token);
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 403) navigate("/");
    }
  };

  const create = async (data) => {
    await createUser(token, data);
    await getUsers();
  };

  const update = async (userId, data) => {
    await updateUser(token, userId, data);
    await getUsers();
  };

  const remove = async (userId) => {
    await deleteUser(token, userId);
    setUsers((prev) => prev.filter((u) => u.user_id !== userId));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return { users, create, update, remove };
};
