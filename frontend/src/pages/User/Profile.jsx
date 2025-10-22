import { useContext, useEffect } from "react";
import MyOrdersPage from "./MyOrdersPage";
import { AppContext } from "../../context/AppContextHelper";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Profile = () => {
  const { user, setUser, loading } = useContext(AppContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/users/logout");
      console.log("response for logout: ", response);
      setUser(null);
      localStorage.removeItem("userInfo");
      navigate("/");
    } catch (error) {
      console.log("Error Logging out: ", error);
    }
  };
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=profile");
    }
  }, [loading, user, navigate]);
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* left */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 ">
              {user?.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4 ">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          {/* right */}
          <div className="w-full md:w-2/3 lg:w-3/4 ">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
