import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = (selected, query) => {

  const args = {};
  switch (selected) {
    case 'latest': {
      args.orderBy = 'CREATED_AT'
      break;
    }
    case 'highest': {
      args.orderBy = 'RATING_AVERAGE'
      args.orderDirection = 'DESC'
      break;
    }
    case 'lowest': {
      args.orderBy = 'RATING_AVERAGE'
      args.orderDirection = 'ASC'
      break;
    }
  }

  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables: {...args, searchKeyword: query ? query : undefined},
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        searchKeyword: query ? query : undefined,
        ...args,
      },
    });
  };

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};

export default useRepositories;