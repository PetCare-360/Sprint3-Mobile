import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Home (Resumo do Pet)</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  title: { fontSize: 20, color: theme.colors.text, fontWeight: 'bold' }
});
