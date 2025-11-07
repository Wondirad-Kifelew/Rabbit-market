import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/api/orders/${id}`);
        if (response) {
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.log("Error fetching order details: ", error);
      }
    };
    fetchOrders();
  }, [id]);
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 ">Order Details</h2>
      {!orderDetails ? (
        <p>No Order Details Found</p>
      ) : (
        <div className="p-4 sm:p-6 roundede-lg border">
          {/* orderInfo */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end  mt-4 sm:mt-0 ">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "text-green-700 bg-green-100 "
                    : "text-red-700 bg-red-100 "
                }px-3 py-1 rounded-full text-sm font-medium mb-2 `}
              >
                {orderDetails.isPaid ? "Approved" : "Pending"}
              </span>
              <span
                className={`${
                  orderDetails.isDelivered
                    ? "text-green-700 bg-green-100 "
                    : "text-yellow-700 bg-yellow-100 "
                }px-3 py-1 rounded-full text-sm font-medium mb-2 `}
              >
                {orderDetails.isDelivered ? "Approved" : "Pending Delivery"}
              </span>
            </div>
          </div>
          {/* Customer, Payment and Shipping info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
            </div>
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p>Shipping Method: {orderDetails.shipplingMethod}</p>
              <p>
                Address: {orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.country}
              </p>
            </div>
          </div>
          {/* Product list */}
          <div className="overflow-x-auto ">
            <h4 className="text-lg font-semibold mb-4 ">Products</h4>
            <table className="min-w-full text-gray-600 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 ">Name</th>
                  <th className="py-2 px-4 ">Unit Price</th>
                  <th className="py-2 px-4 ">Quantity</th>
                  <th className="py-2 px-4 ">Total</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(orderDetails.orderItems) &&
                  orderDetails.orderItems?.map((item, index) => (
                    <tr key={index} className=" border-b ">
                      <td className="py-2 px-4 flex item-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-blue-500 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4 text-center">${item.price}</td>
                      <td className="py-2 px-4 text-center">{item.quantity}</td>
                      <td className="py-2 px-4 text-center">
                        ${item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Bacl to orders link */}
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            Back to My Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
