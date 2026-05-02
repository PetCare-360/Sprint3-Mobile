import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { NotificationItem } from '../components/NotificationItem';

const ALERTS_DATA = [
  {
    id: '1',
    title: 'Batimentos Elevados',
    message: 'O coração do seu pet está batendo mais rápido que o normal (125 bpm).',
    time: 'Há 5 min',
    type: 'danger' as const,
  },
  {
    id: '2',
    title: 'Bateria Fraca',
    message: 'A coleira está com 15% de bateria. Carregue em breve.',
    time: 'Há 1 hora',
    type: 'warning' as const,
  },
  {
    id: '3',
    title: 'Meta de Passos',
    message: 'Parabéns! Max atingiu a meta diária de 5.000 passos.',
    time: 'Há 3 horas',
    type: 'success' as const,
  },
  {
    id: '4',
    title: 'Atualização de Firmware',
    message: 'Uma nova versão do software da coleira está disponível.',
    time: 'Ontem',
    type: 'info' as const,
  },
];

export const AlertsScreen = () => {
  const { theme, isDark } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Alertas</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Acompanhe o que está acontecendo com seu pet
        </Text>
      </View>
      
      <FlatList
        data={ALERTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            title={item.title}
            message={item.message}
            time={item.time}
            type={item.type}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 40,
    paddingTop: 8,
  },
});
