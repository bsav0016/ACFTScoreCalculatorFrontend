import { StyleSheet } from "react-native";

const calculatorStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
    container1: {
        backgroundColor: '#000',
        alignItems: 'center'
    },
    fieldText: {
        color: 'white'
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
        color: 'white'
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
        color: '#39f',
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
    aftAlternateEventsImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1360/553
    },
    aftDeadliftScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 624/666
    },
    aftPushUpScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 624/674
    },
    aftSdcScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 624/584
    },
    aftPlankScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 624/596
    },
    aftMRScoresImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 694/595
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    combatMOSContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        display: 'flex'
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }, 
    combatMOSText: {
        flex: 1,
        color: 'white',
        textAlign: 'center',
        marginLeft: 3
    },
    noText: {
        textAlign: 'right',
        margin: 3,
        color: 'white'
    },
    yesText: {
        textAlign: 'left',
        margin: 3,
        color: 'white'
    },
    infoModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      infoModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
      },
      scoreText: {
        color: 'white'
      }
});

export default calculatorStyles;