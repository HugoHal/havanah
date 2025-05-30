export interface Spot {
  id: string;
  nom: string;
  description: string;
  latitude: number;
  longitude: number;
  type: 'camping' | 'aire_services' | 'stationnement' | 'point_eau' | 'autre';
  note?: number; // Note moyenne sur 5
  photos?: string[]; // URLs des photos
  services?: string[]; // 'eau', 'electricite', 'wifi', 'douches', etc.
  prix?: number; // Prix par nuit en euros
  createdAt: Date;
  updatedAt: Date;
}

export interface SpotFilters {
  type?: string;
  noteMin?: number;
  prixMax?: number;
  services?: string[];
  rayon?: number; // En km autour de la position actuelle
}