import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "./ProductForm";

const AddProduct = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[30rem] h-max flex flex-col gap-5 p-7 rounded-md border-2 shadow-2xl">
        <div className="text-4xl font-bold flex flex-col self-start mb-5">
          <span>Add</span>
          <span className="font-light">a Product</span>
        </div>

        <ProductForm />
        <div className="text-center">
          <Link href={"/"} className="underline flex items-center gap-1">
            <ArrowLeft className="size-4" /> Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AddProduct;
