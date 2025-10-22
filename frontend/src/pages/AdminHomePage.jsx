import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../axiosInstance";

const AdminHomePage = () => {
  const [orders, setOrders] = useState([]);

  const [dashboardInfo, setDashboardInfo] = useState({
    revenue: 0,
    totalOrders: 0,
    products: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/api/orders/my-orders`);
        if (response) {
          setOrders(response.data);
        }
      } catch (error) {
        console.log("Error fetching orders: ", error);
      }
    };
    const calculateDashboardInfo = () => {
      if (orders) {
        let totRevenue = 0;
        let totProducts = 0;
        orders.forEach((order) => {
          totRevenue += order.totalPrice;
          totProducts += order.orderItems.length;
        });
        setDashboardInfo({
          revenue: totRevenue,
          totalOrders: orders.length,
          products: totProducts,
        });
      }
    };
    fetchOrders();
    calculateDashboardInfo();
  }, [orders]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 ">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 shadow-md rounded-lg ">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl ">${dashboardInfo.revenue}</p>
        </div>
        <div className="p-4 shadow-md rounded-lg ">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl ">{dashboardInfo.totalOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">
            {" "}
            Manage Orders
          </Link>
        </div>
        <div className="p-4 shadow-md rounded-lg ">
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-2xl ">{dashboardInfo.products}</p>
          <Link to="/admin/products" className="text-blue-500 hover:underline">
            {" "}
            Manage Products
          </Link>
        </div>
      </div>
      <div className="mt-6 ">
        <h2 className="text-2xl font-bold mb-4 ">Recent Orders</h2>
        <div className="overflow-x-auto shadow-md">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    {/* handle use name on register */}
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">{order.totalPrice}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No Recent Orders Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
