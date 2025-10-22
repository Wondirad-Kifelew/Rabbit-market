import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import axiosInstance from "../axiosInstance";
import BestSellerProduct from "../components/Products/BestSellerProduct";

// const placeholderProducts = [
//   {
//     _id: 1,
//     name: "Prduct 1",
//     price: 100,
//     images: [{ url: "http://picsum.photos/500/500?random=1" }],
//   },
//   {
//     _id: 2,
//     name: "Prduct 2",
//     price: 140,
//     images: [{ url: "http://picsum.photos/500/500?random=2" }],
//   },
//   {
//     _id: 3,
//     name: "Prduct 3",
//     price: 1040,
//     images: [{ url: "http://picsum.photos/500/500?random=3" }],
//   },
//   {
//     _id: 4,
//     name: "Prduct 4",
//     price: 108,
//     images: [{ url: "http://picsum.photos/500/500?random=4" }],
//   },
//   {
//     _id: 5,
//     name: "Prduct 5",
//     price: 100,
//     images: [{ url: "http://picsum.photos/500/500?random=5" }],
//   },
//   {
//     _id: 6,
//     name: "Prduct 6",
//     price: 140,
//     images: [{ url: "http://picsum.photos/500/500?random=6" }],
//   },
//   {
//     _id: 7,
//     name: "Prduct 7",
//     price: 1040,
//     images: [{ url: "http://picsum.photos/500/500?random=7" }],
//   },
//   {
//     _id: 8,
//     name: "Prduct 8",
//     price: 108,
//     images: [{ url: "http://picsum.photos/500/500?random=8" }],
//   },
// ];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [femaleProducts, setFemaleProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/products");
        if (response) {
          setProducts(response.data);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    if (products.length > 0) {
      setFemaleProducts(products.filter((p) => p.gender === "Women"));
    }
  }, [products]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best sellers */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      <BestSellerProduct />
      {/* This should be best seller product */}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={femaleProducts} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
