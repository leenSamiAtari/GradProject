import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Welcome from './screens/Welcome';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import Home from './screens/Home'; 
import ClosestBusStation from './screens/ClosestBusStation';
import Feedback from './screens/Feedback';
import ReportMissing from './screens/ReportMissing';
import Notifications from './screens/Notifications';
import UpdateSchedule from './screens/UpdateSchedule';
import busSchedule from './screens/busSchedule'
import updateBus from './screens/updateBus'
import BusDetails from './screens/BusDetails'
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome}  options={{ headerShown: false,  headerTitle: '    ' }} />
        <Stack.Screen name="SignUp" component={SignUp}  
       options={{
         headerTitle: '     ',
        headerTransparent: false,
        headerTintColor: 'black',  // To change the color of any text/icon in the header
      }}
       />
        <Stack.Screen name="SignIn" component={SignIn} 
         options={{
           headerTitle: '   ',
          headerTransparent: false,
          headerTintColor: 'black',  // To change the color of any text/icon in the header
        }}
      />

        <Stack.Screen name="Home" component={Home}
        options={{
          headerTitle: '   ',
         headerTransparent: false,
         headerTintColor: 'black',  // To change the color of any text/icon in the header
       }}
        />
        <Stack.Screen name="busSchedule" component={busSchedule}
         options={{
          headerTitle: '   ',
         headerTransparent: false,
         headerTintColor: 'black',  // To change the color of any text/icon in the header
       }} />
        <Stack.Screen name="UpdateSchedule" component={UpdateSchedule}
         options={{
          headerTitle: '   ',
         headerTransparent: false,
         headerTintColor: 'black',  // To change the color of any text/icon in the header
       }} />
        <Stack.Screen name="updateBus" component={updateBus}
         options={{
          headerTitle: '   ',
         headerTransparent: false,
         headerTintColor: 'black',  // To change the color of any text/icon in the header
       }} />
        <Stack.Screen name="BusDetails" component={BusDetails} 
         options={{
          headerTitle: '   ',
         headerTransparent: false,
         headerTintColor: 'black',  // To change the color of any text/icon in the header
       }}/>
         <Stack.Screen name="ClosestBusStation" component={ClosestBusStation} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="ReportMissing" component={ReportMissing} />
        
        <Stack.Screen name="Notifications" component={Notifications} />
        

     </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>

  );
};

const DrawerMenu = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Closest Bus Station" component={ClosestBusStation} />
      <Drawer.Screen name="Report Missing Items" component={ReportMissing} />
      <Drawer.Screen name="Bus Schedule" component={BusSchedule} />
      <Drawer.Screen name="Feedback" component={Feedback} />
    </Drawer.Navigator>
  );
};

export default App;