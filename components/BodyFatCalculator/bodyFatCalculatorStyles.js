import { StyleSheet } from "react-native";

const fontSize = 20

export const bodyFatCalculatorStyles = StyleSheet.create({
    container1: {
        backgroundColor: '#000',
        alignItems: 'center'
    },
    maleFemaleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
    },
    maleFemaleSelectedContainer: {
        borderWidth: 3,
        backgroundColor: 'blue',
        borderWidth: 1,
        borderColor: 'white',
        padding: 3,
        borderRadius: 2
    },
    maleFemaleUnselectedContainer: {
        borderWidth: 1,
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 3,
        borderRadius: 2
    },
    maleFemaleTextSelected: {
        color: 'white',
        fontSize: fontSize
    },
    maleFemaleTextUnselected: {
        color: 'gray',
        fontSize: fontSize
    },  
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fieldText: {
        color: 'white',
        fontSize: fontSize
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        paddingTop: 4,
        paddingLeft: 6,
        paddingBottom: 2,
        margin: 3,
        width: 120,
        fontSize: fontSize,
        color: 'white'
    },
    parametersModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    parametersModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignContent: 'center',
        padding: 1,
        margin: 1
    },
    buttonText: {
        fontSize: fontSize,
        color: '#00f',
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
    descriptionText: {
        color: 'white',
        fontSize: fontSize,
    },
    descriptionContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 600,
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginTop: 15
    }
})