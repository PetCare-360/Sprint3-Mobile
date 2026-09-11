import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
          <Text style={{ color: colors.danger }}>Não foi possível carregar as consultas, pets ou veterinários.</Text>
          <Button title="Tentar novamente" onPress={() => appointments.refetch()} variant="outline" />
        </View>
      )}
      <FlatList
        data={appointments.isError ? [] : appointments.appointments}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ padding: spacing.lg }}
        ListHeaderComponent={
          <Card padding="md" style={styles.form}>
            <Text style={[styles.title, { color: colors.text }]}> 
              {appointments.editingId !== null ? 'Editar consulta' : 'Solicitar consulta'}
            </Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Pet</Text>
            <View style={styles.optionsGrid}>
              {appointments.patients.map(pet => (
                <Pressable
                  key={pet.id}
                  onPress={() => appointments.setPetId(pet.id)}
                  style={[
                    styles.option,
                    { borderColor: colors.border, backgroundColor: colors.card },
                    appointments.petId === pet.id && { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
                  ]}
                >
                  <Text style={{ color: appointments.petId === pet.id ? colors.primary : colors.text, fontWeight: '600' }}>
                    {pet.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Veterinário</Text>
            <View style={styles.optionsGrid}>
              {appointments.veterinarians.map(veterinarian => (
                <Pressable
                  key={String(veterinarian.id)}
                  onPress={() => appointments.setVeterinarianId(String(veterinarian.id))}
                  style={[
                    styles.option,
                    { borderColor: colors.border, backgroundColor: colors.card },
                    appointments.veterinarianId === String(veterinarian.id) && { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
                  ]}
                >
                  <Text style={{ color: appointments.veterinarianId === String(veterinarian.id) ? colors.primary : colors.text, fontWeight: '600' }}>
                    {veterinarian.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {appointments.patients.length === 0 && !appointments.isLoading && (
              <Text style={{ color: colors.textSecondary, marginBottom: spacing.md }}>Nenhum pet disponível para agendamento.</Text>
            )}

            {appointments.veterinarians.length === 0 && !appointments.isLoading && (
              <Text style={{ color: colors.textSecondary, marginBottom: spacing.md }}>Nenhum veterinário disponível para agendamento.</Text>
            )}

            <Input
              label="Data e hora"
              placeholder="20/12/2026 14:00"
              value={appointments.scheduledAt}
              onChangeText={appointments.setScheduledAt}
              autoCapitalize="none"
            />
            <Input label="Motivo" placeholder="Ex.: consulta de rotina" value={appointments.reason} onChangeText={appointments.setReason} />
            <Button
              title={appointments.editingId !== null ? 'Salvar alterações' : 'Solicitar'}
              onPress={appointments.create}
              loading={appointments.isLoading}
              disabled={!appointments.petId || !appointments.veterinarianId}
            />
            {appointments.editingId !== null && (
              <Button title="Cancelar edição" onPress={appointments.cancelEdit} variant="ghost" style={{ marginTop: 8 }} />
            )}
          </Card>
        }
        renderItem={({ item }) => (
          <Card padding="md" style={styles.item}>
            <Text style={[styles.title, { color: colors.text }]}>{item.petName}</Text>
            <Text style={{ color: colors.textSecondary }}>{item.veterinarianName}</Text>
            <Text style={{ color: colors.textSecondary }}>{new Date(item.scheduledAt).toLocaleString()}</Text>
            <Text style={{ color: colors.textSecondary }}>{item.reason} · {item.status}</Text>
            {item.status !== 'FINISHED' && item.status !== 'CANCELLED' && (
              <>
                <Button title="Finalizar" onPress={() => appointments.finish(item.id)} loading={appointments.isLoading} />
                <Button title="Editar" onPress={() => appointments.startEdit(item)} variant="secondary" loading={appointments.isLoading} style={{ marginTop: 8 }} />
              </>
            )}
            <Button title="Excluir" onPress={() => appointments.remove(item.id, item.petName)} loading={appointments.isLoading} variant="outline" style={{ marginTop: 8 }} />
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
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  option: { borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11 },
  errorContainer: { padding: 16, gap: 8 },
});
