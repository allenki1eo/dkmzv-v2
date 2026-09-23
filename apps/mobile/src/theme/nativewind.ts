import { StyleSheet } from 'react-native';

const sheet = StyleSheet as typeof StyleSheet & {
  setFlag?: (key: string, value: string) => void;
};
sheet.setFlag?.('darkMode', 'class');
