import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // default role
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/admin/users", formData);
      if (response) {
        setUsers((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.log("Error creating user: ", error);
    }

    // reset form after submission
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer", // default role
    });
  };
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/api/admin/users/${userId}`, {
        role: newRole,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.log("Erorr updating role: ", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axiosInstance.delete(
          `/api/admin/users/${userId}`
        );
        if (response) {
          setUsers((prev) => prev.filter((user) => user._id !== userId));
        }
      } catch (error) {
        console.log("Error deleting user: ", error);
      }
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/users");
        if (response) {
          if (response) {
            setUsers(response.data);
          }
        }
      } catch (error) {
        console.log("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="max-w-7xl max-auto p-6 ">
      <h2 className="text-2xl font-bold mb-6 "> User Management</h2>
      {/* Add new user form */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4 ">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 ">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 ">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 ">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {" "}
            Add User
          </button>
        </form>
      </div>
      {/* user list management */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4 ">Name</th>
              <th className="py-3 px-4 ">Email</th>
              <th className="py-3 px-4 ">Role</th>
              <th className="py-3 px-4 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              Array.isArray(users) &&
              users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 ">
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="p-4 ">{user.email}</td>
                  <td className="p-4 ">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="p-2 border rounded "
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 ">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 italic bg-gray-50"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
