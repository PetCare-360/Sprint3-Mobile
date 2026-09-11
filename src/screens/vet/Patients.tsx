import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useTheme } from '../../hooks/useTheme';
import { usePatients } from '../../hooks/usePatients';
import { AlertService } from '../../services/alertService';
import { Pet, RiskLevel } from '../../types/pet';

export const Patients = ({ navigation }: any) => {
  const { colors, spacing, isDark } = useTheme();
  const {
    search,
    setSearch,
    filteredPatients,
    isLoading,
    isModalVisible,
    setIsModalVisible,
    collarId,
    setCollarId,
    patientName,
    setPatientName,
    breed,
    setBreed,
    species,
    setSpecies,
    age,
    setAge,
    weight,
    setWeight,
    editingPatient,
    handleAddPatient,
    handleEditPatient,
    handleNewPatient,
    handleDeletePatient,
  } = usePatients();

  const closeModal = () => {
    if (!isLoading) setIsModalVisible(false);
  };

  const renderPatient = ({ item }: { item: Pet & { status: RiskLevel } }) => {
    const statusColor = AlertService.getStatusColor(item.status);
    const speciesIcon = item.species?.toLowerCase() === 'cat' || item.species?.toLowerCase() === 'gato' ? 'cat' : 'dog';

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PetDetails', { petId: item.id })}
        activeOpacity={0.8}
      >
        <Card style={styles.patientCard} variant="elevated" padding="md">
          <View style={styles.cardHeader}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + '12' }]}>
                <MaterialCommunityIcons name={speciesIcon} size={32} color={colors.primary} />
              </View>
              <View style={[styles.statusDot, { backgroundColor: statusColor, borderColor: colors.card }]} />
            </View>

            <View style={styles.patientInfo}>
              <Text style={[styles.patientName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.patientBreed, { color: colors.textSecondary }]}>
                {item.breed}{item.species ? ` • ${item.species}` : ''}
              </Text>
              <View style={[styles.collarBadge, { backgroundColor: colors.primary + '10' }]}>
                <Text style={[styles.collarId, { color: colors.primary }]}>Coleira: {item.collarId || 'Não informada'}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary + '12' }]}
                onPress={() => handleEditPatient(item)}
                accessibilityLabel={`Editar ${item.name}`}
              >
                <MaterialCommunityIcons name="pencil-outline" size={19} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.danger + '12' }]}
                onPress={() => handleDeletePatient(item.id, item.name)}
                disabled={isLoading}
                accessibilityLabel={`Excluir ${item.name}`}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={19} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Pacientes"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.searchWrapper, { paddingHorizontal: spacing.lg }]}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? colors.surface : colors.white, borderColor: colors.divider }]}>
          <MaterialCommunityIcons name="magnify" size={22} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar paciente..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <Button
          title="Novo paciente"
          onPress={handleNewPatient}
          icon={<MaterialCommunityIcons name="plus" size={20} color={colors.white} />}
          style={styles.addButton}
        />
      </View>

      {isLoading && filteredPatients.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando pacientes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPatients as any}
          keyExtractor={(item) => item.id}
          renderItem={renderPatient}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.divider + '20' }]}>
                <MaterialCommunityIcons name="dog" size={60} color={colors.divider} />
              </View>
              <Text style={[styles.emptyText, { color: colors.text, fontWeight: 'bold', marginTop: 16 }]}>Nenhum paciente</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
                {search ? 'Tente buscar por outro nome ou raça.' : 'Cadastre o primeiro paciente para começar.'}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.divider }]} />

            <View style={styles.modalHeader}>
              <View style={styles.modalTitleWrapper}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {editingPatient ? 'Editar paciente' : 'Novo paciente'}
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  {editingPatient ? 'Atualize os dados cadastrados.' : 'Cadastre os dados do paciente e da coleira.'}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal} disabled={isLoading}>
                <MaterialCommunityIcons name="close" size={25} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.formContent}
            >
              <Input
                label="Nome"
                value={patientName}
                onChangeText={setPatientName}
                placeholder="Ex.: Thor"
                autoCapitalize="words"
              />

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Input
                    label="Espécie"
                    value={species}
                    onChangeText={setSpecies}
                    placeholder="Cão ou gato"
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.formField}>
                  <Input
                    label="Raça"
                    value={breed}
                    onChangeText={setBreed}
                    placeholder="Ex.: Labrador"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Input
                    label="Idade"
                    value={age}
                    onChangeText={setAge}
                    placeholder="Em anos"
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.formField}>
                  <Input
                    label="Peso"
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Em kg"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <Input
                label="ID da coleira"
                value={collarId}
                onChangeText={setCollarId}
                placeholder="Ex.: COLLAR-001"
                autoCapitalize="characters"
              />

              <Button
                title={editingPatient ? 'Salvar alterações' : 'Cadastrar paciente'}
                onPress={handleAddPatient}
                loading={isLoading}
                disabled={isLoading}
                icon={<MaterialCommunityIcons name={editingPatient ? 'content-save-outline' : 'plus'} size={20} color={colors.white} />}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    marginTop: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 22,
    height: 52,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 12,
  },
  patientCard: {
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
    minWidth: 0,
  },
  patientName: {
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  patientBreed: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
  },
  collarBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 7,
  },
  collarId: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actions: {
    marginLeft: 8,
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
  },
  emptySub: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    maxHeight: '92%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modalTitleWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  closeBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  formContent: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formField: {
    flex: 1,
  },
});
