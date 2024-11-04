import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-navigation';
import Dialog from 'react-native-dialog';
import ACFTBannerAd from '../ACFTBannerAd';
import { backendUrl } from '../constants';
import acftResultsStyles from './acftResultsStyles';


export default function ACFTResults(props) {

  const [acftResults, setAcftResults] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [itemNo, setItemNo] = useState(0);
  const [visible, setVisible] = useState(false)


  useEffect(() => {
    getData(true)
  }, [])

  const getData = async (first) => {
    setToken( await AsyncStorage.getItem('MR_token') );
    let id = await AsyncStorage.getItem('user_id');
    if (id) {
        if (first) {
            setData(id)
        }
    } else {
        console.log("No token")
        props.navigation.navigate("Auth")
    }
  };

  const setData = (id) => {
    fetch(`${backendUrl}api/users/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( res => res.json())
    .then( res => {
        if (res.username === undefined) {
          alert("Couldn't get acft info")
          props.navigation.navigate("Profile")
        }
        else {
          setUsername(res.username)
          setAcftResults(res.acft_results)
        }
    })
    .catch( error => console.log(error))
  }

  const checkPassword = () => {
    fetch(`${backendUrl}api/authenticate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then( res => res.json())
    .then( res => {
        if (res.token) {
            deleteAcftResult()
        }
        else {
            alert("Incorrect password")
        }
    })
    .catch( error => console.log(error))
    setVisible(false)
  }

  const deleteAcftResult = () => {
    let newAcftResults = []
    for(let i = 0; i < acftResults.length; i++){
        if (!(acftResults[i].id === itemNo)) {
            newAcftResults.push(acftResults[i])
        }
    }
    fetch(`${backendUrl}api/acft_scores/${itemNo}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    })
    .then( () => {
        setAcftResults(newAcftResults)
        getData(false)
    })
    .catch( error => console.log(error))
  }

  const passwordInput = (value) => {
    setPassword(value)
  }

  const showDialog = (item) => {
      setVisible(true)
      setItemNo(item.id)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={acftResultsStyles.container}>
            <Dialog.Container visible={visible}>
                <Dialog.Title>Confirm with Password</Dialog.Title>
                <Dialog.Description>
                Please input your password to delete this score.
                </Dialog.Description>
                <Dialog.Input placeholder={"Password"} onChangeText={passwordInput}/>
                <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
                <Dialog.Button label="Confirm" onPress={() => checkPassword()} />
            </Dialog.Container>

            <FlatList


    data={acftResults}
    renderItem={({item}) => (
        <TouchableOpacity onPress={() => showDialog(item)} style={{margin: 10, borderColor: 'white', borderWidth: 2, backgroundColor: '#000'}}>
            <View style={acftResultsStyles.rowContainer}>
                <Text style={acftResultsStyles.item}>Total Score: {item.total_score}</Text>
                <Text style={acftResultsStyles.item}>Date: {item.month}/{item.day}/{item.year}</Text>
            </View>

            <View style={acftResultsStyles.rowContainer}>
                <Text style={acftResultsStyles.item}>Deadlift Raw: {item.deadlift_raw} lbs.</Text>
                <Text style={acftResultsStyles.item}>Deadlift Score: {item.deadlift_score}</Text>
            </View>

            <View style={acftResultsStyles.rowContainer}>
                <Text style={acftResultsStyles.item}>SPT Raw: {item.spt_raw} m</Text>
                <Text style={acftResultsStyles.item}>SPT Score: {item.spt_score}</Text>
            </View>

            <View style={acftResultsStyles.rowContainer}>
                <Text style={acftResultsStyles.item}>Push Up Raw: {item.pushups_raw}</Text>
                <Text style={acftResultsStyles.item}>Push Up Score: {item.pushups_score}</Text>
            </View>

            <View style={acftResultsStyles.rowContainer}>
                {item.sdc_raw%60 >= 10 ?
                <Text style={acftResultsStyles.item}>SDC Raw: {Math.floor(item.sdc_raw/6000)}:{item.sdc_raw%60}</Text>
                :
                <Text style={acftResultsStyles.item}>SDC Raw: {Math.floor(item.sdc_raw/6000)}:0{item.sdc_raw%60}</Text>
                }
                <Text style={acftResultsStyles.item}>SDC Score: {item.sdc_score}</Text>
            </View>

            <View style={acftResultsStyles.rowContainer}>
                {item.plank_raw%60 >= 10 ?
                <Text style={acftResultsStyles.item}>Plank Raw: {Math.floor(item.plank_raw/6000)}:{item.plank_raw%60}</Text>
                :
                <Text style={acftResultsStyles.item}>Plank Raw: {Math.floor(item.plank_raw/6000)}:0{item.plank_raw%60}</Text>
                }
                <Text style={acftResultsStyles.item}>Plank Score: {item.plank_score}</Text>
            </View>

            <View style={acftResultsStyles.rowContainer}>
                {item.tmr_raw%60 >= 10 ?
                <Text style={acftResultsStyles.item}>2MR Raw: {Math.floor(item.tmr_raw/6000)}:{item.tmr_raw%60}</Text>
                :
                <Text style={acftResultsStyles.item}>2MR Raw: {Math.floor(item.tmr_raw/6000)}:0{item.tmr_raw%60}</Text>
                }
                <Text style={acftResultsStyles.item}>2MR Score: {item.tmr_score}</Text>
            </View>

        </TouchableOpacity>
    )}
    keyExtractor={(item, index) => index.toString()}

                />
            
            </View>
            <ACFTBannerAd/>
    </SafeAreaView>
  );
}

ACFTResults.navigationOptions = screenProps => ({
  title: "ACFT Scores",
  headerStyle: {
      backgroundColor: '#FEC029'
  },
  headerTintColor: '#000',
  headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
      color: '#000'
  },
  backgroundColor: '#000'
})