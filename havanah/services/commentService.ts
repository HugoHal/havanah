import { supabase } from '../supabaseClient';
import { Comment } from '../types/Comment';

class CommentService {
  async getComments(): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*');
    if (error) {
      console.error('Erreur récupération commentaires:', error.message);
      return [];
    }
    // Adapter le mapping si besoin
    return data as Comment[];
  }

  async toggleLike(commentId: string): Promise<Comment | null> {
    // Récupérer l'utilisateur courant (à adapter)
    const userId = 'dfd2a3c6-34c2-4fa1-a6b3-b710d133d993';
    // Vérifier si le like existe
    const { data: likeData } = await supabase
      .from('comment_like')
      .select('*')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .limit(1);

    if (likeData && likeData.length > 0) {
      // Supprimer le like
      await supabase
        .from('comment_like')
        .delete()
        .eq('user_id', userId)
        .eq('comment_id', commentId);
    } else {
      // Ajouter le like
      await supabase
        .from('comment_like')
        .insert([{ user_id: userId, comment_id: commentId }]);
    }

    // Retourner le commentaire mis à jour
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single();
    if (error) {
      console.error('Erreur récupération commentaire:', error.message);
      return null;
    }
    return data as Comment;
  }
}

export const commentService = new CommentService();