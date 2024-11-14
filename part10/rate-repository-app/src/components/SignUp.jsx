import * as yup from "yup";
import { useFormik } from "formik";
import { Pressable, TextInput, View } from "react-native";
import theme from "../theme";
import Text from "./Text";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../graphql/mutations";
import { useNavigate } from "react-router-native";

const initialValues = {
  username: '',
  password: '',
  passwordConfirmation: '',
}

const validationSchema = yup.object().shape({
  username: yup.string().required().min(5).max(30),
  password: yup.string().required().min(5).max(30),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password')], "Passwords don't match")
})

const SignUp = () => {
  const [signUp] = useMutation(CREATE_USER);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const {username, password} = values;
    try {
      await signUp({variables: {
        user: {username, password}
      }});
      navigate('/')
    } catch (e) {
      console.log(e.message);
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return (
    <View>
      <TextInput
        style={[theme.input, this.error && theme.errorBox]}
        placeholder='Username'
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={theme.errorText}>{formik.errors.username}</Text>
      )}
      <TextInput
        style={[theme.input, this.error && theme.errorBox]}
        placeholder='Password'
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={theme.errorText}>{formik.errors.password}</Text>
      )}
      <TextInput
        style={[theme.input, this.error && theme.errorBox]}
        placeholder='Password Confirmation'
        secureTextEntry
        value={formik.values.passwordConfirmation}
        onChangeText={formik.handleChange('passwordConfirmation')}
      />
      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
        <Text style={theme.errorText}>{formik.errors.passwordConfirmation}</Text>
      )}
      <Pressable style={theme.button} onPress={formik.handleSubmit}>
        <Text style={theme.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  )
}

export default SignUp