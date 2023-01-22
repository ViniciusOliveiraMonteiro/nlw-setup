import './src/lib/dayjs';
import { StatusBar, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Routes } from './src/routes';

function App(): JSX.Element {
  SplashScreen.hide();
  return (
    <>
      <Routes/>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
    </>
  );
}

export default App;
