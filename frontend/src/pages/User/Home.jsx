import React, { useEffect, useState } from "react";
import Hero from "../../components/User/Layout/Hero";
import GenderCollectionSection from "../../components/User/Products/GenderCollectionSection";
import NewArrivals from "../../components/User/Products/NewArrivals";
import ProductGrid from "../../components/User/Products/ProductGrid";
import FeaturedCollection from "../../components/User/Products/FeaturedCollection";
import FeaturesSection from "../../components/User/Products/FeaturesSection";
import axiosInstance from "../../utils/axiosInstance";
import BestSellerProduct from "../../components/User/Products/BestSellerProduct";

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
