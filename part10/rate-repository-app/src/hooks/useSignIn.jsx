import { SIGNIN } from "../graphql/mutations";
import { useApolloClient, useMutation } from "@apollo/client";
import useAuthStorage from '../hooks/useAuthStorage';

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [mutate, result] = useMutation(SIGNIN);

  const signIn = async ({ username, password }) => {
    const { data } = await mutate({variables: {
          username,
          password
      }})
    await authStorage.setAccessToken(data.authenticate.accessToken);
    await apolloClient.resetStore();
    return data;
  };

  return [signIn, result];
};

export default useSignIn;