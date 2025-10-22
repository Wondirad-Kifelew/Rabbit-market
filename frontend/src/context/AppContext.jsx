import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

import { AppContext } from "./AppContextHelper";
import { useSearchParams } from "react-router-dom";
export const AppContextProvider = (props) => {
  //evthing

  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null); // for logged-in user
  const [guestId, setGuestId] = useState(null); // for guest
  const [cart, setCart] = useState({});
  const [cartAmount, setCartAmount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [haveFilter, setHaveFilter] = useState(false);

  const [loading, setLoading] = useState(true);
  // fetch cart using userId or guestId

  const fetchCart = async ({ user, guestId }) => {
    try {
      const params = user ? { userId: user._id } : { guestId };

      const res = await axiosInstance.get("/api/carts", { params });
      setCart({ ...res.data });
      setCartAmount(res.data.products.length);
    } catch (err) {
      console.log("Error fetching cart: ", err);
    }
  };
  useEffect(() => {
    const getUserOrGuest = async () => {
      try {
        // try to fetch user if logged in
        const res = await axiosInstance.get("/api/users/profile");
        if (res) {
          setUser(res.data);
          localStorage.setItem("userInfo", JSON.stringify(res.data));
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // not logged in so assign guest id
          let storedGuestId = localStorage.getItem("guestId"); //clear on logout
          if (!storedGuestId) {
            storedGuestId = `guest_id_${new Date().getTime()}`;
            localStorage.setItem("guestId", storedGuestId);
          }
          setGuestId(storedGuestId);
        }
      } finally {
        setLoading(false);
      }
    };

    getUserOrGuest();
  }, []);

  // Fetch cart once user or guestId is known
  useEffect(() => {
    if (user || guestId) {
      fetchCart({ user, guestId });
    }
  }, [user, guestId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(`/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const queryString = searchParams.toString();

        const res = await axiosInstance.get(`/api/products?${queryString}`);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching filtered products:", err);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);
  // check if there is any filter on the products and flag if any
  useEffect(() => {
    if (products && filteredProducts) {
      setHaveFilter(products.length !== filteredProducts.length);
    }
  }, [products, filteredProducts]);

  console.log("cart in context file: ", cart);
  // console.log("products in context file: ", filteredProducts);
  // console.log("user: ", user, "guestId: ", guestId, cart, setCart);

  const value = {
    user,
    guestId,
    setGuestId,
    setUser,
    loading,
    cart,
    setCart,
    cartAmount,
    setCartAmount,
    filteredProducts,
    haveFilter,
    setHaveFilter,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
