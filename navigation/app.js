import React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from  '../screen/Home'
import Welcome from '../screen/Welcome'

const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Welcome" component={Welcome} />
        </Stack.Navigator>
    )
}

const app = () => {
    return (
        <NavigationContainer>
            {HomeStack()}
        </NavigationContainer>
    )
}

export default app
