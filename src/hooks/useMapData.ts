import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ApiService } from '../services/api';
import { StorageService, PetData } from '../storage';
import { Pet } from '../types/pet';

export function useMapData() {
  const [status, setStatus] = useState<Pet | null>(null);
  const [localPet, setLocalPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [apiStatus, storedPet] = await Promise.all([
        ApiService.getPetStatus('1'),
        StorageService.getPetData(),
      ]);
      setStatus(apiStatus);
      setLocalPet(storedPet);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const petImage = localPet?.image
    ? { uri: `data:image/png;base64,${localPet.image}` }
    : status?.image;

  return { status, localPet, loading, petImage };
}
