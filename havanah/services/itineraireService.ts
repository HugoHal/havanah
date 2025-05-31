// services/itineraireService.ts
import { Itineraire } from '../types/Itineraire';

const MOCK_ITINERAIRES: { [key: string]: Itineraire } = {
  court: {
    id: '1',
    nom: 'Weekend à Montpellier',
    description: 'Un court séjour parfait pour découvrir Montpellier et ses alentours. Idéal pour un weekend ou un pont.',
    duree: '3 jours',
    distance: '120 km',
    spots: ['Maison Hugo', 'Carnon-Plage', 'Palavas-les-Flots'],
    note: 4.7,
    nbVues: 1850,
    createdAt: new Date('2024-05-25'),
    image: 'https://example.com/montpellier-weekend.jpg',
  },
  moyen: {
    id: '2',
    nom: 'Tour de la Camargue',
    description: 'Découverte complète de la Camargue avec ses flamants roses, ses manades et ses villages typiques. Un voyage parfait entre nature et culture.',
    duree: '10 jours',
    distance: '650 km',
    spots: ['Saintes-Maries-de-la-Mer', 'Aigues-Mortes', 'Étang de Vaccarès', 'Arles', 'Les Baux-de-Provence'],
    note: 4.8,
    nbVues: 1250,
    createdAt: new Date('2024-04-15'),
    image: 'https://example.com/camargue.jpg',
  },
  long: {
    id: '3',
    nom: 'Grand Tour du Sud',
    description: 'Le voyage ultime dans le Sud de la France ! De Montpellier à Nice en passant par la Camargue, les Alpilles, la Provence et la Côte d\'Azur.',
    duree: '25 jours',
    distance: '1200 km',
    spots: ['Montpellier', 'Camargue', 'Avignon', 'Gordes', 'Cassis', 'Nice', 'Cannes'],
    note: 4.9,
    nbVues: 3200,
    createdAt: new Date('2023-12-10'),
    image: 'https://example.com/grand-tour.jpg',
  },
};

export const getItinerairePopulaire = (periode: 'court' | 'moyen' | 'long'): Itineraire => {
  return MOCK_ITINERAIRES[periode];
};