import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "./PaypalButton";
import { AppContext } from "../../context/AppContextHelper";
import axiosInstance from "../../axiosInstance";

const CheckOut = () => {
  const navigate = useNavigate();
  const { cart, user } = useContext(AppContext);
  console.log("cart in checkout: ", cart);
  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/checkout", {
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "PayPal",
        totalPrice: cart.totalPrice,
      });
      console.log("checkout id: ", response.data._id);
      setCheckoutId(response.data._id);
    } catch (error) {
      console.log("Error updating checkout: ", error);
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      const res = await axiosInstance.put(`/api/checkout/${checkoutId}/pay`, {
        paymentStatus: "paid",
        paymentDetails: details,
      });
      if (res) {
        handleFinalizeCheckout(checkoutId);
        //finalize checkout if payment is successful
      }
    } catch (error) {
      console.log("Error finalizing payment: ", error);
    }

    console.log("Payment Successful", details);
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axiosInstance.post(
        `/api/checkout/${checkoutId}/finalize`
      );
      if (response) {
        console.log("finalized payment res: ", response.data);
        navigate(`/order-confirmation/${response.data._id}`);
      }
    } catch (error) {
      console.log("Error finlizing payout: ", error);
    }
  };
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6
    tracking-tighter"
    >
      {/* Left section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6 ">Check Out</h2>
        <form onSubmit={handleCreateCheckout}>
          {" "}
          <h3 className="text-lg mb-4">Contact Details</h3>
          {/* Email */}
          <div className="mb-4 ">
            <label className="block text-gray-700">Email</label>
            <input
              className="w-full p-2 border rounded "
              type="email"
              disabled
              value={user ? user.email : ""}
            />
          </div>
          <h3 className="text-lg mb-4 ">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* first name */}
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2  border rounded "
                required
              />
            </div>
            {/* Last name */}
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2  border rounded "
                required
              />
            </div>
          </div>
          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* city */}
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2  border rounded "
                required
              />
            </div>
            {/* Postal code */}
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2  border rounded "
                required
              />
            </div>
          </div>
          {/* Country */}
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Phone number */}
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* checkout button */}
          <div className="mt-6 ">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3  rounded"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4 ">Pay With Paypal</h3>
                <PaypalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert("Payment failed.Try again.")}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right section */}
      <div className="bg-gray-50 p-6 rounded-lg ">
        <h3 className="text-lg mb-4 "> Order Summary</h3>

        <div className="border-t py-4 mb-4 ">
          {cart?.products?.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24  object-cover mr-4"
                />
                <div>
                  <h3 className="text-md ">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl ">${product.price * product.quantity}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p> Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
