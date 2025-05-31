export interface User {
  id: string;
  pseudo: string;
  email?: string;
  photoProfil?: string; // Base64 ou URL
  dateCreation: Date;
  bio?: string;
  statistiques: {
    nbItinerairesCreees: number;
    nbItinerairesFaits: number;
    nbSpotsFaits: number;
    kmParcourus: number;
  };
}

export interface ItineraireUser {
  id: string;
  nom: string;
  description: string;
  duree: string;
  distance: string;
  spots: string[];
  note: number;
  nbVues: number;
  isPublic: boolean;
  createdAt: Date;
  image?: string;
}

export interface SpotVisite {
  spotId: string;
  nomSpot: string;
  dateVisite: Date;
  note?: number; // Note donnée par l'utilisateur
  commentaire?: string;
  photos?: string[]; // Photos prises par l'utilisateur
}