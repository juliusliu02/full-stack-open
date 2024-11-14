import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Text from './Text';
import theme from "../theme";
import { Link } from "react-router-native";
import { useApolloClient, useQuery } from "@apollo/client";
import { ME } from "../graphql/queries";
import useAuthStorage from "../hooks/useAuthStorage";

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
  tabBar: {
    height: 50
  },
  tabItem: {
    color: 'white'
  }
});

const AppBarTab = ({text, link, onPress}) => {
  return <Pressable>
    <Link to={link} onPress={onPress} >
      <Text style={styles.tabItem}>{text}</Text>
    </Link>
  </Pressable>
}

const AppBar = () => {
  const { data } = useQuery(ME);

  const me = data?.me || null
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const logout = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  }

  return <View>
      <ScrollView contentContainerStyle={styles.container} style={styles.tabBar} horizontal>
        <AppBarTab text='Repositories' link='/' />
        {me && <AppBarTab text='Create Review' link='/newReview' />}
        {me && <AppBarTab text='My Review' link='/myReview' />}
        {me ? <AppBarTab text='Sign Out' link='/' onPress={logout} /> : <AppBarTab text='Sign In' link='/signin' />}
        {!me && <AppBarTab text='Sign Up' link='/signup' />}
      </ScrollView>
  </View>;
};

export default AppBar;