import { Pet } from '../types/pet';

export const ApiService = {
  async getPetStatus(id: string = '1'): Promise<Pet> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: id === '1' ? 'Max' : id === '2' ? 'Luna' : 'Thor',
          breed: id === '1' ? 'Golden Retriever' : id === '2' ? 'Siamês' : 'Bulldog Francês',
          owner: id === '1' ? 'Carlos' : 'Ana',
          heartRate: 85 + Math.floor(Math.random() * 20),
          temperature: 38.2 + (Math.random() * 0.5),
          activity: 'Média',
          battery: 85,
          status: 'stable',
          image: id === '1' ? require('../../public/dog1.jpg') : id === '2' ? require('../../public/cat1.jpg') : require('../../public/dog2.jpg'),
          location: {
            latitude: -23.5505,
            longitude: -46.6333,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
        });
      }, 500);
    });
  },

  async getPatients(): Promise<Pet[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Max', breed: 'Golden Retriever', owner: 'Carlos Silva', status: 'critical', heartRate: 140, temperature: 39.5, activity: 'Alta', battery: 90, image: require('../../public/dog1.jpg'), location: { latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0 } },
          { id: '2', name: 'Luna', breed: 'Siamês', owner: 'Ana Oliveira', status: 'stable', heartRate: 80, temperature: 38.5, activity: 'Baixa', battery: 70, image: require('../../public/cat1.jpg'), location: { latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0 } },
          { id: '3', name: 'Thor', breed: 'Bulldog Francês', owner: 'João Souza', status: 'warning', heartRate: 110, temperature: 38.8, activity: 'Média', battery: 50, image: require('../../public/dog2.jpg'), location: { latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0 } },
        ]);
      }, 800);
    });
  }
};

