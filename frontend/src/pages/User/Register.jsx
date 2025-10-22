import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../../assets/register.webp";
import axiosInstance from "../../utils/axiosInstance";
import { AppContext } from "../../context/AppContextHelper";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser, guestId, cart, user } = useContext(AppContext);

  // Get redirect parameter and check if its redirect or sth else
  const redirect = new URLSearchParams(location.search).get("redirect") || "";
  const isCheckOutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user && cart?.products?.length > 0 && guestId) {
      // merge guest products with user products
      const mergeCart = async () => {
        try {
          const res = await axiosInstance.post("/api/carts/merge", {
            guestId,
          });
          console.log(res.data);
          navigate(isCheckOutRedirect ? "/checkout" : "/");
        } catch (error) {
          console.log("Error merging carts: ", error);
        }
      };
      mergeCart();
    }
  }, [user, guestId, cart, navigate, isCheckOutRedirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/users/register", {
        name,
        email,
        password,
      });
      if (response) {
        setUser(response.data.user);

        setName("");
        setEmail("");
        setPassword("");
        setLoading(false);
        navigate(`/${redirect}`);
      }
    } catch (error) {
      console.log("Error registering: ", error);
      setLoading(false);
    }
  };
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 
      rounded-lg border shadow-sm "
        >
          <div className="flex justify-center mb-6 ">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there!👋</h2>
          <p className="text-center mb-6 ">
            Enter your username and password to Register
          </p>
          <div className="mb-4 ">
            <label className="block text-sm font-semibold mb-2 ">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4 ">
            <label className="block text-sm font-semibold mb-2 ">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email adress"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 ">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold 
            hover:bg-gray-800 transition mb-4"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <div
            className="w-full flex justify-center items-center text-white p-2 rounded-lg bg-rabit-red hover:bg-rabit-red/80
  font-semibold transition group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <button className="">Explore Without Signing up</button>
            <div className=" px-2 py-1 rounded transition-transform duration-300 group-hover:translate-x-2">
              -&gt;
            </div>
          </div>
          <p className="mt-6 text-center text-sm ">
            Do you already have an account?{" "}
            <Link to="/Login" className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Register image"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
