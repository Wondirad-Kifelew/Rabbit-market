import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/User/Layout/UserLayout";
import Home from "./pages/User/Home";
import { Toaster } from "sonner";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import Profile from "./pages/User/Profile";
import CollectionPages from "./pages/User/CollectionPages";
import ProductDetails from "./pages/User/ProductDetails";
import CheckOut from "./pages/User/CheckOut";
import OrderConformationPage from "./pages/User/OrderConformationPage";
import OrderDetailsPage from "./pages/User/OrderDetailsPage";
import MyOrdersPage from "./pages/User/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import UserManagement from "./pages/Admin/UserManagement";
import ProductManagement from "./pages/Admin/ProductManagement";
import EditProductPage from "./pages/Admin/EditProductPage";
import OrderManagement from "./pages/Admin/OrderManagement";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {/* User layout */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPages />} />
          {/* this should be product details */}
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route
            path="order-confirmation/:orderId"
            element={<OrderConformationPage />}
          />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin layout */}
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
