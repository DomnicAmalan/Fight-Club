import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Dimensions, TextInput, Button, PickerIOSItem } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth, { AppleAuthRequestScope, AppleAuthRequestOperation } from '@invertase/react-native-apple-authentication';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { NavigationContainer, CommonActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import countries from '../constants/countries'

const DashboardStack = createStackNavigator();


const GOOGLE_CLIENT_ID = "736979816766-t7pljfne534v2o29v7d0hpbkg57tesdc.apps.googleusercontent.com"
GoogleSignin.configure({
    webClientId: GOOGLE_CLIENT_ID,
});

const SignInTabs = (props, {navigation}) => {
    let resp = null;
    const CallSignInMethod = async(type) => {
        if(type == "GOOGLE"){
            resp = await GoogleButtonPress()
        }
        else if(type == "APPLE"){
            resp = await AppleButtonPress()
        }
        else if(type == "FACEBOOK"){
            resp = await FacebookButtonPress()
        }
    }
    console.log(resp, "yes")
    
    return(
        <TouchableOpacity style={tabStyle.tab} onPress={() => CallSignInMethod(props.navigation)}>
            <View style={tabStyle.imageView}>
                <Image source={props.image} style={tabStyle.image}></Image>
            </View>
            <View style={tabStyle.titleView}>
                <Text style={tabStyle.title}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const AppleButtonPress = async() => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });
  
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }
  
    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  
    // Sign the user in with the credential
    const resp =  auth().signInWithCredential(appleCredential);
}

const GoogleButtonPress = async() => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    const resp =  await auth().signInWithCredential(googleCredential);
}


async function FacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    const resp =  await auth().signInWithCredential(facebookCredential);
}

const SignInScreen = ({navigation}) => {
    return(
        <View style={tabStyle.container}>
            <SignInTabs image={require('../assets/auth-logos/google-logo.png')} title={"CONTINUE WITH GOOGLE"} navigation={"GOOGLE"}/>
            <SignInTabs image={require('../assets/auth-logos/facebook.png')} title={"CONTINUE WITH FACEBOOK"} navigation={"FACEBOOK"}/>
            { Platform.OS =="ios" ? <SignInTabs image={require('../assets/auth-logos/apple.png')} title={"CONTINUE WITH APPLE"} navigation={"APPLE"} /> : null }
            <View><Text style={tabStyle.title}> - OR </Text></View>
            <TouchableOpacity style={tabStyle.tab} onPress={() => navigation.navigate('Phone') }>
                <View style={tabStyle.imageView}>
                    <Image source={require('../assets/auth-logos/mobile.png')} title={"CONTINUE WITH MOBILE"} style={tabStyle.image}></Image>
                </View>
                <View style={tabStyle.titleView}>
                    <Text style={tabStyle.title}>CONTINUE WITH MOBILE</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const  PhoneAuthScreen = () => {
  // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null)
    const [mobileNumber, setMobileNumber] = useState(null)
    const [code, setCode] = useState(null)
    const [mobileNumberError, setMobileNumberError] = useState(null)
    const [countryCode, setCountryCode] = useState(null)

  // Handle the button press
    async function signInWithPhoneNumber() {
        if(mobileNumber){
            if(!countryCode){
                setMobileNumberError("Please select your country code")
                setTimeout(() => {
                    setMobileNumberError(null);
                }, 3000)
            }
            else{
                let number = countryCode + mobileNumber
                const confirmation = await auth().signInWithPhoneNumber(number);
                setConfirm(confirmation)
            }
        }
        else{
            setMobileNumberError("Please Enter Mobile Number")
            setTimeout(() => {
                setMobileNumberError(null);
            }, 3000)
        }
    }

    const VerifyCode = async() => {
        try {
          const resp = await confirm.confirm(code);
          console.log(resp, "yes")
          
          return true
        } catch (error) {
          console.log('Invalid code.');
        }
    }

    const countryValues = () => {
        let country = []
        countries.forEach((ele) => {
            country.push(
                <Picker.Item key={ele["code"]} label={ele["flag"] + " " + ele["name"]} value={ele["dial_code"]} />
            )
        })
        return country
    }
    
    return (
        <View style={tabStyle.confirm}>
            <View style={tabStyle.Number}>
                <Picker
                    selectedValue={countryCode}
                    onValueChange={(itemValue, itemIndex) => setCountryCode(itemValue)}
                    style={tabStyle.picker}
                >
                    {countryValues()}
                </Picker>
                <TextInput
                    style={tabStyle.MobileNumberInput}
                    title="Phone Number Sign In"
                    onChangeText={(text)=>setMobileNumber(text)}
                    value={mobileNumber}
                    keyboardType={'phone-pad'}
                    editable={confirm ? false : true} selectTextOnFocus={confirm ? false: true} 
                />
                {mobileNumberError ? <View><Text style={tabStyle.error}>{mobileNumberError}</Text></View>: <View />}
                <TouchableOpacity  onPress={() =>  signInWithPhoneNumber()}><Text>Send</Text></TouchableOpacity>
            </View>
            {confirm ? 
            <View>
                <TextInput value={code} onChangeText={text => setCode(text)} />
                <Button title="Confirm Code" onPress={() => VerifyCode()} />
            </View> : null}
        </View>
    )
}


const tabStyle = StyleSheet.create({
    tab: {
        height: 40,
        width: 300,
        elevation: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "space-between",
        opacity: 3
    },
    image: {
        width: 25,
        height : 25,
    },
    imageView: {
        alignSelf: "center",
        paddingRight: 10,
        alignItems: "center",
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
        
    },
    title: {
        fontFamily: "neon",
        fontSize: 10,
        fontWeight: "bold",
        alignSelf: "center",
    },
    titleView:{
        alignSelf: "center",
        paddingHorizontal: 10,
    },
    confirm: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    MobileNumberInput: {
        elevation: 1,
        width: 250,
        height: 60,
        textAlign: "center",
        flexDirection: "row",
    },
    Number: {
        flexDirection: "column",
        alignItems: "center",
    },
    countryCode: {

    },
    error: {
        color: "red",
        fontFamily: "helvetica",
        fontSize: 7
    },
    picker: {
        height: 50,
        width: 300,
        
    }
})

const AuthRoute = () => {
    return(
        <NavigationContainer>
            <DashboardStack.Navigator mode='modal' headerMode='none'>
                <DashboardStack.Screen name="MainAuth" component={SignInScreen} />
                <DashboardStack.Screen name="Phone" component={PhoneAuthScreen} />
            </DashboardStack.Navigator>
        </NavigationContainer>
    )
}


export default AuthRoute;