import { Comment } from '../types/Comment';

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    utilisateur: {
      id: 'user1',
      nom: 'Hugo',
      avatar: 'https://via.placeholder.com/40'
    },
    targetType: 'spot',
    targetId: '7',
    targetName: 'Maison Célia',
    message: 'Spot incroyable ! Célia nous a super bien accueillis, on a passé une soirée magique. L\'endroit est parfait pour se reposer après une longue route 🚐❤️',
    note: 5,
    likes: 12,
    isLiked: true,
    createdAt: new Date('2024-05-30T14:30:00'),
  },
  {
    id: '2',
    utilisateur: {
      id: 'user2',
      nom: 'Marie & Paul',
      avatar: 'https://via.placeholder.com/40'
    },
    targetType: 'itineraire',
    targetId: '2',
    targetName: 'Tour de la Camargue',
    message: 'Itinéraire au top ! Les flamants roses étaient au rendez-vous et les couchers de soleil à Saintes-Maries-de-la-Mer sont inoubliables. Parfait pour 10 jours de découverte.',
    note: 5,
    likes: 8,
    isLiked: false,
    createdAt: new Date('2024-05-29T18:45:00'),
  },
  {
    id: '3',
    utilisateur: {
      id: 'user3',
      nom: 'Vanlife_explorer',
      avatar: 'https://via.placeholder.com/40'
    },
    targetType: 'spot',
    targetId: '1',
    targetName: 'Camping Les Méditerranées',
    message: 'Camping familial très sympa ! Personnel accueillant et emplacements spacieux. Un peu cher mais la proximité de la plage vaut le coup.',
    note: 4,
    likes: 5,
    isLiked: false,
    createdAt: new Date('2024-05-28T09:15:00'),
  },
  {
    id: '4',
    utilisateur: {
      id: 'user4',
      nom: 'Les Aventuriers',
      avatar: 'https://via.placeholder.com/40'
    },
    targetType: 'itineraire',
    targetId: '1',
    targetName: 'Weekend à Montpellier',
    message: 'Parfait pour un weekend ! La maison Hugo est un passage obligé, Hugo nous a fait découvrir les meilleurs spots de Montpellier 😄',
    note: 5,
    likes: 15,
    isLiked: true,
    createdAt: new Date('2024-05-27T16:20:00'),
  },
  {
    id: '5',
    utilisateur: {
      id: 'user5',
      nom: 'Célia',
      avatar: 'https://via.placeholder.com/40'
    },
    targetType: 'spot',
    targetId: '4',
    targetName: 'Maison Hugo',
    message: 'Merci Hugo pour l\'accueil ! C\'était génial de partager nos expériences van life. À bientôt pour de nouvelles aventures ! 🚐',
    note: 5,
    likes: 20,
    isLiked: false,
    createdAt: new Date('2024-05-26T20:10:00'),
  },
];

class CommentService {
  async getComments(): Promise<Comment[]> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Retourner les commentaires triés par date (plus récent en premier)
    return MOCK_COMMENTS.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async toggleLike(commentId: string): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const comment = MOCK_COMMENTS.find(c => c.id === commentId);
    if (comment) {
      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
    }
    
    return comment!;
  }

  async addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'>): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    };
    
    MOCK_COMMENTS.unshift(newComment);
    return newComment;
  }
}

export const commentService = new CommentService();