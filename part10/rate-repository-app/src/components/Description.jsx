import { View } from "react-native";
import theme from "../theme";
import Text from "./Text";

const Description = ({ avatar, title, subtitle, children }) => {
  return (
    <View style={theme.card}>
      <View style={theme.descriptionBox}>
        <View style={theme.avatarBox}>
          {avatar}
        </View>
        <View style={theme.descriptionTextBox}>
          <Text fontSize='subheading' fontWeight='bold'>{title}</Text>
          <Text color='textSecondary'>{subtitle}</Text>
          {children}
        </View>
      </View>
    </View>
  )
}

export default Description