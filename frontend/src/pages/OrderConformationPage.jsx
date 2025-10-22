import React, { useContext } from "react";
import axiosInstance from "../axiosInstance";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../context/AppContextHelper";

const OrderConformationPage = () => {
  const { cart, setCart, setCartAmount } = useContext(AppContext);
  const { orderId } = useParams();
  // console.log("orderID: ", orderId);
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/api/orders/${orderId}`);
        if (response) {
          setOrder(response.data);
          // clear cart
          setCart({});
          setCartAmount(0);
        }
      } catch (error) {
        console.log("Error fetching order: ", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  console.log("cart after ordered: ", cart);
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // add 10 days as estimated date
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white ">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8 ">
        Thank You for Your Order!
      </h1>
      {order && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order Id and Date */}
            <div>
              <h2 className="text-xl font-semibold">OrderID: {order._id}</h2>
              <p className="text-gray-500">
                Order date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(order.createdAt)}
              </p>
              {/*delivery from payment date */}
            </div>
          </div>
          {/* Ordered Items */}
          <div className="pt-3 mb-20">
            {/* order items */}
            {order?.orderItems?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start mb-4"
              >
                <div className="flex items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mr-4 w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-md font-semibold">{item.name}</h4>
                    <p className="text-gray-500 text-sm">
                      Size: {item.size} | Color: {item.color}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-right ">
                  <h3 className="text-md">${item.price}</h3>
                  <p className="text-gray-500 text-sm ">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            {/* Payment and delivery info */}
            <div className="grid grid-cols-2 gap-8">
              {/* payment info */}
              <div>
                <h4 className="text-lg font-semibold mb-2 ">Payment</h4>
                <p className="text-gray-600">PayPal</p>
              </div>
              {/* delivery info */}
              <div>
                <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                <p className="text-gray-600">
                  {order?.shippingAddress?.address}
                </p>
                <p className="text-gray-600">
                  {" "}
                  {order?.shippingAddress?.city},{" "}
                  {order?.shippingAddress?.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConformationPage;
