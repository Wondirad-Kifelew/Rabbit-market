import { useContext } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { AppContext } from "../../../context/AppContextHelper";
import axiosInstance from "../../../utils/axiosInstance";

const CartContents = () => {
  const { cart, setCart, guestId, user, setCartAmount } =
    useContext(AppContext);

  const handleQuantityChange = (value, prodId, size, color) => {
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.map((p) => {
        if (p.productId === prodId && p.size === size && p.color === color) {
          const newQuantity =
            value === "plus" ? p.quantity + 1 : Math.max(1, p.quantity - 1);
          return { ...p, quantity: newQuantity };
        }
        return p;
      });

      return { ...prevCart, products: updatedProducts };
    });
  };

  const handleCartDelete = async ({
    productId,
    size,
    color,
    guestId,
    userId,
  }) => {
    try {
      const response = await axiosInstance.delete("/api/carts", {
        data: {
          productId,
          size,
          color,
          guestId,
          userId,
        },
      });
      if (response) {
        setCart({ ...response.data });
        setCartAmount(response.data.products?.length || 0);
      }
    } catch (error) {
      console.log("Error deleting cart: ", error);
    }
  };
  // useEffect(() => {
  //   if (loading) return;
  //   setCartProducts(cart.products);
  // }, [cart]);

  return (
    <div>
      {cart.products?.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <div className="text-sm text-gray-500 flex gap-2">
                <p>Size: {product.size} </p>
                <span className=" bg-gray-500 w-0.25 h-5 block "></span>{" "}
                <p>Color: {product.color}</p>
              </div>
              <div className="flex items-center mt-2 ">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      "minus",
                      product.productId,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 text-xl font-medium border-gray-300"
                >
                  -
                </button>
                <span className="mx-4 ">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      "plus",
                      product.productId,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 text-xl font-medium border-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p>${product.price * product.quantity}</p>
            <button
              onClick={() =>
                handleCartDelete({
                  productId: product.productId,
                  size: product.size,
                  color: product.color,
                  guestId,
                  userId: user?._id,
                })
              }
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
