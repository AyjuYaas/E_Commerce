"use client";

import useAuthStore from "@/app/store/useAuthStore";
import { useCartStore } from "@/app/store/useCartStore";
import useProductStore from "@/app/store/useProductStore";
import { Button } from "@/components/ui/button";
import {
  Loader2Icon,
  LoaderCircleIcon,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReviewSection from "./ReviewSection";

const ProductDetails = ({ params }: { params: { productid: string } }) => {
  const {
    individualProduct,
    fetchIndividualProduct,
    loadingIndividualProduct,
  } = useProductStore();

  const { user } = useAuthStore();
  const { loadingAddToCart: loading, addToCart } = useCartStore();

  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    fetchIndividualProduct(params.productid);
  }, [fetchIndividualProduct, params.productid]);

  const onAddToCart = async () => {
    if (user) {
      await addToCart({
        userId: user?.id || "",
        productId: params.productid,
        quantity,
      });
    } else {
      toast.error("Please login to add to cart");
    }
  };

  return (
    <div>
      {loadingIndividualProduct ? (
        <LoaderCircleIcon />
      ) : !individualProduct ? (
        <div>Invalid Product</div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold mb-5">{individualProduct.name}</h1>
          <div className="flex flex-wrap gap-7 items-center">
            <img
              src={individualProduct.image}
              alt={individualProduct.name}
              className="size-[10rem] md:size-[15rem] rounded-lg border-2"
            />
            <div className="flex flex-col gap-2">
              <p className="text-2xl">{individualProduct.description}</p>

              <p className="text-green-600 text-2xl font-bold">
                Rs. {individualProduct.price}
              </p>

              <div>
                {individualProduct.quantity === 0 ? (
                  <p className="text-red-700">Out of Stock!</p>
                ) : individualProduct.quantity < 10 ? (
                  <p className="text-yellow-500 text-lg ">
                    Only {individualProduct.quantity} item left in stock!
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="flex items-center">
                <Button
                  variant={"outline"}
                  className="rounded-full border-2"
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  disabled={quantity === 1 || individualProduct.quantity === 0}
                >
                  <Minus />
                </Button>

                <span className="mx-4 text-lg">{quantity}</span>

                <Button
                  variant={"outline"}
                  className="rounded-full border-2"
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.min(prev + 1, individualProduct.quantity)
                    )
                  }
                  disabled={
                    quantity === individualProduct.quantity ||
                    individualProduct.quantity === 0
                  }
                >
                  <Plus />
                </Button>
              </div>

              {loading ? (
                <Button
                  disabled
                  className="text-lg flex items-center mt-4 w-max py-6"
                >
                  <Loader2Icon className="animate-spin" />
                  Adding to cart...
                </Button>
              ) : (
                <Button
                  variant={
                    individualProduct.quantity === 0 ? "destructive" : "default"
                  }
                  className="text-lg flex items-center mt-4 w-max py-6"
                  disabled={individualProduct.quantity === 0}
                  onClick={onAddToCart}
                >
                  <ShoppingBag /> Add to cart
                </Button>
              )}
            </div>
          </div>

          <section>
            <ReviewSection productId={individualProduct.id} />
          </section>
        </div>
      )}
    </div>
  );
};
export default ProductDetails;
