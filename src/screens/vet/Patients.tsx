import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Platform} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { useTheme } from '../../hooks/useTheme';
import { usePatients } from '../../hooks/usePatients';
import { AlertService } from '../../services/alertService';
import { Pet, RiskLevel } from '../../types/pet';

export const Patients = ({ navigation }: any) => {
  const { colors, spacing, radius, isDark } = useTheme();
  const {
    search,
    setSearch,
    filteredPatients,
  } = usePatients();

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
              <MaterialCommunityIcons name="dog" size={60} color={colors.divider} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text, fontWeight: 'bold', marginTop: 16 }]}>Nenhum paciente</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>Tente buscar por outro nome ou raça.</Text>
          </View>
        }
      />

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
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formField: {
    flex: 1,
  },
});
