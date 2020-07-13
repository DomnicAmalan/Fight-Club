import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth, { AppleAuthRequestScope, AppleAuthRequestOperation } from '@invertase/react-native-apple-authentication';
import { LoginManager, AccessToken } from 'react-native-fbsdk';



const GOOGLE_CLIENT_ID = "736979816766-t7pljfne534v2o29v7d0hpbkg57tesdc.apps.googleusercontent.com"
GoogleSignin.configure({
    webClientId: GOOGLE_CLIENT_ID,
});

const SignInTabs = (props) => {
    let resp = null
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
        else if(type == "MOBILE"){
             
        }
    }
    console.log(resp)
    
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
    console.log(resp)
    return resp
}

const GoogleButtonPress = async() => {
    console.log("yes")
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    const resp =  await auth().signInWithCredential(googleCredential);
    console.log(resp)
    return resp
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
    const resp =  auth().signInWithCredential(facebookCredential);
    console.log(resp)
    return resp
}

const SignInScreen = () => {
      
    return(
        <View style={tabStyle.container}>
            <SignInTabs image={require('../assets/auth-logos/google-logo.png')} title={"CONTINUE WITH GOOGLE"} navigation={"GOOGLE"}/>
            <SignInTabs image={require('../assets/auth-logos/facebook.png')} title={"CONTINUE WITH FACEBOOK"} navigation={"FACEBOOK"}/>
            { Platform.OS =="ios" ? <SignInTabs image={require('../assets/auth-logos/apple.png')} title={"CONTINUE WITH APPLE"} navigation={"APPLE"} /> : null }
            <SignInTabs image={require('../assets/auth-logos/mobile.png')} title={"CONTINUE WITH MOBILE"} navigation={"MOBILE"}/>
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
    }
})


export default SignInScreen;