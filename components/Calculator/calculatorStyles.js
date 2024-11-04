import { StyleSheet } from "react-native";

const calculatorStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
    container1: {
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        paddingTop: 4,
        paddingLeft: 6,
        paddingBottom: 2,
        margin: 3,
        width: 70,
        fontSize: 14,
    },
    button: {
        justifyContent: 'center',
        padding: 1,
        margin: 1
    },
    altButton: {
        marginTop: 10,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 14,
        color: '#00f',
        textDecorationLine: 'underline'
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '99%',
        backgroundColor: 'white',
        paddingTop: 3,
        paddingBottom: 10,
        elevation: 30
    },
    xOut: {
        height: 20,
        width: 20
    },
    header: {
        width: '100%',
        height: 30,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 15
    },
    alternateEventsImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1938/499
    },
    deadliftScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1170/1277
    },
    ballThrowScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1171/1128,
    },
    pushUpScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1164/1282
    },
    sdcScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1167/1121
    },
    plankScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1176/1121
    },
    MRScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1170/1124
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
});

export default calculatorStyles;