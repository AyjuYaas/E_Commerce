"use client";

import { useOrderStore } from "@/app/store/useOrderStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface Props {
  id: string;
  image: string;
  name: string;
  price: number;
}

interface FormDataType {
  rating: number;
  review: string;
}

const ReviewModal = ({ product }: { product: Props }) => {
  const {
    fetchReview,
    loadingReview,
    resetReview,
    review,
    submitReview,
    loadingPostReview,
  } = useOrderStore();

  const [formData, setFormData] = useState<FormDataType>({
    rating: 0,
    review: "",
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchReview(product.id);
    } else {
      resetReview();
      setFormData({ rating: 0, review: "" });
    }
  }, [open, fetchReview, product.id, resetReview]);

  useEffect(() => {
    if (review && open) {
      setFormData({
        rating: review.rating,
        review: review.comment,
      });
    }
  }, [review, open]);

  useEffect(() => {
    if (!open) {
      setFormData({ rating: 0, review: "" });
    }
  }, [open]);

  const handleSubmit = async () => {
    const res = await submitReview(
      formData.rating,
      formData.review,
      product.id
    );
    if (res) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => {
            setOpen(true);
          }}
          className="w-full"
        >
          Review
        </Button>
      </DialogTrigger>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review {product.name}</DialogTitle>
            <DialogDescription>
              Tell us how you feel about the product
            </DialogDescription>
          </DialogHeader>

          {loadingReview ? (
            <div className="flex items-center justify-center">
              <Spinner size="medium" />
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex w-full gap-4">
                  <Rating
                    value={formData.rating}
                    onChange={(_, value) =>
                      setFormData((prev) => ({ ...prev, rating: value }))
                    }
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton key={index} />
                    ))}
                  </Rating>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="review">Review</Label>
                <Textarea
                  id="review"
                  name="review"
                  placeholder="Write your review here"
                  value={formData.review}
                  className="max-h-[100px]"
                  rows={3}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      review: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loadingPostReview}
            >
              {loadingPostReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ReviewModal;
