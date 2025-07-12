import { supabase } from '../supabaseClient';
import { User, ItineraireUser, SpotVisite } from '../types/User';

class UserService {
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    if (error) {
      console.error('Erreur récupération user:', error.message);
      return null;
    }
    // Adapter selon la structure de ta table
    return data && data.length > 0 ? data[0] as User : null;
  }

  async getUserItineraires(): Promise<ItineraireUser[]> {
    const { data, error } = await supabase
      .from('itineraires')
      .select('*')
      .eq('creator_id', /* id utilisateur courant */ 'dfd2a3c6-34c2-4fa1-a6b3-b710d133d993');
    if (error) {
      console.error('Erreur récupération itinéraires:', error.message);
      return [];
    }
    return data as ItineraireUser[];
  }

  async getItinerairesFaits(): Promise<ItineraireUser[]> {
    // À adapter selon ta logique (table d'association ou champ spécifique)
    return [];
  }

  async getSpotsVisites(): Promise<SpotVisite[]> {
    const { data, error } = await supabase
      .from('spot_visites')
      .select('*')
      .eq('user_id', /* id utilisateur courant */ 'dfd2a3c6-34c2-4fa1-a6b3-b710d133d993');
    if (error) {
      console.error('Erreur récupération spots visités:', error.message);
      return [];
    }
    return data as SpotVisite[];
  }

  async getFavoriteItineraires(): Promise<ItineraireUser[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('itineraire_id')
      .eq('user_id', /* id utilisateur courant */ 'dfd2a3c6-34c2-4fa1-a6b3-b710d133d993');
    if (error) {
      console.error('Erreur récupération favoris:', error.message);
      return [];
    }
    // Ensuite, requête pour récupérer les itinéraires correspondants
    if (data && data.length > 0) {
      const ids = data.map((fav: any) => fav.itineraire_id);
      const { data: itinData, error: itinError } = await supabase
        .from('itineraires')
        .select('*')
        .in('id', ids);
      if (itinError) {
        console.error('Erreur récupération itinéraires favoris:', itinError.message);
        return [];
      }
      return itinData as ItineraireUser[];
    }
    return [];
  }
}

export const userService = new UserService();