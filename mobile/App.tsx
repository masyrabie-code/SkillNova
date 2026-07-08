import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CoursesScreen from './screens/CoursesScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  useEffect(() => {
    // Initialize i18n
    i18n.init();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4F46E5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'SkillNova' }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="Courses"
            component={CoursesScreen}
            options={{ title: 'Courses' }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ title: 'AI Assistant' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default App;
