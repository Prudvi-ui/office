import React, { View, Text } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import Splash from './Asserts/Screens/Splash';
import Login from './Asserts/Screens/Login';
import Clients from './Asserts/Screens/Clients';
import Categories from './Asserts/Screens/Categories';
import Marketing from './Asserts/Screens/Marketing';
import DigitalMaketing from './Asserts/Screens/DigitalMaketing';
import AppDevelopment from './Asserts/Screens/AppDevelopment';
import WebDevelopment from './Asserts/Screens/WebDevelopment';
import SingleEmployee from './Asserts/Screens/SingleEmployee';
import SingleClient from './Asserts/Screens/SingleClient';
import Notification from './Asserts/Screens/Notification';
import AppAndWeb from './Asserts/Screens/AppAndWeb';
import PastProjects from './Asserts/Screens/PastProjects';
import ActiveProjects from './Asserts/Screens/ActiveProjects';
import Employees from './Asserts/Screens/Employees';
import AWActive from './Asserts/Screens/AWActive';
import AWPast from './Asserts/Screens/AWPast';
import AActive from './Asserts/Screens/AActive';
import APast from './Asserts/Screens/APast';
import WActive from './Asserts/Screens/WActive';
import WPast from './Asserts/Screens/WPast';
import MarketingList from './Asserts/Screens/MarketingList';
import Employeecategories from './Asserts/Screens/Employeecategories';
import Epmprofile from './Asserts/Screens/Epmprofile'
import Employeeattendance from './Asserts/Screens/Employeeattendance'
import Leaverequest from './Asserts/Screens/Leaverequest'
import Projects from './Asserts/Screens/Projects'
import Emptasks from './Asserts/Screens/Emptasks'
import holiday from './Asserts/Screens/holiday'
import Notices from './Asserts/Screens/Notices'
import Support from './Asserts/Screens/Support'
import Performance from './Asserts/Screens/Performance'
import Settings from './Asserts/Screens/Settings'
import Changepassword from './Asserts/Screens/Changepassword'
import Salarydetails from './Asserts/Screens/Salarydetails'
import signup from './Asserts/Screens/Signup'
const Stack = createStackNavigator();
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: 'white', borderRadius: 20 }} // light green bg
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#001F54' }}
      text2Style={{ fontSize: 14, color: '#001F54' }}
      text2NumberOfLines={3}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{ backgroundColor: '#dd4f5bff', borderRadius: 20, height: 80 }} // light red bg
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '' }}
      text2Style={{ fontSize: 14, color: 'white' }}
      text2NumberOfLines={3}
    />
  ),

  customToast: ({ text1, text2 }) => (
    <View
      style={{
        width: '90%',
        padding: 12,
        borderRadius: 10,
        backgroundColor: 'navy', // 🔵 blue background
        alignSelf: 'center',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{text1}</Text>
      <Text style={{ color: 'white', fontSize: 14 }}>{text2}</Text>
    </View>
  ),
};
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Clients" component={Clients} />
          <Stack.Screen name="Marketing" component={Marketing} />
          <Stack.Screen name="Categories" component={Categories} />
          <Stack.Screen name="DigitalMaketing" component={DigitalMaketing} />
          <Stack.Screen name="AppDevelopment" component={AppDevelopment} />
          <Stack.Screen name="WebDevelopment" component={WebDevelopment} />
          <Stack.Screen name="ActiveProjects" component={ActiveProjects} />
          <Stack.Screen name="PastProjects" component={PastProjects} />
          <Stack.Screen name="AppAndWeb" component={AppAndWeb} />
          <Stack.Screen name="Employees" component={Employees} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="SingleClient" component={SingleClient} />
          <Stack.Screen name="SingleEmployee" component={SingleEmployee} />
          <Stack.Screen name="AWActive" component={AWActive} />
          <Stack.Screen name="AWPast" component={AWPast} />
          <Stack.Screen name="WActive" component={WActive} />
          <Stack.Screen name="WPast" component={WPast} />
          <Stack.Screen name="AActive" component={AActive} />
          <Stack.Screen name="APast" component={APast} />
          <Stack.Screen name="MarketingList" component={MarketingList} />
          <Stack.Screen name="Employeecategories" component={Employeecategories} />
          <Stack.Screen name="Epmprofile" component={Epmprofile} />
          <Stack.Screen name="Employeeattendance" component={Employeeattendance} />
          <Stack.Screen name="Leaverequest" component={Leaverequest} />
          <Stack.Screen name="Projects" component={Projects} />
          <Stack.Screen name="Emptasks" component={Emptasks} />
          <Stack.Screen name="holiday" component={holiday} />
          <Stack.Screen name="Notices" component={Notices} />
          <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name="Performance" component={Performance} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Changepassword" component={Changepassword} />
          <Stack.Screen name="Salarydetails" component={Salarydetails} />
          <Stack.Screen name="signup" component={signup} />





        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} position="top" />

    </>
  );
}
