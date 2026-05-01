import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../theme';
import { ApiService, PetStatus } from '../services/api';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card } from '../components/Card';

export const MapScreen = () => {
  const [status, setStatus] = useState<PetStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await ApiService.getPetStatus();
      setStatus(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={status.location}
      >
        <Marker coordinate={status.location}>
          <View style={styles.markerContainer}>
            <View style={styles.markerBadge}>
              <Icon name="dog" size={24} color={theme.colors.white} />
            </View>
            <View style={styles.markerArrow} />
          </View>
        </Marker>
      </MapView>

      <View style={styles.overlay}>
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Icon name="map-marker-radius" size={20} color={theme.colors.primary} />
              <Text style={styles.statusLabel}>Localização</Text>
              <Text style={styles.statusValue}>Centro, SP</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusItem}>
              <Icon name="battery-80" size={20} color={theme.colors.success} />
              <Text style={styles.statusLabel}>Bateria</Text>
              <Text style={styles.statusValue}>{status.battery}%</Text>
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
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBadge: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.primary,
    transform: [{ rotate: '180deg' }],
    marginTop: -2,
  },
  overlay: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  statusCard: {
    marginBottom: 0,
    padding: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
});
