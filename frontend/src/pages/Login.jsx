import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.webp";
import axiosInstance from "../axiosInstance";
import { AppContext } from "../context/AppContextHelper";

const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, user, cart, guestId } = useContext(AppContext);
  const navigate = useNavigate();

  // Get redirect parameter and check if its redirect or sth else
  const redirect = new URLSearchParams(location.search).get("redirect") || "";
  console.log("redirect: ", redirect);
  const isCheckOutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user && cart?.products?.length > 0 && guestId) {
      // merge guest products with user products
      const mergeCart = async () => {
        try {
          const res = await axiosInstance.post("/api/carts/merge", {
            guestId,
          });
          console.log(res.data); //maybe update cart
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
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      if (response) {
        setUser(response.data.user);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));

        setEmail("");
        setPassword("");
        setLoading(false);
        navigate(`/${redirect}`);
      }
    } catch (error) {
      console.log("error logging in: ", error);
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
            Enter your username and password to login
          </p>
          <div className="mb-4 ">
            <label className="block text-sm font-semibold mb-2 ">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div
            className="w-full flex justify-center items-center text-white p-2 rounded-lg bg-rabit-red hover:bg-rabit-red/80
  font-semibold transition group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <button className="">Explore Without Signing in</button>
            <div className=" px-2 py-1 rounded transition-transform duration-300 group-hover:translate-x-2">
              -&gt;
            </div>
          </div>

          <p className="mt-6 text-center text-sm ">
            Dont have an accout?{" "}
            <Link
              // whats the purpose? is there any other way of doing this
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              //i have no idea
              className="text-blue-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="login image"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
