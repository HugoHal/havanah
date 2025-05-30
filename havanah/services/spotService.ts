import { Spot, SpotFilters } from '../types/Spot';

// Données mockées en attendant le serveur
const MOCK_SPOTS: Spot[] = [
  {
    id: '1',
    nom: 'Camping Les Méditerranées',
    description: 'Camping familial à Palavas-les-Flots avec accès direct à la plage',
    latitude: 43.5285,
    longitude: 3.9310,
    type: 'camping',
    note: 4.5,
    photos: ['https://example.com/photo1.jpg'],
    services: ['eau', 'electricite', 'wifi', 'douches'],
    prix: 28,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    nom: 'Aire de services Sète Port',
    description: 'Aire de services moderne près du port de Sète',
    latitude: 43.4023,
    longitude: 3.6967,
    type: 'aire_services',
    note: 4.0,
    services: ['eau', 'electricite', 'vidange'],
    prix: 12,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    nom: 'Stationnement Carnon-Plage',
    description: 'Stationnement gratuit proche de la plage de Carnon',
    latitude: 43.5501,
    longitude: 3.9667,
    type: 'stationnement',
    note: 3.8,
    services: [],
    prix: 0,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '4',
    nom: 'Maison Hugo',
    description: 'Lieu convivial à Montpellier, parfait pour une halte',
    latitude: 43.626423,
    longitude: 3.866589,
    type: 'stationnement',
    note: 5.0,
    services: ['wifi', 'eau'],
    prix: 0,
    createdAt: new Date('2024-05-30'),
    updatedAt: new Date('2024-05-30'),
  },
  {
    id: '5',
    nom: 'Point d\'eau Aigues-Mortes',
    description: 'Point d\'eau dans la cité médiévale d\'Aigues-Mortes',
    latitude: 43.5679,
    longitude: 4.1926,
    type: 'point_eau',
    note: 4.2,
    services: ['eau'],
    prix: 2,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '6',
    nom: 'Camping Saintes-Maries-de-la-Mer',
    description: 'Camping authentique en Camargue près des flamants roses',
    latitude: 43.4503,
    longitude: 4.4281,
    type: 'camping',
    note: 4.3,
    services: ['eau', 'electricite', 'wifi'],
    prix: 22,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '7',
    nom: 'Maison Célia',
    description: 'Le plus beau spot de Montpellier ❤️ Chez mon amoureuse, accueil chaleureux garanti !',
    latitude: 43.628694,
    longitude: 3.898003,
    type: 'stationnement',
    note: 5.0,
    services: ['wifi', 'eau', 'douches'],
    prix: 0,
    createdAt: new Date('2024-05-30'),
    updatedAt: new Date('2024-05-30'),
  },
];

class SpotService {
  // Récupérer tous les spots dans une zone
  async getSpots(filters?: SpotFilters): Promise<Spot[]> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let spots = [...MOCK_SPOTS];
    
    // Appliquer les filtres
    if (filters) {
      if (filters.type) {
        spots = spots.filter(spot => spot.type === filters.type);
      }
      if (filters.noteMin) {
        spots = spots.filter(spot => (spot.note || 0) >= filters.noteMin!);
      }
      if (filters.prixMax !== undefined) {
        spots = spots.filter(spot => (spot.prix || 0) <= filters.prixMax!);
      }
      if (filters.services && filters.services.length > 0) {
        spots = spots.filter(spot => 
          filters.services!.some(service => spot.services?.includes(service))
        );
      }
    }
    
    return spots;
  }

  // Récupérer un spot par son ID
  async getSpotById(id: string): Promise<Spot | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_SPOTS.find(spot => spot.id === id) || null;
  }

  // Rechercher des spots par nom/description
  async searchSpots(query: string): Promise<Spot[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return MOCK_SPOTS.filter(spot => 
      spot.nom.toLowerCase().includes(lowerQuery) ||
      spot.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Ajouter un nouveau spot (pour plus tard)
  async createSpot(spot: Omit<Spot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Spot> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newSpot: Spot = {
      ...spot,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    MOCK_SPOTS.push(newSpot);
    return newSpot;
  }
}

export const spotService = new SpotService();