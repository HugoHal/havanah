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
    // Récupère l'id de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    console.log('User connecté pour isLiked:', userId);
    // Pour chaque commentaire, récupère le nombre de likes et si l'utilisateur a liké
    const commentsWithLikes = await Promise.all(
      (data as Comment[]).map(async (comment) => {
        const { count } = await supabase
          .from('comment_like')
          .select('*', { count: 'exact', head: true })
          .eq('comment_id', comment.id);

        const response = await supabase
          .from('comment_like')
          .select('*')
          .eq('comment_id', comment.id)
          .eq('user_id', userId);

        console.log('Supabase response:', response);
        const likeData = response.data;

        console.log('likeData:', likeData);
        console.log('Comment:', comment.id, 'userId:', userId, 'isLiked:', !!likeData?.length, 'likes:', count);

        return {
          ...comment,
          likes: count ?? 0,
          isLiked: !!likeData?.length,
        };
      })
    );
    return commentsWithLikes;
  }

  async toggleLike(commentId: string): Promise<{ likes: number; isLiked: boolean }> {
    const userId = (await supabase.auth.getSession()).data.session?.user?.id;
    if (!userId) return { likes: 0, isLiked: false };

    // Vérifier si le like existe
    const { data: likeData } = await supabase
      .from('comment_like')
      .select('*')
      .eq('user_id', userId)
      .eq('comment_id', commentId);

    if (likeData && likeData.length > 0) {
      // Supprimer le like
      const { error: deleteError } = await supabase
        .from('comment_like')
        .delete()
        .eq('user_id', userId)
        .eq('comment_id', commentId);
      if (deleteError) {
        console.error('Erreur suppression like:', deleteError);
      }
    } else {
      // Ajouter le like
      const { error: insertError } = await supabase
        .from('comment_like')
        .insert([{ user_id: userId, comment_id: commentId }]);
      if (insertError) {
        console.error('Erreur ajout like:', insertError);
      }
    }

    // Récupérer le nouveau nombre de likes et l'état du like
    const { count } = await supabase
      .from('comment_like')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    const { data: newLikeData } = await supabase
      .from('comment_like')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    return {
      likes: count ?? 0,
      isLiked: !!newLikeData?.length,
    };
  }

  async updateComment(commentId: string, updatedComment: Partial<Comment>) {
    // Mettre à jour le commentaire dans la base de données
    const { data, error } = await supabase
      .from('comments')
      .update(updatedComment)
      .eq('id', commentId)
      .select('*');

    if (error) {
      console.error('Erreur mise à jour commentaire:', error.message);
      return null;
    }

    // Mettre à jour le commentaire dans l'état local
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, ...updatedComment }
          : comment
      )
    );

    return data;
  }
}

export const commentService = new CommentService();