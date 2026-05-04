import { userStorage, User } from '../storage/userStorage';

export const authService = {
  async signIn(login: string, password: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let user: User | null = null;

    if (login === 'admin' && password === 'admin') {
      user = {
        id: '1',
        name: 'Dr. Veterinário',
        role: 'admin',
        login: 'admin'
      };
    } else if (login === 'pet' && password === 'pet') {
      user = {
        id: '2',
        name: 'Tutor de Pet',
        role: 'pet',
        login: 'pet'
      };
    }

    if (user) {
      await userStorage.saveUser(user);
    }

    return user;
  },

  async signOut(): Promise<void> {
    await userStorage.removeUser();
  },

  async getCurrentUser(): Promise<User | null> {
    return await userStorage.getUser();
  }
};
