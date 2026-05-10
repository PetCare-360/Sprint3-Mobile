import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { ApiService, PetStatus } from '../services/api';
import { StorageService, PetData } from '../storage';
import { useTheme } from '../hooks/useTheme';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const MapScreen = () => {
  const [status, setStatus] = useState<PetStatus | null>(null);
  const [localPet, setLocalPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors, spacing, radius, shadows, isDark } = useTheme();

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
      <Header title="Localização" transparent />
      
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={status?.location}
        customMapStyle={isDark ? midnightMapStyle : []}
      >
        {status?.location && (
          <Marker coordinate={status.location}>
            <View style={styles.markerContainer}>
              <View style={[styles.markerBadge, { backgroundColor: colors.primary, borderColor: colors.white }]}>
                {petImage ? (
                  <Image source={petImage} style={styles.markerPetImage} />
                ) : (
                  <Icon name="dog" size={20} color="white" />
                )}
              </View>
              <View style={[styles.markerPulse, { backgroundColor: colors.primary }]} />
            </View>
          </Marker>
        )}
      </MapView>
      
      <View style={[styles.controls, { top: 100, right: spacing.lg }]}>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.card, ...shadows.md }]}>
          <Icon name="layers-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.card, ...shadows.md, marginTop: spacing.md }]}>
          <Icon name="crosshairs-gps" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statusOverlay}>
        <Card style={styles.statusCard} variant="glass" padding="lg">
          <View style={styles.statusHeader}>
            <Text style={[styles.petName, { color: colors.text }]}>{localPet?.name || 'Max'}</Text>
            <View style={styles.lastSeenBadge}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.lastSeenText, { color: colors.textSecondary }]}>Visto agora</Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.divider, marginVertical: 16 }]} />
          
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="map-marker" size={20} color={colors.primary} />
              </View>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Endereço</Text>
                <Text style={[styles.statusValue, { color: colors.text }]} numberOfLines={1}>Centro, São Paulo</Text>
              </View>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.iconBox, { backgroundColor: colors.success + '15' }]}>
                <Icon name="battery-high" size={20} color={colors.success} />
              </View>
              <View style={styles.statusInfo}>
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

const midnightMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334155" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#818cf8" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#475569" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#818cf8" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#020617" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#334155" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#020617" }] }
];

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
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  markerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  markerPetImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
    zIndex: 1,
  },
  controls: {
    position: 'absolute',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  statusCard: {
    marginBottom: 0,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  lastSeenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  lastSeenText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
