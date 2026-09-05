import { useQuery } from '@tanstack/react-query';
import { PatientService } from '../services/patientService';

export function useHomeData() {
  const { data: pets = [], isLoading: petsLoading, isError: petsError, refetch } = useQuery({
    queryKey: ['pets'],
    queryFn: PatientService.getPets,
  });
  const firstPet = pets[0];
  const { data: status, isLoading: healthLoading, isError: healthError } = useQuery({
    queryKey: ['pet-health', firstPet?.id],
    queryFn: () => PatientService.getHealthStatus(firstPet!.id),
    enabled: Boolean(firstPet),
  });
  const { data: location } = useQuery({
    queryKey: ['pet-location', firstPet?.id],
    queryFn: () => PatientService.getLocation(firstPet!.id),
    enabled: Boolean(firstPet),
  });
  const { data: activitySummary } = useQuery({
    queryKey: ['pet-activity-summary', firstPet?.id],
    queryFn: () => PatientService.getActivitySummary(firstPet!.id),
    enabled: Boolean(firstPet),
  });

  return {
    status: firstPet && status ? { ...firstPet, ...status, location } : null,
    location,
    localPet: firstPet ?? null,
    activitySummary,
    loading: petsLoading || healthLoading,
    isError: petsError || healthError,
    loadData: refetch,
    petName: firstPet?.name || 'Seu Pet',
    petImage: firstPet?.image,
  };
}
