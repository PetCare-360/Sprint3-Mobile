import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PatientService } from '../services/patientService';
import { Pet } from '../types/pet';

export function useMapData() {
  const [status, setStatus] = useState<Pet | null>(null);
  const [localPet, setLocalPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const pets = await PatientService.getPets();
      const firstPet = pets[0];
      if (firstPet) {
        const health = await PatientService.getHealthStatus(firstPet.id);
        setStatus({ ...firstPet, ...health });
        setLocalPet(firstPet);
      }
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
