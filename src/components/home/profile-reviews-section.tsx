interface ProfileReviewsSectionProps {
  reviews: {
    text: string;
    date: string;
  }[];
}

export function ProfileReviewsSection({
  reviews,
}: ProfileReviewsSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-primary-bg rounded-xl p-4 border border-dark-border"
          >
            <p className="text-sm text-primary-text mb-3">{review.text}</p>
            <p className="text-xs text-text-gray-opacity">{review.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

