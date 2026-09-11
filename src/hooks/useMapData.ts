import { useQuery } from '@tanstack/react-query';
import { PatientService } from '../services/patientService';

export function useMapData() {
  const { data: pets = [], isLoading: petsLoading, isError: petsError, refetch } = useQuery({
    queryKey: ['pets'],
    queryFn: PatientService.getPets,
  });
  const firstPet = pets[0];
  const { data: status, isLoading: healthLoading, isError: healthError, refetch: refetchHealth } = useQuery({
    queryKey: ['pet-health', firstPet?.id],
    queryFn: () => PatientService.getHealthStatus(firstPet!.id),
    enabled: Boolean(firstPet),
  });
  const { data: location, isLoading: locationLoading, isError: locationError, refetch: refetchLocation } = useQuery({
    queryKey: ['pet-location', firstPet?.id],
    queryFn: () => PatientService.getLocation(firstPet!.id),
    enabled: Boolean(firstPet),
  });

  const retry = async () => {
    await refetch();
    if (firstPet) {
      await Promise.all([refetchHealth(), refetchLocation()]);
    }
  };

  return {
    status: firstPet && status ? { ...firstPet, ...status, location } : null,
    location,
    localPet: firstPet ?? null,
    loading: petsLoading || healthLoading || locationLoading,
    isError: petsError || healthError || locationError,
    retry,
    petImage: firstPet?.image,
  };
}
