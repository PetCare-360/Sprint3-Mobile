import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { ApiService, PetStatus } from '../services/api';
import { StorageService, PetData } from '../storage';
import { useTheme } from '../hooks/useTheme';
import { useFocusEffect } from '@react-navigation/native';

export const MapScreen = () => {
  const [status, setStatus] = useState<PetStatus | null>(null);
  const [localPet, setLocalPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const loadData = async () => {
    setLoading(true);
    const [apiStatus, storedPet] = await Promise.all([
      ApiService.getPetStatus('1'),
      StorageService.getPetData()
    ]);
    setStatus(apiStatus);
    setLocalPet(storedPet);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const petImage = localPet?.image 
    ? { uri: `data:image/png;base64,${localPet.image}` }
    : status?.image;

  return (
    <View style={styles.container}>
      <Header title="Mapa" />
      <MapView
        style={styles.map}
        initialRegion={status?.location}
      >
        {status?.location && (
          <Marker coordinate={status.location}>
            <View style={[styles.markerBadge, { backgroundColor: colors.primary, overflow: 'hidden' }]}>
              {petImage ? (
                <Image source={petImage} style={styles.markerPetImage} />
              ) : (
                <Icon name="dog" size={20} color="white" />
              )}
            </View>
            <View style={[styles.markerArrow, { borderBottomColor: colors.primary }]} />
          </Marker>
        )}
      </MapView>
      
      <View style={styles.statusOverlay}>
        <Card style={styles.statusCard} variant="elevated">
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="map-marker-radius" size={20} color={colors.primary} />
              </View>
              <View style={styles.statusText}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Localização</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>Centro, SP</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.statusItem}>
              <View style={[styles.iconBox, { backgroundColor: colors.success + '15' }]}>
                <Icon name="battery-80" size={20} color={colors.success} />
              </View>
              <View style={styles.statusText}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Bateria</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>{status?.battery}%</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  markerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerPetImage: {
    width: 40,
    height: 40,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    transform: [{ rotate: '180deg' }],
    marginTop: -2,
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
  },
  statusCard: {
    padding: 16,
    marginBottom: 0,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 30,
    marginHorizontal: 16,
  },
});
