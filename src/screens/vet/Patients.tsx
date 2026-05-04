import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert as RNAlert,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';
import { useTheme } from '../../hooks/useTheme';
import { AlertService } from '../../services/alertService';
import { PatientService } from '../../services/patientService';
import { Pet, RiskLevel } from '../../types/pet';

export const Patients = ({ navigation }: any) => {
  const { colors, spacing, typography, radius } = useTheme();
  const [patients, setPatients] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [collarId, setCollarId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadPatients = useCallback(async () => {
    const data = await PatientService.getPatients();
    setPatients(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [loadPatients])
  );

  const handleAddPatient = async () => {
    if (!collarId.trim()) {
      RNAlert.alert('Erro', 'Por favor, digite o ID da coleira.');
      return;
    }

    setIsLoading(true);
    try {
      await PatientService.addPatient(collarId);
      await loadPatients();
      setIsModalVisible(false);
      setCollarId('');
      RNAlert.alert('Sucesso', 'Paciente vinculado com sucesso.');
    } catch {
      RNAlert.alert('Erro', 'Não foi possível vincular o paciente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = (id: string, name: string) => {
    RNAlert.alert(
      'Remover Paciente',
      `Deseja realmente remover ${name} da sua lista de pacientes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: async () => {
            await PatientService.removePatient(id);
            await loadPatients();
          }
        }
      ]
    );
  };

  const filteredPatients = patients
    .filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.breed.toLowerCase().includes(search.toLowerCase())
    )
    .map(p => ({
      ...p,
      status: AlertService.calculateRiskLevel({
        temperature: p.temperature,
        heartRate: p.heartRate,
        activity: p.activity
      })
    }))
    .sort((a, b) => {
      const priority: Record<RiskLevel, number> = { critical: 0, warning: 1, stable: 2 };
      return priority[a.status as RiskLevel] - priority[b.status as RiskLevel];
    });

  const renderPatient = ({ item }: { item: Pet & { status: RiskLevel } }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('PetDetails', { petId: item.id })}
      activeOpacity={0.7}
    >
      <Card style={styles.patientCard} variant="elevated" padding="md">
        <View style={styles.cardHeader}>
          <Image source={item.image} style={[styles.listPetImage, { borderRadius: radius.sm }]} />
          <View style={styles.patientInfo}>
            <Text style={[styles.patientName, { color: colors.text, fontSize: typography.sizes.md }]}>{item.name}</Text>
            <Text style={[styles.patientBreed, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>{item.breed}</Text>
            <View style={[styles.collarBadge, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.collarId, { color: colors.primary, fontSize: typography.sizes.xs }]}>ID: {item.collarId}</Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <View style={[styles.statusIndicator, { backgroundColor: AlertService.getStatusColor(item.status) }]} />
            <TouchableOpacity 
              onPress={() => handleDeletePatient(item.id, item.name)}
              style={[styles.deleteButton, { backgroundColor: colors.danger + '10', borderRadius: radius.xs }]}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Meus Pacientes" 
        showBack 
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity 
            onPress={() => setIsModalVisible(true)} 
            style={styles.settingsButton}
          >
            <MaterialCommunityIcons name="plus" size={24} color={colors.white} />
          </TouchableOpacity>
        }
      />

      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar por nome ou raça..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <FlatList
        data={filteredPatients as any}
        keyExtractor={(item) => item.id}
        renderItem={renderPatient}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="dog-variant" size={60} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum paciente encontrado.</Text>
          </View>
        }
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent} variant="elevated" padding="lg">
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: typography.sizes.xl }]}>Vincular Nova Coleira</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary, marginBottom: spacing.lg }]}>
              Digite o ID da coleira inteligente para importar os dados do pet para sua lista.
            </Text>
            
            <Input
              label="ID da Coleira"
              placeholder="Ex: COL-123"
              value={collarId}
              onChangeText={setCollarId}
              autoCapitalize="characters"
              icon={<MaterialCommunityIcons name="tag-outline" size={20} color={colors.textSecondary} />}
            />

            <View style={styles.modalActions}>
              <Button 
                title="Vincular Paciente" 
                onPress={handleAddPatient}
                loading={isLoading}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20,
    height: 50,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  patientCard: {
    marginBottom: 12,
  },
  listPetImage: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
  },
  patientBreed: {
    marginBottom: 4,
  },
  collarBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  collarId: {
    fontWeight: 'bold',
  },
  cardActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  modalSubtitle: {
    lineHeight: 20,
  },
  modalActions: {
    marginTop: 8,
  },
});
