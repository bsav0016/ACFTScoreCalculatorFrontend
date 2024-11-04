import { StyleSheet } from 'react-native';

const aboutStyles = StyleSheet.create({
    container: {
        width: '95%',
        flex: 6,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 24,
        padding: 5,
        color: '#fff',
        backgroundColor: '#000'
    },
    bodyText:{
        fontSize: 16,
        padding: 5,
        color: '#fff',
        backgroundColor: '#000'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        backgroundColor: '#000'
    },
    buttonText: {
        fontSize: 16,
        paddingVertical: 5,
        color: '#FEC029',
        textDecorationLine: 'underline',
        backgroundColor: '#000',
        paddingHorizontal: 5
    }
});

export default aboutStyles;