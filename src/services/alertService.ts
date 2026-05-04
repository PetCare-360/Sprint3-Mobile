import { RiskLevel, VitalSigns } from '../types/pet';

export interface Alert {
  id: string;
  type: 'temperature' | 'heartRate' | 'activity';
  severity: RiskLevel;
  message: string;
  icon: string;
}

export const AlertService = {
  calculateRiskLevel(vitals: VitalSigns): RiskLevel {
    if (vitals.temperature > 39) return 'critical';
    if (vitals.heartRate > 130 || vitals.activity === 'Baixa') return 'warning';
    return 'stable';
  },

  getVitalsAlerts(vitals: VitalSigns): Alert[] {
    const alerts: Alert[] = [];

    if (vitals.temperature > 39) {
      alerts.push({
        id: 'temp_high',
        type: 'temperature',
        severity: 'critical',
        message: `Febre alta detectada: ${vitals.temperature.toFixed(1)}°C`,
        icon: 'thermometer-alert',
      });
    }

    if (vitals.heartRate > 130) {
      alerts.push({
        id: 'hr_high',
        type: 'heartRate',
        severity: 'warning',
        message: `Taquicardia detectada: ${vitals.heartRate} bpm`,
        icon: 'heart-flash',
      });
    }

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

  getStatusColor(status: RiskLevel, theme?: any): string {
    const colors = theme || {
      danger: '#FF3B30',
      warning: '#FFCC00',
      success: '#34C759',
      textSecondary: '#8E8E93',
    };

    switch (status) {
      case 'critical': return colors.danger;
      case 'warning': return colors.warning;
      case 'stable': return colors.success;
      default: return colors.textSecondary;
    }
  }
};
