import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types/pet';

const STORAGE_KEY = '@petcare360:patients';

const cat1 = require('../../public/cat1.jpg');
const dog1 = require('../../public/dog1.jpg');
const dog2 = require('../../public/dog2.jpg');

const initialPatients: Partial<Pet>[] = [
  { id: '1', collarId: 'COL-001', name: 'Max', breed: 'Golden Retriever', owner: 'Carlos Silva', heartRate: 140, temperature: 39.5, activity: 'Alta', image: dog1 },
  { id: '2', collarId: 'COL-002', name: 'Luna', breed: 'Siamês', owner: 'Ana Oliveira', heartRate: 80, temperature: 38.5, activity: 'Baixa', image: cat1 },
  { id: '3', collarId: 'COL-003', name: 'Thor', breed: 'Bulldog', owner: 'João Souza', heartRate: 110, temperature: 38.8, activity: 'Média', image: dog2 },
];

export const PatientService = {
  async getPatients(): Promise<Pet[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const patients: Pet[] = stored ? JSON.parse(stored) : initialPatients;
      
      return patients.map(p => {
        const images: Record<string, any> = { '1': dog1, '2': cat1, '3': dog2 };
        return { ...p, image: images[p.id] || p.image || dog1 };
      });
    } catch {
      return initialPatients as Pet[];
    }
  },

  async addPatient(collarId: string): Promise<Pet> {
    const patients = await this.getPatients();
    
    const newPatient: Pet = {
      id: Math.random().toString(36).substring(2, 9),
      collarId,
      name: `Pet ${collarId.split('-')[1] || 'Novo'}`,
      breed: 'Raça Indefinida',
      owner: 'Tutor Pendente',
      heartRate: 90 + Math.floor(Math.random() * 20),
      temperature: 38.5 + (Math.random() * 0.5),
      activity: 'Média',
      battery: 100,
      image: dog1
    };

    const updatedPatients = [newPatient, ...patients];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    return newPatient;
  },

  async removePatient(id: string): Promise<void> {
    const patients = await this.getPatients();
    const updatedPatients = patients.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
  }
};
