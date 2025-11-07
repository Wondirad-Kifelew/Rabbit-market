import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import axiosInstance from "../../../utils/axiosInstance";
import { AppContext } from "../../../context/AppContextHelper";

const BestSellerProduct = () => {
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  const { guestId, user, setCartAmount, setCart } = useContext(AppContext);

  useEffect(() => {
    const bestSellerProdFetch = async () => {
      try {
        const response = await axiosInstance.get("/api/products/best-seller");
        if (response) {
          setBestSellerProduct(response.data[0]);

          // set the main image
          const product = response.data[0];
          if (product?.images?.length > 0) {
            setMainImage(product.images[0].url);
          }
          // similar products according to best seller
          try {
            if (product) {
              ``;
              const res_similar = await axiosInstance.get(
                `/api/products/similar/${product._id}`
              );
              if (res_similar) {
                setSimilarProducts(res_similar.data);
              }
            }
          } catch (error) {
            console.log("Error finding similar products: ", error);
          }
        }
      } catch (error) {
        console.log("Error finding best seller: ", error);
      }
    };
    bestSellerProdFetch();
  }, []);
  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };
  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }
    setIsButtonDisabled(true);

    try {
      const response = await axiosInstance.post("/api/carts", {
        productId: bestSellerProduct?._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      });
      setCart(response.data);
      toast.success("Product added to cart");
      setCartAmount(response.data.products.length);
    } catch (error) {
      console.log("Error adding to cart: ", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded">
        <div className="flex flex-col md:flex-row ">
          {/* left thumbnails desktop*/}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {bestSellerProduct ? (
              (bestSellerProduct.images || []).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText}
                  onClick={() => setMainImage(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                />
              ))
            ) : (
              <div>No products found.</div>
            )}
          </div>
          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="mb-4 ">
              <img
                src={mainImage ? mainImage : null}
                alt="Main Product"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
          {/* mobile Thumbnail */}
          <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
            {bestSellerProduct &&
              (bestSellerProduct.images || []).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  onClick={() => setMainImage(image.url)}
                  alt={image.altText}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                />
              ))}
          </div>
          {/* Right section */}
          <div className="md:w-1/2 md:ml-10 ">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              {bestSellerProduct && bestSellerProduct.name}
            </h1>
            <p className="text-lg text-gray-600 mb-1 line-through">
              {bestSellerProduct &&
                bestSellerProduct.originalPrice &&
                `$${bestSellerProduct && bestSellerProduct.originalPrice}`}
            </p>
            <p className="text-xl text-gray-900 mb-2">
              ${bestSellerProduct && bestSellerProduct.price}
            </p>
            <p className="text-gray-600 mb-4">
              {bestSellerProduct && bestSellerProduct.description}
            </p>
            <div className="mb-4 ">
              <p className="text-gray-700 ">Color: </p>
              <div className="flex gap-2 mt-2">
                {bestSellerProduct &&
                  (bestSellerProduct.colors || []).map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color
                          ? "border-4 border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLocaleLowerCase(),
                        filter: "brightness(0.5)",
                      }}
                    ></button>
                  ))}
              </div>
            </div>
            <div className="mb-4 ">
              <p className="text-gray-700">Size: </p>
              <div className="flex gap-2 mt-2">
                {bestSellerProduct &&
                  (bestSellerProduct.sizes || []).map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
              </div>
            </div>
            <div className="mb-6 ">
              <p className="text-gray-700">Quantity: </p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="bg-gray-200 px-2 py-1 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="bg-gray-200 px-2 py-1 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 
                ${
                  isButtonDisabled ? "cursor-not-allowed" : "hover:bg-gray-900"
                }`}
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>
          </div>
        </div>
        <div className="mt-20 ">
          <h2 className="text-2xl text-center font-medium mb-4 ">
            You May Also Like
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default BestSellerProduct;
