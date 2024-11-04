import { StyleSheet, Dimensions } from "react-native";


const acftResultsStyles = StyleSheet.create({
    container: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
    },
    rowContainer: {
        flexDirection: 'row',
        marginVertical: 3,
        justifyContent: 'space-around',
        width: Dimensions.get('window').width-20
    },
    item: {
        color: 'white',
        fontSize: 15
    }
});

export default acftResultsStyles;