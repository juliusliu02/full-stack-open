import { useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";
import ReviewList from "./ReviewList";

const MyReview = () => {
  const { data, loading } = useQuery(ME, {
    variables: {
      includeReviews: true,
    },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return null;
  }

  const reviewsNodes = data.me.reviews
    ? data.me.reviews.edges.map(edge => edge.node)
    : [];

  return (
    <ReviewList reviews={reviewsNodes} UserView />
  )
}

export default MyReview;