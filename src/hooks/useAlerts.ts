import { useQuery } from '@tanstack/react-query';
import { AlertService } from '../services/alertService';

export function useAlerts() {
  const query = useQuery({
    queryKey: ['quick-alerts'],
    queryFn: AlertService.getQuickAlerts,
    refetchInterval: 10000,
  });

  return {
    alerts: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
