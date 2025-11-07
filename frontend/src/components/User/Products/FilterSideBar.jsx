import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../../context/AppContextHelper";

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    categoryKey: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });
  const { haveFilter, setHaveFilter } = useContext(AppContext);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const categories = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Black", "Green"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["cotton", "wool", "denim", "silk", "linen"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Fashionista"];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);
  // lets set query string global and filter products in the context file
  // that we could use the filtered products any where

  //   to handle filter change
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };
    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // accepts the filters object and add it to the url
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    // {category:"top wear", size:["XS", "L"]}
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(",")); // XS,L
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`); //?category=Bottom plus wear&size=XS%2CL
  };
  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);

    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(filters);
    updateURLParams(newFilters);
  };
  const handleClearFilter = () => {
    setFilters({
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 100,
    });
    setPriceRange([0, 100]);
    setHaveFilter(false);

    const params = new URLSearchParams();
    setSearchParams(params); // clears all query params
  };
  return (
    <div className="p-4">
      <div className="flex flex-row mb-4 font-medium text-gray-800 justify-between">
        <h3 className="text-xl  ">Filter</h3>
        {haveFilter && (
          <button
            onClick={handleClearFilter}
            className="bg-gray-300 px-2 py-1 rounded-lg text-lg"
          >
            clear
          </button>
        )}
      </div>
      {/* category filter */}
      <div className="mb-6 ">
        <label className="block text-gray-600 font-medium mb-2">
          {" "}
          Category
        </label>
        {Array.isArray(categories) &&
          categories?.map((category, index) => (
            <div key={index} className="flex item-center mb-1">
              <input
                type="radio"
                name="category"
                value={category}
                onChange={handleFilterChange}
                checked={filters.category === category}
                className="mr-2 h-4 w-4 text-blue-500
            focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{category}</span>
            </div>
          ))}
      </div>
      {/* gender filter */}
      <div className="mb-6 ">
        <label className="block text-gray-600 font-medium mb-2"> Gender</label>
        {Array.isArray(genders) &&
          genders?.map((gender, index) => (
            <div key={index} className="flex item-center mb-1">
              <input
                type="radio"
                name="gender"
                value={gender}
                onChange={handleFilterChange}
                checked={filters.gender === gender}
                className="mr-2 h-4 w-4 text-blue-500
            focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{gender}</span>
            </div>
          ))}
      </div>
      {/* Color filter */}
      <div className="mb-6 ">
        <label className="block text-gray-600 font-medium mb-2 ">Color</label>
        <div className="flex flex-wrap gap-2 ">
          {Array.isArray(colors) &&
            colors?.map((color, index) => (
              <button
                key={index}
                name="color"
                value={color}
                onClick={handleFilterChange}
                className={`w-8 h-8 rounded-full border border-gray-300
                cursor-pointer transition hover:scale-105 ${
                  filters.color === color ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color.toLocaleLowerCase() }}
              >
                {" "}
              </button>
            ))}
        </div>
      </div>
      {/* Size Filter*/}
      <div className="mb-6 ">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {Array.isArray(sizes) &&
          sizes?.map((size, index) => (
            <div key={index} className="flex item-center mb-1">
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleFilterChange}
                checked={filters.size.includes(size)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{size}</span>
            </div>
          ))}
      </div>
      {/* Material Filter*/}
      <div className="mb-6 ">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {Array.isArray(materials) &&
          materials?.map((material, index) => (
            <div key={index} className="flex item-center mb-1">
              <input
                type="checkbox"
                name="material"
                value={material}
                onChange={handleFilterChange}
                checked={filters.material.includes(material)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{material}</span>
            </div>
          ))}
      </div>
      {/* Brands Filter*/}
      <div className="mb-6 ">
        <label className="block text-gray-600 font-medium mb-2">Brands</label>
        {Array.isArray(brands) &&
          brands?.map((brand, index) => (
            <div key={index} className="flex item-center mb-1">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                onChange={handleFilterChange}
                checked={filters.brand.includes(brand)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="text-gray-700">{brand}</span>
            </div>
          ))}
      </div>
      {/* Price rannge filter */}
      <div className="mb-8">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cusror-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2 ">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
