import { theme } from '../theme';

export type RiskLevel = 'critical' | 'warning' | 'stable';

export interface VitalSigns {
  temperature: number;
  heartRate: number;
  activity: 'Baixa' | 'Média' | 'Alta';
}

export interface Alert {
  id: string;
  type: 'temperature' | 'heartRate' | 'activity';
  severity: RiskLevel;
  message: string;
  icon: string;
}

export const AlertService = {
  /**
   * Calcula o nível de risco global baseado nos sinais vitais
   */
  calculateRiskLevel(vitals: VitalSigns): RiskLevel {
    if (vitals.temperature > 39) return 'critical';
    if (vitals.heartRate > 130 || vitals.activity === 'Baixa') return 'warning';
    return 'stable';
  },

  /**
   * Gera uma lista de alertas específicos baseados nos sinais vitais
   */
  getVitalsAlerts(vitals: VitalSigns): Alert[] {
    const alerts: Alert[] = [];

    // Regra de Temperatura
    if (vitals.temperature > 39) {
      alerts.push({
        id: 'temp_high',
        type: 'temperature',
        severity: 'critical',
        message: `Febre alta detectada: ${vitals.temperature.toFixed(1)}°C`,
        icon: 'thermometer-alert',
      });
    }

    // Regra de Batimentos
    if (vitals.heartRate > 130) {
      alerts.push({
        id: 'hr_high',
        type: 'heartRate',
        severity: 'warning',
        message: `Taquicardia detectada: ${vitals.heartRate} bpm`,
        icon: 'heart-flash',
      });
    }

    // Regra de Atividade
    if (vitals.activity === 'Baixa') {
      alerts.push({
        id: 'activity_low',
        type: 'activity',
        severity: 'warning',
        message: 'Nível de atividade abaixo do esperado',
        icon: 'run-fast',
      });
    }

    return alerts;
  },

  /**
   * Retorna a cor associada ao nível de risco
   */
  getStatusColor(status: RiskLevel): string {
    switch (status) {
      case 'critical': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'stable': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  }
};
