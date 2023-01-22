import { createNativeStackNavigator } from '@react-navigation/native-stack';
const { Navigator, Screen } = createNativeStackNavigator();

import { Home } from '../screens/Home/Home';
import { NewHabit } from '../screens/NewHabit/NewHabit';
import { Habit } from '../screens/Habit/Habit';

export function AppRoutes(){
  return(
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
        name='home'
        component={Home}
      />

      <Screen
        name='habit'
        component={Habit}
      />

      <Screen
        name='newHabit'
        component={NewHabit}
      />
    </Navigator>
  );
}