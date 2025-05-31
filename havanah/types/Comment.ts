export interface Comment {
  id: string;
  utilisateur: {
    id: string;
    nom: string;
    avatar?: string;
  };
  targetType: 'spot' | 'itineraire';
  targetId: string;
  targetName: string; // Nom du spot/itinéraire
  message: string;
  note: number; // 1 à 5 étoiles
  likes: number;
  isLiked?: boolean; // Si l'utilisateur actuel a liké
  createdAt: Date;
  photos?: string[]; // Photos optionnelles
}