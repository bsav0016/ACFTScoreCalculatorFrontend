import { StyleSheet } from "react-native";


const profileStyles = StyleSheet.create({
    container: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        marginVertical: 0,
        backgroundColor: 'black',
        paddingVertical: 3,
        paddingHorizontal: 5
    },
    label: {
        fontSize: 20,
        padding: 8,
        color: '#FEC029',
        fontWeight: 'bold'
    },
    input: {
        fontSize: 20,
        padding: 5,
        color: '#FEC029'
    },
    otherInput: {
        fontSize: 20,
        padding: 8,
        color: '#FEC029'
    },
    signOutText: {
        color: 'red',
        fontSize: 18,
        paddingRight: 10
    },
    editIcon: {
        color: '#FEC029',
        marginTop: 10,
        marginLeft: 2
    },
    textInput: {
        paddingHorizontal: 10,
        backgroundColor: '#fff'
    },
    saveIcon: {
        color: '#FEC029',
        marginTop: 5,
        marginLeft: 15
    },
    undo: {
        color: '#FEC029',
        marginLeft: 15,
        marginTop: 5
    },
    button: {
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: '#FEC029',
        borderRadius: 8,
        flexDirection: 'row',
        marginVertical: 3,
        padding: 5,
        alignItems: 'center'
    }
});

export default profileStyles;