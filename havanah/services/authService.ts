import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'havanah_auth_token';

class AuthService {
  private isAuthenticated = false;

  async checkAuthStatus(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(AUTH_KEY);
      this.isAuthenticated = !!token;
      return this.isAuthenticated;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'authentification:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Simulation d'une connexion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici tu peux ajouter ta vraie logique d'authentification
      // Pour le moment, on accepte n'importe quel email/mot de passe
      if (email && password) {
        const mockToken = `token_${Date.now()}`;
        await AsyncStorage.setItem(AUTH_KEY, mockToken);
        this.isAuthenticated = true;
        return { success: true };
      } else {
        return { success: false, message: 'Email et mot de passe requis' };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      this.isAuthenticated = false;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated;
  }
}

export const authService = new AuthService();