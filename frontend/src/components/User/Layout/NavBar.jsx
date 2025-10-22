import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Cart/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { AppContext } from "../../../context/AppContextHelper";

const NavBar = () => {
  const [draweropen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cartAmount, user } = useContext(AppContext);
  const toggleCartDrawer = () => {
    setDrawerOpen(!draweropen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left-Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Rabbit
          </Link>
        </div>
        {/* Center - navigation links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>
        {/* Right- Icons */}
        <div className="flex items-center  space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="text-white text-sm  rounded-lg px-2 background bg-black hover:bg-black/80"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className=" hover:text-black">
            {user ? (
              // absolute -top-1 -right-2
              <span
                className="bg-rabit-red text-white text-xs rounded-full 
             w-6 h-6 flex items-center justify-center font-semibold"
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <HiOutlineUser className="h-6 w-6" />
            )}
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartAmount > 0 && (
              <span
                className="absolute -top-1 bg-rabit-red text-white text-xs 
                rounded-full px-2 py-0.5"
              >
                {cartAmount}
              </span>
            )}
          </button>
          {/* Search icon */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button
            onClick={() => setNavDrawerOpen(!navDrawerOpen)}
            className="md:hidden"
          >
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>
      <CartDrawer draweropen={draweropen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile navigaion */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform
            duration-300 z-50 ${
              navDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
      >
        <div className="flex justify-end p-4 ">
          <button onClick={() => setNavDrawerOpen(!navDrawerOpen)}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4 ">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={() => setNavDrawerOpen(!navDrawerOpen)}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={() => setNavDrawerOpen(!navDrawerOpen)}
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={() => setNavDrawerOpen(!navDrawerOpen)}
              className="block text-gray-600 hover:text-black"
            >
              Top wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={() => setNavDrawerOpen(!navDrawerOpen)}
              className="block text-gray-600 hover:text-black"
            >
              Bottom wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;
