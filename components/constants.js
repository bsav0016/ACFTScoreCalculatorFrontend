export const debug = __DEV__;

export const backendUrl = debug
    ? 'http://192.168.1.230:8000/'
    : 'https://updated-acft-score-calculator.herokuapp.com/';
