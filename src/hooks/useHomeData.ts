import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PatientService } from '../services/patientService';
import { Pet } from '../types/pet';

export function useHomeData() {
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
      } else {
        setStatus(null);
        setLocalPet(null);
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

  const petName = localPet?.name || status?.name || 'Seu Pet';
  const petImage = localPet?.image
    ? { uri: `data:image/png;base64,${localPet.image}` }
    : status?.image;

  return { status, localPet, loading, loadData, petName, petImage };
}
