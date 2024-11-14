import { Image, Pressable, StyleSheet, View } from "react-native";
import Text from './Text'
import theme from "../theme";
import * as Linking from 'expo-linking';
import Description from "./Description";

const styles = StyleSheet.create({
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-around',
  },
  elementBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  tag: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    alignSelf: 'flex-start'
  },
  languageTag: {
    color: 'white',
    marginHorizontal: 5,
  }
});

const RepositoryDescription = ({item}) => {
  return (
    <View>
      <Description avatar={<Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />} title={item.fullName} subtitle={item.description}>
        <View style={styles.tag}>
          <Text style={styles.languageTag}>{item.language}</Text>
        </View>
      </Description>
    </View>
  )
}

const RepositoryStats = ({item}) => {

  const formatNumber = (num) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => num >= item.value);
    return item ? (num / item.value).toFixed(1).replace(regexp, "").concat(item.symbol) : "0";
  }

  return (
    <View style={styles.statsContainer}>
      <View style={styles.elementBox}>
        <Text>Stars</Text>
        <Text testID='starsCount' color="textSecondary">{formatNumber(item.stargazersCount)}</Text>
      </View>
      <View style={styles.elementBox}>
        <Text>Forks</Text>
        <Text testID='forksCount' color="textSecondary">{formatNumber(item.forksCount)}</Text>
      </View>
      <View style={styles.elementBox}>
        <Text>Reviews</Text>
        <Text testID='reviewCount' color="textSecondary">{formatNumber(item.reviewCount)}</Text>
      </View>
      <View style={styles.elementBox}>
        <Text>Rating</Text>
        <Text testID='ratingAverage' color="textSecondary">{item.ratingAverage}</Text>
      </View>
    </View>
  )
}

const RepositoryButton = ({link}) => {
  const onPress = () => {
    try {
      Linking.openURL(link)
    } catch (e) {
      console.log(e);
    }
  }

  return <Pressable style={theme.button} onPress={onPress}>
    <Text fontSize='subheading' style={theme.buttonText}>Open in GitHub</Text>
  </Pressable>;
}

const RepositoryItem = ({item, Detailed}) => {
  return (
    <View testID="repositoryItem" style={theme.card}>
      <RepositoryDescription item={item} />
      <RepositoryStats item={item} />
      {Detailed && <RepositoryButton link={item.url} />}
    </View>
  )
}

export default RepositoryItem;