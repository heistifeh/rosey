import { useQuery } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { Loader2, Star } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
  client?: {
    display_name: string;
  };
}

interface ProfileReviewsSectionProps {
  profileId: string;
}

export function ProfileReviewsSection({ profileId }: ProfileReviewsSectionProps) {
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["profile-reviews", profileId],
    queryFn: () => apiBuilder.reviews.getReviews(profileId),
    enabled: !!profileId,
  });

  if (isLoading) {
    return (
      <section className="py-6">
        <h2 className="text-xl font-semibold text-primary-text mb-4">Reviews</h2>
        <div className="flex justify-center items-center h-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary-text">
          Reviews ({reviews.length})
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-gray-400 italic py-4">No reviews available yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-primary-bg rounded-xl p-3 border border-dark-border flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating
                        ? "fill-primary text-primary"
                        : "text-text-gray-opacity"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-text-gray-opacity">
                  {format(new Date(review.created_at), "MMM d, yyyy")}
                </span>
              </div>

              {review.title && (
                <h3 className="text-base font-medium text-primary-text line-clamp-1">
                  {review.title}
                </h3>
              )}

              <p className="text-sm text-text-gray line-clamp-3">
                {review.body}
              </p>

              {/* <div className="mt-auto pt-2 text-xs text-primary font-medium">
                {review.client?.display_name || "Anonymous Client"}
              </div> */}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
