import { TextInput, View, Pressable } from "react-native";
import theme from "../theme";
import { useFormik } from "formik";
import Text from './Text'
import * as yup from 'yup';
import useSignIn from "../hooks/useSignIn";
import { useNavigate } from "react-router-native";

const initialValues = {
  username: '',
  password: '',
}

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
})

export const SignInContainer = ({onSubmit}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return <View>
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
    <Pressable style={theme.button} onPress={formik.handleSubmit}>
      <Text style={theme.buttonText}>Sign In</Text>
    </Pressable>
  </View>;
}

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const {username, password} = values;

    try {
      await signIn({username, password});
      navigate('/')
    } catch (e) {
      console.log(e.message);
    }
  };

  return <SignInContainer onSubmit={onSubmit}/>
};

export default SignIn;