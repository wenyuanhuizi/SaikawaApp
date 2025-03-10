import {DarkTheme, DefaultTheme} from '@react-navigation/native';

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    primary: '#427a6f',
    notification: '#ff0000',
    text: '#3d5875',
    card: '#f7f7f0',
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    primary: '#6AB0A8',
    text: '#ffffff',
    card: '#1a1a1a',
  },
};

export const FontSizes = {
  title: 26,
  description: 18,
};
