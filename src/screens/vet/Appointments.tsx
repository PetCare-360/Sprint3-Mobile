import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { useAppointments } from '../../hooks/useAppointments';
import { useTheme } from '../../hooks/useTheme';

export const Appointments = ({ navigation }: any) => {
  const { colors, spacing } = useTheme();
  const appointments = useAppointments();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Consultas" showBack onBack={() => navigation.goBack()} />
      {appointments.isError && (
        <View style={styles.errorContainer}>
          <Text style={{ color: colors.danger }}>Não foi possível carregar as consultas.</Text>
          <Button title="Tentar novamente" onPress={() => appointments.refetch()} variant="outline" />
        </View>
      )}
      <FlatList
        data={appointments.isError ? [] : appointments.appointments}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ padding: spacing.lg }}
        ListHeaderComponent={
          <Card padding="md" style={styles.form}>
            <Text style={[styles.title, { color: colors.text }]}>Solicitar consulta</Text>
            <Input label="ID do pet" value={appointments.petId} onChangeText={appointments.setPetId} keyboardType="numeric" />
            <Input label="ID do veterinário" value={appointments.veterinarianId} onChangeText={appointments.setVeterinarianId} keyboardType="numeric" />
            <Input label="Data e hora (ISO)" placeholder="2026-12-20T14:00:00-03:00" value={appointments.scheduledAt} onChangeText={appointments.setScheduledAt} />
            <Input label="Motivo" value={appointments.reason} onChangeText={appointments.setReason} />
            <Button title="Solicitar" onPress={appointments.create} loading={appointments.isLoading} />
          </Card>
        }
        renderItem={({ item }) => (
          <Card padding="md" style={styles.item}>
            <Text style={[styles.title, { color: colors.text }]}>{item.petName}</Text>
            <Text style={{ color: colors.textSecondary }}>{new Date(item.scheduledAt).toLocaleString()}</Text>
            <Text style={{ color: colors.textSecondary }}>{item.reason} - {item.status}</Text>
            {item.status !== 'FINISHED' && (
              <Button title="Finalizar" onPress={() => appointments.finish(item.id)} loading={appointments.isLoading} />
            )}
            <Button title="Excluir" onPress={() => appointments.remove(item.id, item.petName)} loading={appointments.isLoading} variant="outline" />
          </Card>
        )}
        ListEmptyComponent={appointments.isLoading ? <ActivityIndicator color={colors.primary} /> : <Text style={{ color: colors.textSecondary }}>Nenhuma consulta encontrada.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { marginBottom: 20 },
  item: { marginBottom: 12 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  errorContainer: { padding: 16, gap: 8 },
});
