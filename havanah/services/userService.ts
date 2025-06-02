import { User, ItineraireUser, SpotVisite } from '../types/User';

// Données mock pour l'utilisateur connecté
const CURRENT_USER: User = {
  id: 'user-current',
  pseudo: 'Hugo_Vanlife',
  email: 'hugo@vanlife.com',
  photoProfil: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...', // Base64 simulé
  dateCreation: new Date('2023-08-15'),
  bio: 'Passionné de van life depuis 2 ans ! J\'adore partager mes découvertes et rencontrer d\'autres voyageurs 🚐❤️',
  statistiques: {
    nbItinerairesCreees: 8,
    nbItinerairesFaits: 23,
    nbSpotsFaits: 67,
    kmParcourus: 15420,
  },
};

const USER_ITINERAIRES: ItineraireUser[] = [
  {
    id: 'user-itin-1',
    nom: 'Mon Tour de Bretagne',
    description: 'Itinéraire de 2 semaines à travers la Bretagne, de Saint-Malo à Quimper en passant par les plus beaux spots côtiers.',
    duree: '14 jours',
    distance: '1200 km',
    spots: ['Saint-Malo', 'Dinan', 'Cap Fréhel', 'Perros-Guirec', 'Morlaix', 'Brest', 'Quimper'],
    note: 4.8,
    nbVues: 156,
    isPublic: true,
    createdAt: new Date('2024-03-10'),
    image: 'https://example.com/bretagne.jpg',
  },
  {
    id: 'user-itin-2',
    nom: 'Weekend Cévennes',
    description: 'Court séjour dans les Cévennes pour découvrir le parc national et ses villages authentiques.',
    duree: '3 jours',
    distance: '280 km',
    spots: ['Florac', 'Gorges du Tarn', 'Mont Aigoual'],
    note: 4.5,
    nbVues: 89,
    isPublic: false,
    createdAt: new Date('2024-05-20'),
  },
  {
    id: 'user-itin-3',
    nom: 'Côte Atlantique Sud',
    description: 'De Bordeaux à Biarritz en longeant la côte atlantique, parfait pour le surf et les couchers de soleil.',
    duree: '10 jours',
    distance: '450 km',
    spots: ['Arcachon', 'Mimizan', 'Hossegor', 'Capbreton', 'Biarritz'],
    note: 4.9,
    nbVues: 234,
    isPublic: true,
    createdAt: new Date('2024-01-08'),
  },
];

const ITINERAIRES_FAITS: ItineraireUser[] = [
  {
    id: 'fait-1',
    nom: 'Tour de la Camargue',
    description: 'Découverte complète de la Camargue avec ses flamants roses et ses manades.',
    duree: '10 jours',
    distance: '650 km',
    spots: ['Saintes-Maries-de-la-Mer', 'Aigues-Mortes', 'Arles'],
    note: 4.8,
    nbVues: 1250,
    isPublic: true,
    createdAt: new Date('2024-04-15'),
  },
  {
    id: 'fait-2',
    nom: 'Alpes du Sud Express',
    description: 'Circuit express dans les Alpes du Sud en une semaine.',
    duree: '7 jours',
    distance: '800 km',
    spots: ['Gap', 'Briançon', 'Serre-Chevalier', 'Embrun'],
    note: 4.6,
    nbVues: 567,
    isPublic: true,
    createdAt: new Date('2024-02-20'),
  },
];

const SPOTS_VISITES: SpotVisite[] = [
  {
    spotId: '4',
    nomSpot: 'Maison Hugo',
    dateVisite: new Date('2024-05-30'),
    note: 5,
    commentaire: 'Mon chez moi ! Toujours un plaisir d\'accueillir des van lifers ❤️',
  },
  {
    spotId: '7',
    nomSpot: 'Maison Célia',
    dateVisite: new Date('2024-05-29'),
    note: 5,
    commentaire: 'Le plus beau spot de Montpellier chez mon amoureuse 💕',
  },
  {
    spotId: '1',
    nomSpot: 'Camping Les Méditerranées',
    dateVisite: new Date('2024-05-15'),
    note: 4,
    commentaire: 'Camping familial sympa, un peu cher mais bien situé.',
  },
  {
    spotId: '6',
    nomSpot: 'Camping Saintes-Maries-de-la-Mer',
    dateVisite: new Date('2024-04-18'),
    note: 4,
    commentaire: 'Parfait pour observer les flamants roses !',
  },
];

class UserService {
  async getCurrentUser(): Promise<User> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return CURRENT_USER;
  }

  async getUserItineraires(): Promise<ItineraireUser[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return USER_ITINERAIRES.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getItinerairesFaits(): Promise<ItineraireUser[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ITINERAIRES_FAITS.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSpotsVisites(): Promise<SpotVisite[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return SPOTS_VISITES.sort((a, b) => b.dateVisite.getTime() - a.dateVisite.getTime());
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mise à jour des données (en réel, ça irait au serveur)
    Object.assign(CURRENT_USER, updates);
    return CURRENT_USER;
  }

  async uploadProfilePhoto(photoBase64: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En réel, on enverrait au serveur et on recevrait l'URL
    CURRENT_USER.photoProfil = photoBase64;
    return photoBase64;
  }

  async getFavoriteItineraires(): Promise<ItineraireUser[]> {
    // Remplace ce mock par ton vrai appel API ou stockage local
    return [
      {
        id: "fav1",
        nom: "Roadtrip Bretagne",
        description: "Un super roadtrip en Bretagne",
        duree: "3 jours",
        distance: "400 km",
        spots: ["Rennes", "Quimper", "Vannes"],
        note: 4.7,
        nbVues: 320,
        isPublic: true,
        createdAt: new Date('2024-04-01'),
        image: "https://example.com/bretagne.jpg",
      },
      {
        id: "fav2",
        nom: "Tour du Sud",
        description: "Découverte du sud de la France",
        duree: "5 jours",
        distance: "800 km",
        spots: ["Marseille", "Nice", "Montpellier"],
        note: 4.9,
        nbVues: 410,
        isPublic: false,
        createdAt: new Date('2024-03-15'),
        image: "https://example.com/sud.jpg",
      }
    ];
  }
}

export const userService = new UserService();