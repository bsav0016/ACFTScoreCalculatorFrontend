import { StyleSheet } from "react-native";


const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: '#000',
        margin: 10,
        borderColor: '#FEC029',
        borderWidth: 3
    },
    buttonText: {
        color: '#FEC029',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 24,
        textAlign: 'center'
    }
});

export default homeStyles;