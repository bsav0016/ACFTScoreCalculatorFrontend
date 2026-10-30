import { Text, View, TextInput, Alert, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { authFetch, changePassword, clearSession, getSession, signOut as endSession } from '../session';
import { newPasswordProblem, serverPasswordMessage } from '../passwordRules';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRightFromBracket, faPenToSquare, faFloppyDisk, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import Dialog from 'react-native-dialog';
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { backendUrl } from '../constants';
import { Card, inputStyle } from '../ui';
import { colors, font, radius, space } from '../theme';


// One account field: shows the value with a pencil, or an input with save / undo while editing.
function InfoRow({ label, value, editing, onChangeText, onEdit, onUndo, keyboardType, last }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      {editing ?
        <View style={styles.editRow}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize="none"
            autoFocus
            placeholderTextColor={colors.textMuted}
            style={[inputStyle, styles.editInput]}
          />
          <TouchableOpacity onPress={onEdit} style={styles.iconButton} accessibilityLabel={`Save ${label}`}>
            <FontAwesomeIcon icon={faFloppyDisk} color={colors.gold} size={22}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUndo} style={styles.iconButton} accessibilityLabel={`Cancel editing ${label}`}>
            <FontAwesomeIcon icon={faRotateLeft} color={colors.textMuted} size={20}/>
          </TouchableOpacity>
        </View>
        :
        <TouchableOpacity onPress={onEdit} disabled={!onEdit} style={styles.valueRow}>
          <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
          {onEdit && <FontAwesomeIcon icon={faPenToSquare} color={colors.textMuted} size={16} style={{marginLeft: space.sm}}/>}
        </TouchableOpacity>
      }
    </View>
  )
}

export default function Profile(props) { 
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [editUsername, setEditUsername] = useState(false)
  const [prevUsername, setPrevUsername] = useState('')
  const [email, setEmail] = useState('')
  const [editEmail, setEditEmail] = useState(false)
  const [prevEmail, setPrevEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [editFirstName, setEditFirstName] = useState(false)
  const [prevFirstName, setPrevFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [editLastName, setEditLastName] = useState(false)
  const [prevLastName, setPrevLastName] = useState('')
  const [acftResults, setAcftResults] = useState([])
  const [paidFee, setPaidFee] = useState(false)
  const [visible, setVisible] = useState(false)
  const [changeVisible, setChangeVisible] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [changeError, setChangeError] = useState('')
  const [changing, setChanging] = useState(false)

  var id = null;

  useEffect(() => {
    getData(true)
  }, [])

  const getData = async (first) => {
    const session = await getSession();
    if (session === null) {
        props.navigation.navigate("Auth")
        return
    }
    id = session.id;
    if (first) {
      setData(id)
    }
  };

  const setData = async (id) => {
    // authFetch forgets the stored login on a 401 (ended or expired), so the login screen doesn't bounce straight back.
    await authFetch(`api/users/${id}/`)
    .then( res => res.json())
    .then( async res => {
        if (res.username === undefined) {
          await clearSession()
          alert("Couldn't get account info")
          props.navigation.navigate("Auth")
        }
        else {
          setUsername(res.username)
          setEmail(res.email)
          setFirstName(res.first_name)
          setLastName(res.last_name)
          setAcftResults(res.acft_results)
          setPrevUsername(res.username)
          setPrevEmail(res.email)
          setPrevFirstName(res.first_name)
          setPrevLastName(res.last_name)
          setPaidFee(res.paid_fee)
        }
    })
    .catch( error => console.log(error))
  }

  const signOut = async () => {
    await endSession();
    props.navigation.navigate("Auth");
  }

  const showConfirmDialog = () => {
    Alert.alert("Are you sure?", "Are you sure you want to delete this account?",
      [
        {
        text: "Yes",
        onPress: () => {deleteAccount()},
        style: 'destructive'
        },
        {
          text: "No",
          onPress: () => console.log("Cancelled"),
          style: 'cancel'
        }
      ]
    )
  }

  const deleteAccount = async () => {
    await getData(false)
    authFetch(`api/users/${id}/`, {
      method: 'DELETE',
    })
    .then( async res => {
      await signOut();
      alert("Deleted account");
    })
    .catch( error => alert(error))
  }

  const goToAcftResults = () => {
    props.navigation.navigate("ACFTResults")
  }

  const doEditEmail = (value) => {
    if (!editFirstName && !editLastName && !editUsername) {
      if (editEmail) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setEmail(prevEmail)
        }
      }
      setEditEmail(!editEmail)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const doEditUsername = () => {
    if (!editFirstName && !editLastName && !editEmail) {
      if (editUsername) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setUsername(prevUsername)
        }
      }
      setEditUsername(!editUsername)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const doEditFirstName = () => {
    if (!editEmail && !editLastName && !editUsername) {
      if (editFirstName) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setFirstName(prevFirstName)
        }
      }
      setEditFirstName(!editFirstName)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const doEditLastName = () => {
    if (!editFirstName && !editEmail && !editUsername) {
      if (editLastName) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setLastName(prevLastName)
        }
      }
      setEditLastName(!editLastName)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const checkInfo = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let tempEmail = email.replace(/\s+/g, '').toLowerCase()
    if (username === '') {
        alert("Username field must not be blank")
        return false
    }
    else if (username.length > 30) {
        alert("Username field must not be more than 30 characters")
        return false
    }
    else if (reg.test(tempEmail) === false) {
        alert("Must be valid email address")
        return false
    }
    else if (tempEmail.length > 50) {
        alert("Email must not be more than 50 characters")
        return false
    }
    else if (firstName === '') {
        alert("First Name must not be blank")
        return false
    }
    else if (firstName.length > 30) {
        alert("First Name must not be more than 30 characters")
        return false
    }
    else if (lastName === '') {
        alert("Last Name must not be blank")
        return false
    }
    else if (lastName.length > 30) {
        alert("Last Name must not be more than 30 characters")
        return false
    }
    else {
      return true
    }
  }

  const saveInfo = async () => {
    await getData(false)    
    let tempEmail = email.replace(/\s+/g, '').toLowerCase()
    authFetch(`api/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({ username: username, password: password, first_name: firstName,
        last_name: lastName, email: tempEmail, acft_results: acftResults, paid_fee: paidFee })
    })
    .then( res => res.json() )
    .then( res => {
      let usernameField = res.username
      let emailField = res.email
      if (emailField === undefined) {
        emailField = ["It's fine"]
      }
      if (usernameField === undefined) {
        usernameField = ["It's fine"]
      }
      if (emailField.includes("user with this Email already exists.")){
        alert("Email is already in use")
        setEmail(prevEmail)
        return
      }
      else if (usernameField.includes("user with this Username already exists.")) {
        alert("Username already in use")
        return
      }
      else if (res.id === undefined) {
        alert("Unknown error")
        return
      }
      else {
        setUsername(username)
        setEmail(email)
        setFirstName(firstName)
        setLastName(lastName)
        setPrevUsername(username)
        setPrevEmail(email)
        setPrevFirstName(firstName)
        setPrevLastName(lastName)
        alert("Successfully updated account info")
      }
    })
    .catch( error => console.log(error))
  }

  const checkPassword = async () => {
    await getData(false)
    fetch(`${backendUrl}api/authenticate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: prevUsername, password: password })
    })
    .then( res => res.json())
    .then( res => {
        if (res.token) {
          saveInfo()
        }
        else {
          alert("Incorrect password")
          setEmail(prevEmail)
          setUsername(prevUsername)
          setFirstName(prevFirstName)
          setLastName(prevLastName)
        }
    })
    .catch( error => console.log(error))
    setVisible(false)
  }

  const openChangePassword = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setChangeError('')
    setChangeVisible(true)
  }

  // Problems are shown inside the dialog (an alert cannot appear over it on iOS) so what was typed is kept.
  const submitChangePassword = async () => {
    if (changing) return
    if (!currentPassword) {
      setChangeError('Enter your current password.')
      return
    }
    const problem = newPasswordProblem(newPassword, confirmNewPassword)
    if (problem) {
      setChangeError(problem)
      return
    }
    setChanging(true)
    const result = await changePassword(currentPassword, newPassword)
    setChanging(false)
    if (result.ok) {
      setChangeVisible(false)
      alert("Password changed")
    }
    else if (result.kind === 'wrong_password') {
      setChangeError('Your current password is not correct.')
    }
    else if (result.kind === 'weak') {
      setChangeError(serverPasswordMessage(result.messages))
    }
    else if (result.kind === 'signed_out') {
      setChangeVisible(false)
      alert("Please sign in again.")
      props.navigation.navigate("Auth")
    }
    else if (result.kind === 'throttled') {
      setChangeError('Too many attempts. Try again in an hour.')
    }
    else if (result.kind === 'network') {
      setChangeError("Couldn't reach the server. Check your connection and try again.")
    }
    else {
      setChangeError('Something went wrong. Please try again.')
    }
  }

  const initials = `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase() || '?'

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      <ScrollView contentContainerStyle={{padding: space.lg}} keyboardShouldPersistTaps="handled">

        <Dialog.Container visible={visible}>
          <Dialog.Title>Confirm with Password</Dialog.Title>
          <Dialog.Description>
            Please input your password to update account info.
          </Dialog.Description>
          <Dialog.Input placeholder={"Password"} onChangeText={setPassword}/>
          <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
          <Dialog.Button label="Confirm" onPress={checkPassword} />
        </Dialog.Container>

        <Dialog.Container visible={changeVisible}>
          <Dialog.Title>Change password</Dialog.Title>
          <Dialog.Description>
            {changeError || 'Enter your current password and a new one (at least 8 characters).'}
          </Dialog.Description>
          <Dialog.Input placeholder="Current password" secureTextEntry autoCapitalize="none"
            value={currentPassword} onChangeText={setCurrentPassword}/>
          <Dialog.Input placeholder="New password" secureTextEntry autoCapitalize="none"
            value={newPassword} onChangeText={setNewPassword}/>
          <Dialog.Input placeholder="Confirm new password" secureTextEntry autoCapitalize="none"
            value={confirmNewPassword} onChangeText={setConfirmNewPassword}/>
          <Dialog.Button label="Cancel" onPress={() => setChangeVisible(false)} />
          <Dialog.Button label="Change" onPress={submitChangePassword} />
        </Dialog.Container>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={font.title}>{`${firstName} ${lastName}`.trim() || username}</Text>
          <Text style={font.caption}>@{username}</Text>
        </View>

        <Card>
          <InfoRow label="Email" value={email} editing={editEmail} onChangeText={setEmail}
            onEdit={doEditEmail} onUndo={() => { setEmail(prevEmail); setEditEmail(false) }} keyboardType="email-address"/>
          <InfoRow label="First name" value={firstName} editing={editFirstName} onChangeText={setFirstName}
            onEdit={doEditFirstName} onUndo={() => { setFirstName(prevFirstName); setEditFirstName(false) }}/>
          <InfoRow last label="Last name" value={lastName} editing={editLastName} onChangeText={setLastName}
            onEdit={doEditLastName} onUndo={() => { setLastName(prevLastName); setEditLastName(false) }}/>
        </Card>

        <Card style={styles.scoresCard}>
          <View>
            <Text style={font.heading}>Saved scores</Text>
            <Text style={font.caption}>
              {(acftResults === undefined || acftResults.length === 0) ? 'None yet' : `${acftResults.length} saved`}
            </Text>
          </View>
          {(acftResults !== undefined && acftResults.length > 0) &&
            <Button variant="secondary" title="View all" onPress={goToAcftResults} style={{paddingVertical: 10}}/>
          }
        </Card>

        <Button
          variant="secondary"
          title="Change password"
          onPress={openChangePassword}
          style={{marginTop: space.md}}
        />
        <Button
          variant="secondary"
          title="Sign out"
          onPress={signOut}
          icon={faArrowRightFromBracket}
          style={{marginTop: space.sm}}
        />
        <Button
          variant="danger"
          title="Delete account"
          onPress={showConfirmDialog}
          icon={faTrash}
          iconSize={14}
          style={{marginTop: space.sm}}
        />
      </ScrollView>
      <ACFTBannerAd/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: space.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  avatarText: { color: colors.onGold, fontSize: 28, fontWeight: '800' },
  infoRow: { paddingVertical: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  infoLabel: { ...font.caption, marginBottom: 4 },
  valueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 28 },
  infoValue: { ...font.body, flex: 1 },
  editRow: { flexDirection: 'row', alignItems: 'center' },
  editInput: { flex: 1 },
  iconButton: { padding: space.sm, marginLeft: 2 },
  scoresCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.md },
});

Profile.navigationOptions = screenProps => ({
  title: "Profile",
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
