import * as yup from "yup";
import { useFormik } from "formik";
import { Pressable, TextInput, View } from "react-native";
import theme from "../theme";
import Text from "./Text";
import { CREATE_REVIEW } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-native";

const initialValues = {
  ownerName: '',
  repositoryName: '',
  rating: '',
  text: ''
}

const validationSchema = yup.object().shape({
  ownerName: yup.string().required(),
  repositoryName: yup.string().required(),
  rating: yup.number().integer().required().min(0).max(100),
  text: yup.string()
})

const ReviewForm = () => {
  const navigate = useNavigate();

  const [mutate] = useMutation(CREATE_REVIEW)

  const onSubmit = async (values) => {
    const {ownerName, repositoryName, rating, text} = values;
    const review = {
      ownerName,
      repositoryName,
      rating: Number(rating),
      text
    }

    try {
      const { data } = await mutate({variables: {review}});
      navigate(`/repo/${data.createReview.repositoryId}`)
    } catch (error) {
      console.log(error)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return <View>
    <TextInput
      style={[theme.input, this.error && theme.errorBox]}
      placeholder='Repository owner name'
      value={formik.values.ownerName}
      onChangeText={formik.handleChange('ownerName')}
    />
    {formik.touched.ownerName && formik.errors.ownerName && (
      <Text style={theme.errorText}>{formik.errors.ownerName}</Text>
    )}
    <TextInput
      style={[theme.input, this.error && theme.errorBox]}
      placeholder='Repository name'
      value={formik.values.repositoryName}
      onChangeText={formik.handleChange('repositoryName')}
    />
    {formik.touched.repositoryName && formik.errors.repositoryName && (
      <Text style={theme.errorText}>{formik.errors.repositoryName}</Text>
    )}
    <TextInput
      style={[theme.input, this.error && theme.errorBox]}
      placeholder='Rating'
      value={formik.values.rating.toString()}
      onChangeText={formik.handleChange('rating')}
    />
    {formik.touched.rating && formik.errors.rating && (
      <Text style={theme.errorText}>{formik.errors.rating}</Text>
    )}
    <TextInput
      style={[theme.input, this.error && theme.errorBox]}
      placeholder='Review'
      value={formik.values.text}
      onChangeText={formik.handleChange('text')}
      multiline={true}
    />
    <Pressable style={theme.button} onPress={formik.handleSubmit}>
      <Text style={theme.buttonText}>Create review</Text>
    </Pressable>
  </View>
}

export default ReviewForm;