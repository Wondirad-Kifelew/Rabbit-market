import React, { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "./CartContents";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContextHelper";

const CartDrawer = ({ draweropen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, cart } = useContext(AppContext);
  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };
  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/2
    h-full bg-white shadow-lg transform transition-transform duration-300
    flex flex-col z-50 ${draweropen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* close button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/* cart content with scrollable area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">your cart</h2>
        {/* components for the cart contents */}

        {/* consider adding cart from context not as props */}

        {cart && cart.products?.length > 0 ? (
          <CartContents />
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {/* checkout button */}
      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg 
        font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, taxes, and discount calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
