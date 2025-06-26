import useProductStore from "@/app/store/useProductStore";
import { Spinner } from "@/components/ui/spinner";
import { SquareDashedKanban } from "lucide-react";
import { useEffect } from "react";

const ReviewSection = ({ productId }: { productId: string }) => {
  const { fetchReview, reviews, resetReview, loadingReview, averageRating } =
    useProductStore();

  useEffect(() => {
    fetchReview(productId);

    return () => {
      resetReview();
    };
  }, [fetchReview, resetReview, productId]);

  return (
    <div className="mt-8">
      <h1 className="flex flex-col text-4xl">
        <span className="font-light">View</span>
        <span className="font-bold">User Reviews</span>
      </h1>

      {loadingReview ? (
        <div className="flex items-center justify-center">
          <Spinner size="medium" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-xl mt-5 flex gap-2 items-center">
          <SquareDashedKanban />
          No reviews for this product yet
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col text-lg">
            <span>Total Reviews: {averageRating?.count}</span>
            <span>Average Rating: {averageRating?.averageRating}</span>
          </div>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-md flex flex-col w-[20rem] md:w-[40rem] bg-gray-600 text-white"
            >
              <h1 className="text-lg font-bold tracking-wider">
                {review.user.name}
              </h1>
              <span className="text-2xl">
                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
              </span>
              <span className="text-lg">{review.comment}</span>
              <span className="text-sm text-end">
                {review.createdAt.toDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ReviewSection;
