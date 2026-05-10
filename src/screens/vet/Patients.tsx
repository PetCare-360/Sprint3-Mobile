import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert as RNAlert, Image, KeyboardAvoidingView, Platform} from 'react-native';
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
  const { colors, spacing, typography, radius, isDark, shadows } = useTheme();
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

  const renderPatient = ({ item }: { item: Pet & { status: RiskLevel } }) => {
    const statusColor = AlertService.getStatusColor(item.status);
    
    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('PetDetails', { petId: item.id })}
        activeOpacity={0.8}
      >
        <Card style={styles.patientCard} variant="elevated" padding="md">
          <View style={styles.cardHeader}>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={[styles.listPetImage, { borderRadius: radius.md }]} />
              <View style={[styles.statusDot, { backgroundColor: statusColor, borderColor: colors.card }]} />
            </View>
            <View style={styles.patientInfo}>
              <Text style={[styles.patientName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.patientBreed, { color: colors.textSecondary }]}>{item.breed}</Text>
              <View style={[styles.collarBadge, { backgroundColor: colors.primary + '10' }]}>
                <Text style={[styles.collarId, { color: colors.primary }]}>ID: {item.collarId}</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => handleDeletePatient(item.id, item.name)}
              style={[styles.deleteButton, { backgroundColor: colors.danger + '10' }]}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
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
        rightElement={
          <TouchableOpacity 
            onPress={() => setIsModalVisible(true)} 
            style={styles.addButton}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={26} color={colors.text} />
          </TouchableOpacity>
        }
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
      </View>

      <FlatList
        data={filteredPatients as any}
        keyExtractor={(item) => item.id}
        renderItem={renderPatient}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.divider + '20' }]}>
              <MaterialCommunityIcons name="dog-variant" size={60} color={colors.divider} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text, fontWeight: 'bold', marginTop: 16 }]}>Nenhum paciente</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>Tente buscar por outro nome ou raça.</Text>
          </View>
        }
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Novo Paciente</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Importe os dados do paciente vinculando o ID da coleira inteligente PetCare 360.
            </Text>
            
            <Input
              label="ID DA COLEIRA"
              placeholder="Ex: COL-12345"
              value={collarId}
              onChangeText={setCollarId}
              autoCapitalize="characters"
              icon={<MaterialCommunityIcons name="qrcode-scan" size={20} color={colors.primary} />}
            />

            <Button 
              title="Vincular Dispositivo" 
              onPress={handleAddPatient}
              loading={isLoading}
              style={{ marginTop: 8 }}
            />
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
  addButton: {
    padding: 4,
  },
  searchWrapper: {
    marginTop: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 52,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      }
    })
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  patientCard: {
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  listPetImage: {
    width: 64,
    height: 64,
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
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
    borderRadius: 8,
    marginTop: 8,
  },
  collarId: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    marginBottom: 0,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
});
