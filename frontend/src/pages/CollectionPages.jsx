import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSideBar from "../components/Products/FilterSideBar";
import SortOption from "../components/Products/SortOption";
import ProductGrid from "../components/Products/ProductGrid";
import { useContext } from "react";
import { AppContext } from "../context/AppContextHelper";

const CollectionPages = () => {
  const [products, setProducts] = useState([]);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const { filteredProducts } = useContext(AppContext);
  const sideBarRef = useRef(null); //useref?

  const toggleSideBarMenu = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  const handleClickOutside = (e) => {
    // close sidebar if its clicked outside
    if (sideBarRef.current && !sideBarRef.current.contains(e.target)) {
      setIsSideBarOpen(false);
    }
  };
  useEffect(() => {
    // Add event listner for clicks
    document.addEventListener("mousedown", handleClickOutside);
    // clean the event listner
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setProducts(filteredProducts);
  }, [filteredProducts]);
  return (
    <div className="flex flex-col lg:flex-row">
      {/* mobile filter button */}
      <button
        onClick={toggleSideBarMenu}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2 " />
      </button>
      {/* Filter side bar */}
      <div
        ref={sideBarRef}
        className={`${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64
         bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSideBar />
      </div>
      <div className="flex-grow  p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* sort option */}
        <SortOption />
        {/* Product grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div>Sorry! No products with the specified filter</div>
        )}
      </div>
    </div>
  );
};

export default CollectionPages;
