"use client";

import { addProduct } from "@/actions/product.action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categoryData } from "@/data/category.data";
import { ProductCategory, RegisterProduct } from "@/types/product.types";
import { Loader2Icon } from "lucide-react";
// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ProductForm = () => {
  // const router = useRouter();
  const [formData, setFormData] = useState<RegisterProduct>({
    name: "",
    category: undefined,
    price: 1,
    quantity: 1,
    description: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await addProduct(formData);
      if (res.success) {
        toast.success("Successfully Added the Product");
        setFormData({
          name: "",
          category: undefined,
          price: 1,
          quantity: 1,
          description: "",
          image: "",
        });
      } else {
        toast.error(res.error || "Something went wrong");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
    console.log(formData);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div>
        <label htmlFor="name">Name</label>
        <Input
          name="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleFormData}
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block mb-1">
          Category
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {formData.category || "Select a Category"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  category: value as ProductCategory,
                }))
              }
            >
              {categoryData.map((data, index) => (
                <div key={index}>
                  <DropdownMenuRadioItem value={data}>
                    {data}
                  </DropdownMenuRadioItem>
                </div>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Price Field */}
      <div>
        <label htmlFor="price">Price</label>
        <div className="relative">
          <Input
            name="price"
            type="number"
            placeholder="Enter price of the product"
            className="pl-8"
            value={formData.price}
            onChange={handleFormData}
            required
          />
          <p className="absolute left-1 top-0 translate-y-1/4">Rs.</p>
        </div>
      </div>

      {/* Quantity Field */}
      <div>
        <label htmlFor="quantity">Quantity</label>
        <Input
          name="quantity"
          type="number"
          placeholder="Enter Quantity"
          value={formData.quantity}
          onChange={handleFormData}
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          placeholder="Describe the product"
          name="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* Image Field */}
      <div>
        <label htmlFor="image">Image</label>
        <Input
          name="image"
          type="text"
          placeholder="Enter Image URL"
          value={formData.image}
          onChange={handleFormData}
          required
        />
      </div>

      {/* submit button */}
      <div className="mt-5">
        {isLoading ? (
          <Button disabled className="w-full">
            <Loader2Icon className="animate-spin" />
            Adding..
          </Button>
        ) : (
          <Button variant={"default"} type="submit" className="w-full">
            Add the product
          </Button>
        )}
      </div>
    </form>
  );
};
export default ProductForm;
