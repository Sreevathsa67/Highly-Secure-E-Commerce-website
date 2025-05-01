import { Button } from "../ui/button";
import { MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCartItems,
  updateCartQuantity
} from "@/store/shop/cart-slice";

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  
  const productId = cartItem?.productId || cartItem?._id;
  const quantity = cartItem?.quantity || 1;
  const title = cartItem?.title || "Product";
  const price = cartItem?.price || 0;
  const salePrice = cartItem?.salePrice || 0;
  const image = cartItem?.image || "";
  const category = cartItem?.category || "";
  const brand = cartItem?.brand || "";
  const totalStock = cartItem?.totalStock || 10;

  function handleDeleteCartItem() {
    if (!user?.id || !productId) return;
    
    dispatch(
      deleteCartItem({
        userId: user.id,
        productId: productId
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user.id));
      }
    });
  }

  function handleUpdateCartItem(newQuantity) {
    if (!user?.id || !productId) return;
    if (newQuantity < 1) return;
    if (newQuantity > totalStock) newQuantity = totalStock;

    dispatch(
      updateCartQuantity({
        userId: user.id,
        productId: productId,
        quantity: newQuantity,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user.id));
      }
    });
  }

  return (
    <div className="flex flex-col space-y-2 border-b border-gray-100 pb-4">
      <div className="flex items-start gap-3">
        {}
        <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        
        {}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
            {title}
          </h4>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="text-sm text-gray-500 mb-1 sm:mb-0">
              {category} • {brand}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {salePrice > 0 ? (
                <div className="flex items-center gap-1">
                  <span className="text-rose-500">${salePrice}</span>
                  <span className="text-xs text-gray-500 line-through">${price}</span>
                </div>
              ) : (
                <span className="text-rose-500">${price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center border border-gray-200 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleUpdateCartItem(quantity - 1)}
            disabled={quantity <= 1}
            className="h-8 w-8 rounded-l-md text-gray-500 hover:text-gray-900"
          >
            <MinusIcon className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleUpdateCartItem(quantity + 1)}
            disabled={quantity >= totalStock}
            className="h-8 w-8 rounded-r-md text-gray-500 hover:text-gray-900"
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteCartItem}
          className="h-8 w-8 text-gray-500 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;