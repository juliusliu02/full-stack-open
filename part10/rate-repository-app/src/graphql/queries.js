import { gql } from '@apollo/client';
import { REPO_DETAILS, REVIEW_DETAILS } from "./fragments";

export const GET_REPOSITORIES = gql`
    query get_repo($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String, $after: String) {
        repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword, first: 5, after: $after) {
            totalCount
            edges {
                node {
                    ...RepositoryDetails
                }
            }
            pageInfo {
                endCursor
                startCursor
                hasNextPage
            }
        }
    }
    ${REPO_DETAILS}
`;

export const GET_REPOSITORY = gql`
    query getRepository($id: ID!, $after: String) {
        repository(id: $id) {
            ...RepositoryDetails
            reviews(first: 3, after: $after) {
                totalCount
                edges {
                    node {
                        id
                        text
                        rating
                        createdAt
                        repositoryId
                        user {
                            id
                            username
                        }
                    }
                    cursor
                }
                pageInfo {
                    endCursor
                    startCursor
                    hasNextPage
                }
            }
        }
    }
    ${REPO_DETAILS}
`;

export const ME = gql`
    query getCurrentUser($includeReviews: Boolean = false) {
        me {
            id
            username
            reviews @include(if: $includeReviews) {
                ...ReviewDetails
            }
        }
    }
    ${REVIEW_DETAILS}
`