import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/MaterialIcons';

const DashboardStack = createStackNavigator();

const Player = ({navigation}) => {
    return(
        <TouchableOpacity onPress={() => navigation.navigate('Cards') }><Text>Player</Text></TouchableOpacity>
    )
}

const Cards = () => {
    return(
        <View><Text>Cards</Text></View>
    )
}

const Robo = () => {
    return(
        <View><Text>Robo</Text></View>
    )
}
const DashboardScreen = ({navigation}) => {
    const Tes = () => {
        console.log("yes")
    }
    return(
        <>
            <View style={AppStyle.topNav}>
                <Text>LOGO_HERE</Text>
            </View>
            <View style={AppStyle.body}>
                <DashboardRoute />
            </View>
            <TouchableOpacity style={AppStyle.BottomTab}>
                <Icon onPress={() => navigation.navigate("Card")} name="visibility" color={"black"} size={40}/>
                <Icon onPress={() => Tes()} name="visibility" color={"black"} size={40}/>
                <Icon onPress={() => Tes()} name="visibility" color={"black"} size={40}/>
                {/* <View onPress={() => Tes()}><Icon name="visibility" color={"black"} size={40}/></TouchableOpacity>
                <Viewress={() => Tes()}><Icon name="visibility" color={"black"} size={40}/></TouchableOpacity>
                <TouchableOpacity onPress={() => Tes()}><Icon name="visibility" color={"black"} size={40}/></TouchableOpacity> */}
            </TouchableOpacity>
            
        </>
    )
}



const AppStyle = StyleSheet.create({
    topNav: {
        width: Dimensions.get('window').width,
        backgroundColor: "#fbfdfe",
        height: 40,
        elevation: 3
    },
    body:{
        flex: 1
    },
    BottomTab: {
        width: 200,
        height: 50,
        bottom: 20,
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "rgba(52, 52, 52, 0.8)",
        borderRadius: 30,
        justifyContent: "space-around",
        position: "absolute",
        alignItems: "center"
    }
})

const DashboardRoute = () => {
    return(
        <NavigationContainer>
            <DashboardStack.Navigator mode="modal" headerMode='none'>
                <DashboardStack.Screen name="Player" component={Player} />
                <DashboardStack.Screen name="Cards" component={Cards} />
            </DashboardStack.Navigator>
        </NavigationContainer>
    )
}

export default DashboardScreen;