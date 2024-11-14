import { useParams } from "react-router-native";
import { useQuery } from "@apollo/client";
import { GET_REPOSITORY } from "../graphql/queries";
import RepositoryItem from "./RepositoryItem";
import ItemSeparator from "./ItemSeparator";
import ReviewList from "./ReviewList";

const RepositoryDetailedHeader = ({repository}) => {
  return (
    <>
      <RepositoryItem item={repository} Detailed />
      <ItemSeparator />
    </>
  )
}

const RepositoryDetailedView = () => {
  const { id } = useParams();

  const { data, loading, fetchMore } = useQuery(GET_REPOSITORY, {
    fetchPolicy: 'cache-and-network',
    variables: {id}
  })

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        id
      }
    })
  }

  if (loading) return null

  const reviewsNodes = data.repository.reviews
    ? data.repository.reviews.edges.map(edge => edge.node)
    : [];

  return (
    <ReviewList
      reviews={reviewsNodes}
      header={<RepositoryDetailedHeader repository={data.repository}/>}
      onEndReach={handleFetchMore}
    />
  );
}

export default RepositoryDetailedView;