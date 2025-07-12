export interface Comment {
  id: string;
  user_id: string; // <-- Ajoute cette ligne
  message: string;
  note: number;
  created_at: string;
  targetType: string;
  targetName?: string;
  likes?: number;
  isLiked?: boolean;
}