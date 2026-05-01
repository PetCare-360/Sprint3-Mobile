import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const HealthScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Detalhes de Saúde</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  title: { fontSize: 20, color: theme.colors.text, fontWeight: 'bold' }
});
