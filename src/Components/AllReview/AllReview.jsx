import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/authProvider";

const AllReview = () => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!user?.email) return; // Ensure user is logged in

        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:5000/review?userEmail=${user.email}`);
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [user?.email]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-center mb-6">My Reviews</h2>
            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
                            <img
                                src={review.image}
                                alt="Room"
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">{review.roomName}</h3>
                            <p className="text-gray-600"><strong>Reviewer:</strong> {review.reviewer}</p>
                            <p className="flex items-center mt-2">
                                <strong className="mr-1">Rating:</strong>
                                <span className="text-yellow-500 text-lg">{'⭐'.repeat(review.rating)}</span>
                            </p>
                            <p className="text-gray-700 mt-2"><strong>Review:</strong> {review.reviewText}</p>
                            <p className="text-gray-500 text-sm mt-3">
                                Reviewed on: {new Date(review.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No reviews found.</p>
            )}
        </div>
    );
};

export default AllReview;
