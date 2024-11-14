import { gql } from '@apollo/client'

export const REPO_DETAILS = gql`
  fragment RepositoryDetails on Repository {
      fullName
      description
      language
      forksCount
      ratingAverage
      reviewCount
      stargazersCount
      ownerAvatarUrl
      url
      id
  }
`
export const REPO_REVIEWS = gql`
    fragment RepositoryReviews on Repository {
        reviews {
            edges {
                node {
                    text
                    user {
                        username
                    }
                    rating
                    createdAt
                }
            }
        }
    }
`

export const REVIEW_DETAILS = gql`
    fragment ReviewDetails on ReviewConnection {
        edges {
            node {
                id
                text
                user {
                    username
                }
                rating
                createdAt
                repository {
                    name
                }
                repositoryId
            }
        }
    }
`