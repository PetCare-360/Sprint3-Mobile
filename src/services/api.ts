export interface PetStatus {
  heartRate: number;
  temperature: number;
  activity: string;
  battery: number;
  location: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export const ApiService = {
  // Simula uma chamada de API para obter o status atual do pet
  async getPetStatus(): Promise<PetStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          heartRate: 85 + Math.floor(Math.random() * 20),
          temperature: 38.2 + (Math.random() * 0.5),
          activity: 'Descansando',
          battery: 85,
          location: {
            latitude: -23.5505, // Coordenadas exemplo (São Paulo)
            longitude: -46.6333,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
        });
      }, 1000);
    });
  }
};
