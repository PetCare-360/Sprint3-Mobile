import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const VetDashboard = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Dashboard Veterinário (Placeholder)</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  text: { fontSize: 18, color: theme.colors.text },
});
