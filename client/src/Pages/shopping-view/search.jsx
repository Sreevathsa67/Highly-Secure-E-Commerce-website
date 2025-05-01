import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  
  const keyword = searchParams.get("keyword") || "";

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      dispatch(getSearchResults(keyword));
    } else {
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {keyword ? (
          <p className="text-gray-600">Showing results for "{keyword}"</p>
        ) : (
          <p className="text-gray-600">Enter a search term to find products</p>
        )}
      </div>
      
      {}
      {!searchResults.length ? (
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold mb-4">No result found!</h2>
          <p className="text-lg text-gray-600 mb-6">
            {keyword
              ? `We couldn't find any products matching "${keyword}"`
              : "Please enter a search term to find products"}
          </p>
          {keyword && (
            <div className="max-w-md mx-auto">
              <h3 className="font-medium text-lg mb-2">Suggestions:</h3>
              <ul className="text-left list-disc pl-5 text-gray-600">
                <li>Make sure all words are spelled correctly</li>
                <li>Try different keywords</li>
                <li>Try more general keywords</li>
                <li>Try fewer keywords</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item.id}
              handleAddtoCart={handleAddtoCart}
              product={item}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      )}
      
      {}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;