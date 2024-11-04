import { StyleSheet } from 'react-native';

const authStyles = StyleSheet.create({
  container: {
    flex: 6,
  },
  label: {
    fontSize: 24,
    color: 'white',
    padding: 10,
  },
  input: {
    fontSize: 24,
    backgroundColor: 'white',
    padding: 10,
    margin: 3,
  },
  viewText: {
    color: 'white',
    fontSize: 24,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'black',
    margin: 10,
    borderWidth: 2,
    borderColor: '#FEC029',
  },
  buttonTextStyle: {
    color: '#FEC029',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default authStyles;
