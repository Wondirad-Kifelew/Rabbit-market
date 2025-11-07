import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/products");
        if (response) {
          setProducts(response.data);
        }
      } catch (error) {
        console.log("Error fetching products: ", error);
      }
    };
    fetchProducts();
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      try {
        const response = await axiosInstance.delete(`/api/products/${id}`);
        if (response) {
          setProducts((prev) => prev.filter((product) => product._id !== id));
        }
      } catch (error) {
        console.log("Error deleting products: ", error);
      }
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 ">Product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="min-w-full text-left text-gray-500 ">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4 ">Name</th>
              <th className="py-3 px-4 ">Price</th>
              <th className="py-3 px-4 "> Sku</th>
              <th className="py-3 px-4 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              Array.isArray(products) &&
              products.map((product, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4 ">${product.price}</td>
                  <td className="p-4 ">{product.sku}</td>
                  <td className="p-4 ">
                    <Link
                      to={`/admin/products/${product._id}/edit `}
                      className=" bg-yellow-500 text-white  px-2 py-1 rounded mr-2 hover:bg-yellow
                    "
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hoever:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center">
                  No Products Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
