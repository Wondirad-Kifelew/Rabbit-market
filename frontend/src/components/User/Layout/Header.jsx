import React from "react";
import Topbar from "./Topbar";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <div className="border-b border-gray-200">
      {/* Top bar */}
      <Topbar />
      {/* Nav bar */}
      <NavBar />
      {/* Cart Drawer */}
    </div>
  );
};

export default Header;
