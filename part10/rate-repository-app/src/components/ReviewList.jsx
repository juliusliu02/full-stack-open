import ItemSeparator from "./ItemSeparator";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import theme from "../theme";
import Text from "./Text";
import Description from "./Description";
import { format } from "date-fns";
import { useNavigate } from "react-router-native";
import { useApolloClient, useMutation } from "@apollo/client";
import { DELETE_REVIEW } from "../graphql/mutations";
import { ME } from "../graphql/queries";

const styles = StyleSheet.create({
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'white',
  }
})

const ReviewAvatar = ({rating}) => {
  return (
    <View style={styles.circle}>
      <Text style={{color: theme.colors.primary}}>{rating}</Text>
    </View>
  )
}

const ActionBox = ({repoID, reviewID}) => {
  const navigate = useNavigate();
  const [mutate] = useMutation(DELETE_REVIEW, {
    refetchQueries: () => [{
      query: ME,
      variables: {
        includeReviews: true
      }
    }]
  });

  const deleteReview = async () => {
    try {
      await mutate({
        variables: {
          reviewID
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const confirmDelete = () => {
    Alert.alert(
      "Delete this review",
      "This action is irreversible. Are you sure you want to delete this review?",
      [{text: 'Cancel'}, {text: 'Delete', onPress: deleteReview}]
    )
  }

  return (
    <View style={styles.actionBox}>
      <Pressable
        style={{...theme.button, backgroundColor: theme.colors.primary}}
        onPress={() => navigate(`/repo/${repoID}`)}
      >
        <Text style={theme.buttonText}>
          View repository
        </Text>
      </Pressable>
      <Pressable
        style={{...theme.button, backgroundColor: theme.colors.red}}
        onPress={confirmDelete}
      >
        <Text style={theme.buttonText}>
          Delete review
        </Text>
      </Pressable>
    </View>
  )
}

const ReviewItem = ({ review, UserView }) => {
  const date = new Date(review.createdAt);

  return (
    <View>
      <Description
        avatar={<ReviewAvatar rating={review.rating}></ReviewAvatar>}
        title={UserView
          ? review.repository.name
          : review.user.username}
        subtitle={format(date, 'PP')}
      >
        <Text>{review.text}</Text>
      </Description>
      {UserView && <ActionBox repoID={review.repositoryId} reviewID={review.id} />}
    </View>
  )
}

const ReviewList = ({ reviews, header, UserView, onEndReach }) => {
  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} UserView={UserView} />}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={header}
      onEndReached={onEndReach}
    />
  )
}

export default ReviewList;