import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const EditProductPage = () => {
  const { id } = useParams();

  const [uploading, setUploading] = useState(false); //image uploading state
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [
      {
        url: "https://picsum.photos/150?random=1",
      },
      {
        url: "https://picsum.photos/150?random=2",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const { data } = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));

      setUploading(false);
    } catch (error) {
      console.log("Error uploading image: ", error);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/api/products/${id}`,
        productData
      );

      if (response) {
        console.log("response edited: ", response.data);
      }
    } catch (error) {
      console.log("Error submitting edited product: ", error);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProductData(response.data);
      } catch (error) {
        console.log("Error fetching product: ", error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-6 shadow-md rounded-md ">
      <h2 className="text-3xl font-bold mb-6 ">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6 ">
          <label className="block font-semibold mb-2 ">Product Name </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 "
            required
          />
        </div>
        {/* Description */}
        <div className="mb-6 ">
          <label className="block font-semibold mb-2 ">Description </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border 
          border-gray-300 rounded-md p-2 "
            rows={4}
            required
          ></textarea>
        </div>
        {/* Price */}
        <div className="mb-6 ">
          <label className="block font-semibold mb-2 ">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Count in stock */}
        <div className="mb-6 ">
          <label className="block font-semibold mb-2 ">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* SKU */}
        <div className="mb-6 ">
          <label className="block font-semibold mb-2 ">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Sizes */}
        <div className="mb-6 ">
          <label className="block font-semibold mb-2 ">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Colors */}
        <div className="mb-6 ">
          <label className="block font-semibold mb-2 ">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Image upload */}

        <div className="mb-6">
          <label className="block font-semibold mb-2 "> </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="bg-gray-100 hover:bg-gray-300 rounded-lg cursor-pointer "
          />
          {uploading && (
            <p>
              <span className=" inline-block animate-spin">⏳</span>{" "}
              Uploading...
            </p>
          )}
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt="product images"
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
