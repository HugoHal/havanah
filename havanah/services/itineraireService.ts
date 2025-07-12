// services/itineraireService.ts
import { Itineraire } from '../types/Itineraire';
import { supabase } from '../supabaseClient';

const MOCK_ITINERAIRES: Record<'court' | 'moyen' | 'long' | 'aventure' | 'decouverte', Itineraire> = {
  court: {
    id: "1",
    nom: "Weekend à Montpellier",
    description: "Un court séjour pour découvrir Montpellier et ses environs. Parfait pour s'initier au van life !",
    duree: 3,
    distance: 50,
    spots: ["Montpellier centre", "Palavas-les-Flots", "Carnon"],
    note: 4.7,
    nbVues: 1250,
    createdAt: new Date('2024-01-15'),
    co2Economise: 45,
    waypoints: [
      {
        id: "w1",
        latitude: 43.6108,
        longitude: 3.8767,
        name: "Montpellier - Place de la Comédie",
        type: "departure",
        order: 1,
        description: "Point de départ au cœur de Montpellier"
      },
      {
        id: "w2", 
        latitude: 43.5285,
        longitude: 3.9310,
        name: "Palavas-les-Flots",
        type: "stop",
        order: 2,
        description: "Station balnéaire proche de Montpellier"
      },
      {
        id: "w3",
        latitude: 43.5501,
        longitude: 3.9667,
        name: "Carnon-Plage",
        type: "destination",
        order: 3,
        description: "Plage familiale pour terminer le séjour"
      }
    ],
    detailedRoute: {
      path: [
        [43.6108, 3.8767], // Montpellier
        [43.626247, 3.865761],
        [43.62613, 3.865532],
        // ... (path détaillé vers Palavas)
        [43.5285, 3.9310], // Palavas
        [43.5501, 3.9667], // Carnon
      ],
      instructions: [
        {
          distance: 42.981,
          heading: 234.76,
          sign: 0,
          interval: [0, 2],
          text: "Continuez sur Avenue Frédéric Sabatier-d'Espeyran",
          time: 4298,
          street_name: "Avenue Frédéric Sabatier-d'Espeyran"
        }
      ],
      distance: 15420,
      duration: 907.262,
      ascend: 51.58,
      descend: 72.27
    }
  },
  
  moyen: {
    id: "2",
    nom: "Tour de la Camargue",
    description: "Découverte complète de la Camargue, ses flamants roses, ses chevaux et ses traditions. Un voyage authentique de 7 à 10 jours.",
    duree: 8, // moyenne de 7-10 jours
    distance: 420,
    spots: ["Arles", "Saintes-Maries-de-la-Mer", "Aigues-Mortes", "Port-Camargue"],
    note: 4.9,
    nbVues: 892,
    createdAt: new Date('2024-02-10'),
    co2Economise: 180,
    waypoints: [
      {
        id: "w4",
        latitude: 43.6761,
        longitude: 4.6309,
        name: "Arles",
        type: "departure", 
        order: 1,
        description: "Ville d'art et d'histoire, porte d'entrée de la Camargue"
      },
      {
        id: "w5",
        latitude: 43.4503,
        longitude: 4.4281,
        name: "Saintes-Maries-de-la-Mer",
        type: "stop",
        order: 2,
        description: "Capitale spirituelle de la Camargue"
      },
      {
        id: "w6",
        latitude: 43.5679,
        longitude: 4.1926,
        name: "Aigues-Mortes",
        type: "destination",
        order: 3,
        description: "Cité médiévale fortifiée"
      }
    ]
  },

  long: {
    id: "3",
    nom: "Grand Tour du Sud",
    description: "Le grand classique ! De Montpellier à Nice en passant par tous les incontournables : Camargue, Luberon, Côte d'Azur. 3 semaines de pur bonheur !",
    duree: 21, // 3 semaines
    distance: 1200,
    spots: ["Montpellier", "Avignon", "Luberon", "Cassis", "Nice", "Cannes"],
    note: 4.8,
    nbVues: 2341,
    createdAt: new Date('2024-03-05'),
    co2Economise: 520,
    waypoints: [
      {
        id: "w7",
        latitude: 43.6108,
        longitude: 3.8767,
        name: "Montpellier",
        type: "departure",
        order: 1,
        description: "Point de départ"
      },
      {
        id: "w8", 
        latitude: 43.9493,
        longitude: 4.8059,
        name: "Avignon",
        type: "stop",
        order: 2,
        description: "Cité des Papes"
      },
      {
        id: "w9",
        latitude: 43.7034,
        longitude: 7.2663,
        name: "Nice",
        type: "destination", 
        order: 3,
        description: "Perle de la Côte d'Azur"
      }
    ]
  },

  aventure: {
    id: "4",
    nom: "Pyrénées Sauvages",
    description: "Pour les aventuriers ! Routes de montagne, cols spectaculaires et spots isolés dans les Pyrénées.",
    duree: 12, // moyenne de 10-15 jours
    distance: 800,
    spots: ["Toulouse", "Lourdes", "Cauterets", "Pic du Midi"],
    note: 4.6,
    nbVues: 456,
    createdAt: new Date('2024-01-20'),
    co2Economise: 340,
    waypoints: [
      {
        id: "w10",
        latitude: 43.6047,
        longitude: 1.4442,
        name: "Toulouse",
        type: "departure",
        order: 1,
        description: "La ville rose"
      },
      {
        id: "w11",
        latitude: 42.9428,
        longitude: -0.0461,
        name: "Lourdes", 
        type: "destination",
        order: 2,
        description: "Cité mariale au pied des Pyrénées"
      }
    ]
  },

  decouverte: {
    id: "5",
    nom: "Châteaux de la Loire",
    description: "Circuit culturel à travers les plus beaux châteaux de la Loire. Histoire et raffinement au programme !",
    duree: 6, // moyenne de 5-7 jours
    distance: 350,
    spots: ["Orléans", "Blois", "Chambord", "Chenonceau", "Tours"],
    note: 4.4,
    nbVues: 678,
    createdAt: new Date('2024-04-12'),
    co2Economise: 150,
    waypoints: [
      {
        id: "w12",
        latitude: 47.9029,
        longitude: 1.9039,
        name: "Orléans",
        type: "departure",
        order: 1,
        description: "Ville de Jeanne d'Arc"
      },
      {
        id: "w13",
        latitude: 47.3839,
        longitude: 0.6934,
        name: "Tours",
        type: "destination",
        order: 2, 
        description: "Capitale tourangelle"
      }
    ]
  }
};

export const getItinerairePopulaire = (periode: 'court' | 'moyen' | 'long'): Itineraire => {
  return MOCK_ITINERAIRES[periode];
};

// Nouvelle fonction pour tous les itinéraires
export const getAllItineraires = (): Itineraire[] => {
  return Object.values(MOCK_ITINERAIRES);
};

// Fonction pour un itinéraire par ID
export const getItineraireById = (id: string): Itineraire | null => {
  return Object.values(MOCK_ITINERAIRES).find(itineraire => itineraire.id === id) || null;
};

// Fonction pour rechercher par type
export const getItinerairesByType = (type: 'balnéaire' | 'montagne' | 'culturel' | 'nature'): Itineraire[] => {
  const typeMapping = {
    'balnéaire': ['1', '3'], // Montpellier, Grand Tour (côte)
    'montagne': ['4'], // Pyrénées
    'culturel': ['5', '2'], // Châteaux Loire, Camargue
    'nature': ['2', '4'] // Camargue, Pyrénées
  };
  
  return Object.values(MOCK_ITINERAIRES).filter(itineraire => 
    typeMapping[type]?.includes(itineraire.id)
  );
};

async function testSupabaseConnection() {
  const { data, error } = await supabase.from('users').select().limit(1);
  if (error) {
    console.error('Supabase connection error:', error.message);
  } else {
    console.log('Supabase connection OK, first user:', data);
  }
}

testSupabaseConnection();

export async function getUserItinerairesWithSpots(userId: string) {
  const { data: itinData, error } = await supabase
    .from('itineraires')
    .select(`
      *,
      itineraire_spot(
        ordre,
        spot:spots(*)
      )
    `)
    .eq('creator_id', userId);

  if (error) {
    console.error(error);
    return [];
  }

  // Mapping pour avoir un tableau de spots ordonnés dans chaque itineraire
  return itinData.map(itin => ({
    ...itin,
    spots: (itin.itineraire_spot ?? [])
      .sort((a, b) => a.ordre - b.ordre)
      .map(s => s.spot),
  }));
}
