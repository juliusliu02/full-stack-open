import { Platform } from 'react-native';

const colors = {
  textPrimary: '#24292e',
  textSecondary: '#586069',
  primary: '#0366d6',
  red: '#d73a4a'
}

const theme = {
  card: {
    backgroundColor: "white",
  },
  colors,
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
  separator: {
    height: 20,
  },
  descriptionBox: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  avatarBox: {
    width: 50,
    height: 50,
    marginTop: 10
  },
  descriptionTextBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexShrink: 1,
    marginHorizontal: 15,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 8,
    flexGrow: 1
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: colors.red,
    margin: 15
  },
  errorBox: {borderColor: colors.red},
};

export default theme;