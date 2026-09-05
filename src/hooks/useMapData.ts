import { useQuery } from '@tanstack/react-query';
import { PatientService } from '../services/patientService';

export function useMapData() {
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: PatientService.getPets,
  });
  const firstPet = pets[0];
  const { data: status, isLoading: healthLoading } = useQuery({
    queryKey: ['pet-health', firstPet?.id],
    queryFn: () => PatientService.getHealthStatus(firstPet!.id),
    enabled: Boolean(firstPet),
  });
  const { data: location, isLoading: locationLoading } = useQuery({
    queryKey: ['pet-location', firstPet?.id],
    queryFn: () => PatientService.getLocation(firstPet!.id),
    enabled: Boolean(firstPet),
  });

  return {
    status: firstPet && status ? { ...firstPet, ...status, location } : null,
    location,
    localPet: firstPet ?? null,
    loading: petsLoading || healthLoading || locationLoading,
    petImage: firstPet?.image,
  };
}
