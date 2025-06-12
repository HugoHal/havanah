// types/Itineraire.ts
export interface Itineraire {
  id: string;
  nom: string;
  description: string;
  duree: string;
  distance: string;
  spots: string[]; // Liste des noms de spots
  note: number;
  nbVues: number;
  createdAt: Date;
  image?: string;
  co2Economise: number; // ✅ Nouveau: CO2 économisé en kg
  
  // Nouvelles propriétés pour les trajets détaillés
  waypoints?: Waypoint[]; // Points de passage principaux (spots)
  detailedRoute?: DetailedRoute; // Route précise avec navigation
  estimatedTime?: number; // Temps estimé en minutes
  roadType?: 'autoroute' | 'nationale' | 'departementale' | 'mixte';
}

export interface Waypoint {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  type: 'departure' | 'stop' | 'destination' | 'intermediate';
  spotId?: string; // Référence au spot si c'est un arrêt
  estimatedArrivalTime?: string; // Heure d'arrivée estimée
  description?: string;
  order: number; // Ordre dans l'itinéraire
}

// Nouvelle interface pour la navigation détaillée
export interface DetailedRoute {
  path: [number, number][]; // Coordonnées précises [latitude, longitude]
  instructions: RouteInstruction[]; // Instructions turn-by-turn
  distance: number; // Distance totale en mètres
  duration: number; // Durée totale en secondes
  ascend?: number; // Dénivelé positif
  descend?: number; // Dénivelé négatif
}

export interface RouteInstruction {
  distance: number; // Distance de cette instruction en mètres
  heading?: number; // Direction initiale
  sign: number; // Type de manœuvre (-3=hard left, -2=left, -1=slight left, 0=straight, 1=slight right, 2=right, 3=hard right, 4=finish, 6=roundabout)
  interval: [number, number]; // Index du path concerné [start, end]
  text: string; // Texte de l'instruction
  time: number; // Temps en millisecondes
  street_name?: string; // Nom de la rue
  street_destination?: string; // Destination de la rue
  street_destination_ref?: string; // Référence (A9, N113, etc.)
  exit_number?: number; // Numéro de sortie pour ronds-points
  exited?: boolean; // Si on sort du rond-point
  turn_angle?: number; // Angle de rotation
  last_heading?: number; // Direction finale
}