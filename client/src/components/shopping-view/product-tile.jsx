import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {}
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-64 object-cover"
          onClick={() => handleGetProductDetails(product?._id)}
        />
        <button 
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#AC1754] text-[#AC1754]' : ''}`} />
        </button>
        
        {}
        {product?.totalStock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            Out Of Stock
          </div>
        )}
        
        {}
        {product?.totalStock > 0 && product?.totalStock < 10 && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded">
            Only {product?.totalStock} left
          </div>
        )}
      </div>
      
      {}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product?.title}</h3>
        
        {}
        <div className="flex items-center mt-1">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">
            {product?.averageReview?.toFixed(1) || "0.0"}
          </span>
        </div>
        
        {}
        <div className="mt-2 flex items-center justify-between">
          {product?.salePrice > 0 ? (
            <span className="text-xl font-bold text-[#AC1754]">${product?.salePrice}</span>
          ) : (
            <span className="text-xl font-bold text-[#AC1754]">${product?.price}</span>
          )}
          
          <Button
            onClick={() => handleAddtoCart(product?._id)}
            disabled={product?.totalStock === 0}
            className="bg-[#AC1754] text-white px-4 py-2 rounded-md hover:bg-[#8A1343] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;