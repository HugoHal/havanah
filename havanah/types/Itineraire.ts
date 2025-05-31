// types/Itineraire.ts
export interface Itineraire {
  id: string;
  nom: string;
  description: string;
  duree: string; // "3 jours", "1 semaine", etc.
  distance: string; // "250 km"
  spots: string[]; // Liste des noms de spots
  note: number;
  nbVues: number;
  createdAt: Date;
  image?: string;
}