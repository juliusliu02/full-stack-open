import { gql } from '@apollo/client'

export const SIGNIN = gql`
  mutation Authenticate($username: String!, $password: String!) {
      authenticate(credentials: {username: $username, password: $password}) {
          accessToken
          user {
              username
          }
      }
  }
`

export const CREATE_REVIEW = gql`
    mutation CreateReview($review: CreateReviewInput!) {
        createReview(review: $review) {
            repositoryId
        }
    }
`

export const CREATE_USER = gql`
    mutation CreateUser($user: CreateUserInput) {
        createUser(user: $user) {
            username
        }
    }
`

export const DELETE_REVIEW = gql`
    mutation DeleteReview($reviewID: ID!) {
        deleteReview(id: $reviewID)
    }
`