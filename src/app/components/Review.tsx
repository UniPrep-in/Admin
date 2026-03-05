"use client";
import { useState } from "react";

export default function Reviews() {
  const [showAll, setShowAll] = useState(false);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "This platform completely transformed how I approach learning. The courses are well-structured and the instructors are top-notch. I've been able to upskill in just weeks what would have taken months elsewhere.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The flexibility to learn at my own pace while working full-time has been invaluable. The course library is extensive and covers exactly what I needed to advance my career.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content: "I was skeptical at first, but the quality of content exceeded my expectations. The certificates have already helped me stand out in job interviews.",
      rating: 5,
    },
    {
      id: 4,
      name: "David Kim",
      role: "Data Analyst",
      content: "The expert instructors bring real-world experience that you can't find in textbooks. I've applied what I learned immediately in my current role.",
      rating: 5,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "UX Designer",
      content: "Finally, a platform that understands adult learners. The support team is responsive and the community is incredibly helpful.",
      rating: 5,
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Startup Founder",
      content: "Investing in this platform was one of the best decisions for my professional development. The ROI has been tremendous.",
      rating: 5,
    },
  ];

  const initialReviews = reviews.slice(0, 3);
  const additionalReviews = reviews.slice(3);
  const displayedReviews = showAll ? reviews : initialReviews;

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-16">
          <h2 className="text-4xl text-black max-w-xl text-center mb-4">
            Choose us because of our experience
          </h2>
          <p className="text-black text-lg text-center max-w-xl mx-auto">
            Join thousands of satisfied learners who have transformed their careers through our platform.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-xl border border-neutral-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-500 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {review.content}
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-medium text-gray-900 text-sm">
                  {review.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {review.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Read More Button */}
        {additionalReviews.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-blue-500 to-blue-600 border border-gray-200 rounded-full text-white hover:scale-110 duration-300"
            >
              {showAll ? (
                <>
                  Show Less
                </>
              ) : (
                <>
                  Read More Reviews
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}