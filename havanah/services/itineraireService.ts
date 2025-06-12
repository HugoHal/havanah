// services/itineraireService.ts
import { Itineraire } from '../types/Itineraire';

const MOCK_ITINERAIRES: { [key: string]: Itineraire } = {
  court: {
    id: '1',
    nom: 'Weekend à Montpellier',
    description: 'Un court séjour parfait pour découvrir Montpellier et ses alentours.',
    duree: '3 jours',
    distance: '120 km',
    spots: ['Maison Hugo', 'Carnon-Plage', 'Palavas-les-Flots'],
    note: 4.7,
    nbVues: 1850,
    createdAt: new Date('2024-05-25'),
    image: 'https://example.com/montpellier-weekend.jpg',
    
    // Nouvelles données de trajet
    waypoints: [
      {
        id: 'w1',
        latitude: 43.626423,
        longitude: 3.866589,
        name: 'Maison Hugo',
        type: 'departure',
        spotId: '4',
        order: 1,
        description: 'Point de départ - Montpellier centre'
      },
      {
        id: 'w2',
        latitude: 43.5501,
        longitude: 3.9667,
        name: 'Carnon-Plage',
        type: 'stop',
        spotId: '3',
        order: 2,
        estimatedArrivalTime: '10:30',
        description: 'Première étape balnéaire'
      },
      {
        id: 'w3',
        latitude: 43.5285,
        longitude: 3.9310,
        name: 'Palavas-les-Flots',
        type: 'destination',
        spotId: '1',
        order: 3,
        estimatedArrivalTime: '15:00',
        description: 'Destination finale avec camping'
      }
    ],
    estimatedTime: 180, // 3 heures
    roadType: 'departementale',

    // Ajout de l'itinéraire détaillé
    detailedRoute: {
      path: [
        [43.626423, 3.866589], // Maison Hugo
        [43.626247, 3.865761],
        [43.62613, 3.865532],
        [43.626004, 3.865347],
        [43.625876, 3.865162],
        [43.625748, 3.864977],
        [43.625620, 3.864792],
        [43.625492, 3.864607],
        [43.625364, 3.864422],
        [43.625236, 3.864237],
        [43.5501, 3.9667], // Carnon-Plage
        [43.549987, 3.966523],
        [43.549874, 3.966346],
        [43.549761, 3.966169],
        [43.549648, 3.965992],
        [43.549535, 3.965815],
        [43.549422, 3.965638],
        [43.549309, 3.965461],
        [43.549196, 3.965284],
        [43.549083, 3.965107],
        [43.5285, 3.9310] // Palavas-les-Flots
      ],
      instructions: [
        {
          distance: 450,
          sign: 0,
          interval: [0, 5],
          text: "Sortez de Montpellier par Avenue Frédéric Sabatier",
          time: 45000,
          street_name: "Avenue Frédéric Sabatier-d'Espeyran"
        },
        {
          distance: 8500,
          sign: 2,
          interval: [5, 15],
          text: "Tournez à droite vers Carnon-Plage",
          time: 510000,
          street_name: "Route de Carnon"
        },
        {
          distance: 200,
          sign: 0,
          interval: [15, 16],
          text: "Continuez tout droit à Carnon-Plage",
          time: 20000,
          street_name: "Boulevard du Front de Mer"
        },
        {
          distance: 6000,
          sign: -1,
          interval: [16, 20],
          text: "Tournez légèrement à gauche vers Palavas-les-Flots",
          time: 360000,
          street_name: "Route des Plages"
        },
        {
          distance: 0,
          sign: 4,
          interval: [20, 20],
          text: "Arrivée à Palavas-les-Flots",
          time: 0,
          street_name: ""
        }
      ],
      distance: 15150,
      duration: 935,
      ascend: 12.5,
      descend: 18.3
    }
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
    
    // Nouvelles données de trajet
    waypoints: [
      {
        id: 'w4',
        latitude: 43.6108,
        longitude: 3.8767,
        name: 'Montpellier',
        type: 'departure',
        order: 1,
        description: 'Départ de Montpellier'
      },
      {
        id: 'w5',
        latitude: 43.4532,
        longitude: 4.4286,
        name: 'Saintes-Maries-de-la-Mer',
        type: 'stop',
        order: 2,
        estimatedArrivalTime: '11:00',
        description: 'Village typique de Camargue'
      },
      {
        id: 'w6',
        latitude: 43.5667,
        longitude: 4.1950,
        name: 'Aigues-Mortes',
        type: 'stop',
        order: 3,
        estimatedArrivalTime: '14:30',
        description: 'Cité médiévale fortifiée'
      },
      {
        id: 'w7',
        latitude: 43.5000,
        longitude: 4.3667,
        name: 'Étang de Vaccarès',
        type: 'stop',
        order: 4,
        estimatedArrivalTime: '16:00',
        description: 'Observation des flamants roses'
      },
      {
        id: 'w8',
        latitude: 43.6761,
        longitude: 4.6278,
        name: 'Arles',
        type: 'stop',
        order: 5,
        estimatedArrivalTime: '18:00',
        description: 'Patrimoine romain et Van Gogh'
      },
      {
        id: 'w9',
        latitude: 43.7444,
        longitude: 4.7953,
        name: 'Les Baux-de-Provence',
        type: 'destination',
        order: 6,
        estimatedArrivalTime: '20:00',
        description: 'Village perché dans les Alpilles'
      }
    ],
    estimatedTime: 540, // 9 heures
    roadType: 'mixte',
  // Ajout de l'itinéraire détaillé Camargue
    detailedRoute: {
      path: [
        [43.6108, 3.8767], // Montpellier
        [43.6089, 3.8782],
        [43.6070, 3.8797],
        [43.6051, 3.8812],
        [43.5932, 3.8927],
        [43.5813, 3.9042],
        [43.5694, 3.9157],
        [43.5575, 3.9272],
        [43.5456, 3.9387],
        [43.5337, 3.9502],
        [43.5218, 3.9617],
        [43.5099, 3.9732],
        [43.4980, 3.9847],
        [43.4861, 3.9962],
        [43.4742, 4.0077],
        [43.4623, 4.0192],
        [43.4532, 4.4286], // Saintes-Maries-de-la-Mer
        [43.4545, 4.4120],
        [43.4558, 4.3954],
        [43.4571, 4.3788],
        [43.4584, 4.3622],
        [43.4597, 4.3456],
        [43.4610, 4.3290],
        [43.4623, 4.3124],
        [43.4636, 4.2958],
        [43.4649, 4.2792],
        [43.4662, 4.2626],
        [43.4675, 4.2460],
        [43.4688, 4.2294],
        [43.4701, 4.2128],
        [43.5667, 4.1950], // Aigues-Mortes
        [43.5634, 4.2108],
        [43.5601, 4.2266],
        [43.5568, 4.2424],
        [43.5535, 4.2582],
        [43.5502, 4.2740],
        [43.5469, 4.2898],
        [43.5436, 4.3056],
        [43.5403, 4.3214],
        [43.5370, 4.3372],
        [43.5337, 4.3530],
        [43.5304, 4.3688],
        [43.5271, 4.3846],
        [43.5238, 4.4004],
        [43.5205, 4.4162],
        [43.5172, 4.4320],
        [43.5139, 4.4478],
        [43.5106, 4.4636],
        [43.5073, 4.4794],
        [43.5040, 4.4952],
        [43.5000, 4.3667], // Étang de Vaccarès
        [43.5125, 4.3789],
        [43.5250, 4.3911],
        [43.5375, 4.4033],
        [43.5500, 4.4155],
        [43.5625, 4.4277],
        [43.5750, 4.4399],
        [43.5875, 4.4521],
        [43.6000, 4.4643],
        [43.6125, 4.4765],
        [43.6250, 4.4887],
        [43.6375, 4.5009],
        [43.6500, 4.5131],
        [43.6625, 4.5253],
        [43.6750, 4.5375],
        [43.6761, 4.6278], // Arles
        [43.6852, 4.6515],
        [43.6943, 4.6752],
        [43.7034, 4.6989],
        [43.7125, 4.7226],
        [43.7216, 4.7463],
        [43.7307, 4.7700],
        [43.7398, 4.7937],
        [43.7444, 4.7953]  // Les Baux-de-Provence
      ],
      instructions: [
        {
          distance: 2800,
          sign: 0,
          interval: [0, 8],
          text: "Sortez de Montpellier par A9 direction Nîmes",
          time: 168000,
          street_name: "Autoroute A9",
          street_destination: "NÎMES, ARLES"
        },
        {
          distance: 45000,
          sign: -2,
          interval: [8, 25],
          text: "Prenez la sortie vers Aigues-Mortes/Grau-du-Roi",
          time: 2700000,
          street_name: "D979",
          street_destination: "AIGUES-MORTES, GRAU-DU-ROI"
        },
        {
          distance: 28000,
          sign: 1,
          interval: [25, 35],
          text: "Tournez légèrement à droite vers Saintes-Maries-de-la-Mer",
          time: 1680000,
          street_name: "D570",
          street_destination: "SAINTES-MARIES-DE-LA-MER"
        },
        {
          distance: 500,
          sign: 0,
          interval: [35, 36],
          text: "Arrivée aux Saintes-Maries-de-la-Mer",
          time: 30000,
          street_name: "Avenue Victor Hugo"
        },
        {
          distance: 22000,
          sign: -1,
          interval: [36, 45],
          text: "Repartez vers Aigues-Mortes par D85",
          time: 1320000,
          street_name: "Route D85",
          street_destination: "AIGUES-MORTES"
        },
        {
          distance: 300,
          sign: 0,
          interval: [45, 46],
          text: "Entrée dans Aigues-Mortes par les remparts",
          time: 18000,
          street_name: "Boulevard Gambetta"
        },
        {
          distance: 15000,
          sign: 2,
          interval: [46, 55],
          text: "Tournez à droite vers l'Étang de Vaccarès",
          time: 900000,
          street_name: "Route de la Digue à la Mer"
        },
        {
          distance: 25000,
          sign: 0,
          interval: [55, 65],
          text: "Continuez vers Arles par la route de Camargue",
          time: 1500000,
          street_name: "D570",
          street_destination: "ARLES"
        },
        {
          distance: 18000,
          sign: 1,
          interval: [65, 72],
          text: "Tournez légèrement à droite vers Les Baux-de-Provence",
          time: 1080000,
          street_name: "D17",
          street_destination: "LES BAUX-DE-PROVENCE"
        },
        {
          distance: 0,
          sign: 4,
          interval: [72, 72],
          text: "Arrivée aux Baux-de-Provence",
          time: 0,
          street_name: ""
        }
      ],
      distance: 156800,
      duration: 9396,
      ascend: 287.5,
      descend: 245.8
    }
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
    
    // Nouvelles données de trajet
    waypoints: [
      {
        id: 'w10',
        latitude: 43.6108,
        longitude: 3.8767,
        name: 'Montpellier',
        type: 'departure',
        order: 1,
        description: 'Point de départ du grand tour'
      },
      {
        id: 'w11',
        latitude: 43.4532,
        longitude: 4.4286,
        name: 'Camargue',
        type: 'stop',
        order: 2,
        estimatedArrivalTime: 'J2 - 10:00',
        description: 'Étape en Camargue (3 jours)'
      },
      {
        id: 'w12',
        latitude: 43.9493,
        longitude: 4.8055,
        name: 'Avignon',
        type: 'stop',
        order: 3,
        estimatedArrivalTime: 'J5 - 14:00',
        description: 'Palais des Papes (2 jours)'
      },
      {
        id: 'w13',
        latitude: 43.9108,
        longitude: 5.1989,
        name: 'Gordes',
        type: 'stop',
        order: 4,
        estimatedArrivalTime: 'J8 - 11:00',
        description: 'Village perché du Luberon (3 jours)'
      },
      {
        id: 'w14',
        latitude: 43.2142,
        longitude: 5.5378,
        name: 'Cassis',
        type: 'stop',
        order: 5,
        estimatedArrivalTime: 'J12 - 16:00',
        description: 'Calanques et ports (4 jours)'
      },
      {
        id: 'w15',
        latitude: 43.7102,
        longitude: 7.2620,
        name: 'Nice',
        type: 'stop',
        order: 6,
        estimatedArrivalTime: 'J17 - 12:00',
        description: 'Côte d\'Azur et Promenade des Anglais (5 jours)'
      },
      {
        id: 'w16',
        latitude: 43.5528,
        longitude: 7.0174,
        name: 'Cannes',
        type: 'destination',
        order: 7,
        estimatedArrivalTime: 'J22 - 15:00',
        description: 'Destination finale - Croisette et plages (3 jours)'
      }
    ],
    estimatedTime: 1440, // 24 heures de route réparties sur 25 jours
    roadType: 'mixte',
    detailedRoute: {
  path: [
    [43.6108, 3.8767], // Montpellier
    [43.6089, 3.8982],
    [43.6070, 3.9197],
    [43.6051, 3.9412],
    [43.6032, 3.9627],
    [43.6013, 3.9842],
    [43.5994, 4.0057],
    [43.5975, 4.0272],
    [43.5956, 4.0487],
    [43.5937, 4.0702],
    [43.5918, 4.0917],
    [43.5899, 4.1132],
    [43.5880, 4.1347],
    [43.5861, 4.1562],
    [43.5842, 4.1777],
    [43.5823, 4.1992],
    [43.5804, 4.2207],
    [43.5785, 4.2422],
    [43.5766, 4.2637],
    [43.5747, 4.2852],
    [43.5728, 4.3067],
    [43.5709, 4.3282],
    [43.5690, 4.3497],
    [43.5671, 4.3712],
    [43.5652, 4.3927],
    [43.5633, 4.4142],
    [43.4532, 4.4286], // Camargue
    [43.4652, 4.4401],
    [43.4772, 4.4516],
    [43.4892, 4.4631],
    [43.5012, 4.4746],
    [43.5132, 4.4861],
    [43.5252, 4.4976],
    [43.5372, 4.5091],
    [43.5492, 4.5206],
    [43.5612, 4.5321],
    [43.5732, 4.5436],
    [43.5852, 4.5551],
    [43.5972, 4.5666],
    [43.6092, 4.5781],
    [43.6212, 4.5896],
    [43.6332, 4.6011],
    [43.6452, 4.6126],
    [43.6572, 4.6241],
    [43.6692, 4.6356],
    [43.6812, 4.6471],
    [43.6932, 4.6586],
    [43.7052, 4.6701],
    [43.7172, 4.6816],
    [43.7292, 4.6931],
    [43.7412, 4.7046],
    [43.7532, 4.7161],
    [43.7652, 4.7276],
    [43.7772, 4.7391],
    [43.7892, 4.7506],
    [43.8012, 4.7621],
    [43.8132, 4.7736],
    [43.8252, 4.7851],
    [43.8372, 4.7966],
    [43.8492, 4.8081],
    [43.8612, 4.8196],
    [43.8732, 4.8311],
    [43.8852, 4.8426],
    [43.8972, 4.8541],
    [43.9092, 4.8656],
    [43.9212, 4.8771],
    [43.9332, 4.8886],
    [43.9452, 4.9001],
    [43.9493, 4.8055], // Avignon
    [43.9513, 4.8275],
    [43.9533, 4.8495],
    [43.9553, 4.8715],
    [43.9573, 4.8935],
    [43.9593, 4.9155],
    [43.9613, 4.9375],
    [43.9633, 4.9595],
    [43.9653, 4.9815],
    [43.9673, 5.0035],
    [43.9693, 5.0255],
    [43.9713, 5.0475],
    [43.9733, 5.0695],
    [43.9753, 5.0915],
    [43.9773, 5.1135],
    [43.9793, 5.1355],
    [43.9813, 5.1575],
    [43.9833, 5.1795],
    [43.9853, 5.2015],
    [43.9873, 5.2235],
    [43.9893, 5.2455],
    [43.9913, 5.2675],
    [43.9933, 5.2895],
    [43.9953, 5.3115],
    [43.9973, 5.3335],
    [43.9993, 5.3555],
    [43.9108, 5.1989], // Gordes
    [43.8988, 5.2109],
    [43.8868, 5.2229],
    [43.8748, 5.2349],
    [43.8628, 5.2469],
    [43.8508, 5.2589],
    [43.8388, 5.2709],
    [43.8268, 5.2829],
    [43.8148, 5.2949],
    [43.8028, 5.3069],
    [43.7908, 5.3189],
    [43.7788, 5.3309],
    [43.7668, 5.3429],
    [43.7548, 5.3549],
    [43.7428, 5.3669],
    [43.7308, 5.3789],
    [43.7188, 5.3909],
    [43.7068, 5.4029],
    [43.6948, 5.4149],
    [43.6828, 5.4269],
    [43.6708, 5.4389],
    [43.6588, 5.4509],
    [43.6468, 5.4629],
    [43.6348, 5.4749],
    [43.6228, 5.4869],
    [43.6108, 5.4989],
    [43.5988, 5.5109],
    [43.5868, 5.5229],
    [43.5748, 5.5349],
    [43.5628, 5.5469],
    [43.5508, 5.5589],
    [43.5388, 5.5709],
    [43.5268, 5.5829],
    [43.5148, 5.5949],
    [43.5028, 5.6069],
    [43.4908, 5.6189],
    [43.4788, 5.6309],
    [43.4668, 5.6429],
    [43.4548, 5.6549],
    [43.4428, 5.6669],
    [43.4308, 5.6789],
    [43.4188, 5.6909],
    [43.4068, 5.7029],
    [43.3948, 5.7149],
    [43.3828, 5.7269],
    [43.3708, 5.7389],
    [43.3588, 5.7509],
    [43.3468, 5.7629],
    [43.3348, 5.7749],
    [43.3228, 5.7869],
    [43.3108, 5.7989],
    [43.2988, 5.8109],
    [43.2868, 5.8229],
    [43.2748, 5.8349],
    [43.2628, 5.8469],
    [43.2508, 5.8589],
    [43.2388, 5.8709],
    [43.2268, 5.8829],
    [43.2148, 5.8949],
    [43.2028, 5.9069],
    [43.1908, 5.9189],
    [43.1788, 5.9309],
    [43.1668, 5.9429],
    [43.1548, 5.9549],
    [43.1428, 5.9669],
    [43.1308, 5.9789],
    [43.1188, 5.9909],
    [43.1068, 6.0029],
    [43.0948, 6.0149],
    [43.0828, 6.0269],
    [43.0708, 6.0389],
    [43.0588, 6.0509],
    [43.0468, 6.0629],
    [43.0348, 6.0749],
    [43.0228, 6.0869],
    [43.0108, 6.0989],
    [43.2142, 5.5378], // Cassis
    [43.2262, 5.5498],
    [43.2382, 5.5618],
    [43.2502, 5.5738],
    [43.2622, 5.5858],
    [43.2742, 5.5978],
    [43.2862, 5.6098],
    [43.2982, 5.6218],
    [43.3102, 5.6338],
    [43.3222, 5.6458],
    [43.3342, 5.6578],
    [43.3462, 5.6698],
    [43.3582, 5.6818],
    [43.3702, 5.6938],
    [43.3822, 5.7058],
    [43.3942, 5.7178],
    [43.4062, 5.7298],
    [43.4182, 5.7418],
    [43.4302, 5.7538],
    [43.4422, 5.7658],
    [43.4542, 5.7778],
    [43.4662, 5.7898],
    [43.4782, 5.8018],
    [43.4902, 5.8138],
    [43.5022, 5.8258],
    [43.5142, 5.8378],
    [43.7102, 7.2620], // Nice
    [43.5502, 5.8738],
    [43.5622, 5.8858],
    [43.5742, 5.8978],
    [43.5862, 5.9098],
    [43.5982, 5.9218],
    [43.6102, 5.9338],
    [43.6222, 5.9458],
    [43.6342, 5.9578],
    [43.6462, 5.9698],
    [43.6582, 5.9818],
    [43.6702, 5.9938],
    [43.6822, 6.0058],
    [43.6942, 6.0178],
    [43.7062, 6.0298],
    [43.7182, 6.0418],
    [43.7302, 6.0538],
    [43.7422, 6.0658],
    [43.7542, 6.0778],
    [43.7662, 6.0898],
    [43.7782, 6.1018],
    [43.7902, 6.1138],
    [43.8022, 6.1258],
    [43.8142, 6.1378],
    [43.8262, 6.1498],
    [43.8382, 6.1618],
    [43.8502, 6.1738],
    [43.8622, 6.1858],
    [43.8742, 6.1978],
    [43.8862, 6.2098],
    [43.8982, 6.2218],
    [43.9102, 6.2338],
    [43.9222, 6.2458],
    [43.9342, 6.2578],
    [43.9462, 6.2698],
    [43.9582, 6.2818],
    [43.9702, 6.2938],
    [43.9822, 6.3058],
    [43.9942, 6.3178],
    [44.0062, 6.3298],
    [44.0182, 6.3418],
    [44.0302, 6.3538],
    [44.0422, 6.3658],
    [44.0542, 6.3778],
    [44.0662, 6.3898],
    [44.0782, 6.4018],
    [44.0902, 6.4138],
    [44.1022, 6.4258],
    [44.1142, 6.4378],
    [44.1262, 6.4498],
    [44.1382, 6.4618],
    [44.1502, 6.4738],
    [44.1622, 6.4858],
    [44.1742, 6.4978],
    [44.1862, 6.5098],
    [44.1982, 6.5218],
    [44.2102, 6.5338],
    [44.2222, 6.5458],
    [44.2342, 6.5578],
    [44.2462, 6.5698],
    [43.5528, 7.0174] // Cannes
  ],
  instructions: [
    {
      distance: 4500,
      sign: 0,
      interval: [0, 15],
      text: "Sortez de Montpellier par A9 direction Nîmes/Marseille",
      time: 270000,
      street_name: "Autoroute A9",
      street_destination: "NÎMES, MARSEILLE, NICE"
    },
    {
      distance: 78000,
      sign: -1,
      interval: [15, 35],
      text: "Continuez sur A9 puis A54 vers la Camargue",
      time: 4680000,
      street_name: "A54",
      street_destination: "CAMARGUE, SAINTES-MARIES-DE-LA-MER"
    },
    {
      distance: 2000,
      sign: 0,
      interval: [35, 37],
      text: "Arrivée en Camargue - Aires de stationnement disponibles",
      time: 120000,
      street_name: "Route de la Camargue"
    },
    {
      distance: 45000,
      sign: 2,
      interval: [37, 55],
      text: "Remontez vers Avignon par D570 puis A9",
      time: 2700000,
      street_name: "A9",
      street_destination: "AVIGNON"
    },
    {
      distance: 1200,
      sign: 0,
      interval: [55, 57],
      text: "Entrée dans Avignon - Centre historique",
      time: 180000,
      street_name: "Avenue de la République"
    },
    {
      distance: 32000,
      sign: 1,
      interval: [57, 75],
      text: "Direction Gordes par D900 - Route panoramique du Luberon",
      time: 2400000,
      street_name: "D900",
      street_destination: "LUBERON, GORDES"
    },
    {
      distance: 800,
      sign: 0,
      interval: [75, 76],
      text: "Arrivée à Gordes - Village perché",
      time: 120000,
      street_name: "Route de Gordes"
    },
    {
      distance: 85000,
      sign: -2,
      interval: [76, 110],
      text: "Descendez vers Cassis par A7 puis A50 - Attention dénivelé",
      time: 5100000,
      street_name: "A50",
      street_destination: "MARSEILLE, CASSIS"
    },
    {
      distance: 15000,
      sign: 1,
      interval: [110, 120],
      text: "Sortie Cassis - Route des Calanques",
      time: 1200000,
      street_name: "Route des Calanques"
    },
    {
      distance: 1000,
      sign: 0,
      interval: [120, 121],
      text: "Arrivée à Cassis - Port et calanques",
      time: 180000,
      street_name: "Quai des Moulins"
    },
    {
      distance: 180000,
      sign: 2,
      interval: [121, 160],
      text: "Direction Nice par A50, A8 - Autoroute du Soleil",
      time: 7200000,
      street_name: "A8",
      street_destination: "NICE, CÔTE D'AZUR"
    },
    {
      distance: 2500,
      sign: -1,
      interval: [160, 165],
      text: "Sortie Nice Centre - Promenade des Anglais",
      time: 300000,
      street_name: "Promenade des Anglais"
    },
    {
      distance: 25000,
      sign: 0,
      interval: [165, 175],
      text: "Longez la côte vers Cannes par N98",
      time: 1800000,
      street_name: "Route du Bord de Mer N98",
      street_destination: "CANNES, ANTIBES"
    },
    {
      distance: 0,
      sign: 4,
      interval: [175, 175],
      text: "Arrivée à Cannes - La Croisette",
      time: 0,
      street_name: "Boulevard de la Croisette"
    }
  ],
  distance: 486000, // ~486km total
  duration: 25560, // ~7h de route pure
  ascend: 1250.8,
  descend: 1180.5
  }
},
aventure: {
  id: '4',
  nom: 'Pyrénées & Océan',
  description: 'Aventure montagne et mer : des sommets pyrénéens aux plages atlantiques. Parfait pour les amoureux de nature sauvage.',
  duree: '15 jours',
  distance: '890 km',
  spots: ['Pic du Midi', 'Gavarnie', 'Biarritz', 'Arcachon', 'Dune du Pilat'],
  note: 4.6,
  nbVues: 980,
  createdAt: new Date('2024-03-20'),
  image: 'https://example.com/pyrenees.jpg',
  
  waypoints: [
    {
      id: 'w17',
      latitude: 43.6108,
      longitude: 3.8767,
      name: 'Montpellier',
      type: 'departure',
      order: 1,
      description: 'Départ vers les Pyrénées'
    },
    {
      id: 'w18',
      latitude: 42.9367,
      longitude: 0.1428,
      name: 'Pic du Midi',
      type: 'stop',
      order: 2,
      estimatedArrivalTime: 'J3 - 15:00',
      description: 'Observatoire et panorama exceptionnel (2 jours)'
    },
    {
      id: 'w19',
      latitude: 42.7311,
      longitude: -0.0094,
      name: 'Gavarnie',
      type: 'stop',
      order: 3,
      estimatedArrivalTime: 'J6 - 11:00',
      description: 'Cirque de Gavarnie UNESCO (3 jours)'
    },
    {
      id: 'w20',
      latitude: 43.4832,
      longitude: -1.5586,
      name: 'Biarritz',
      type: 'stop',
      order: 4,
      estimatedArrivalTime: 'J10 - 16:00',
      description: 'Surf et culture basque (3 jours)'
    },
    {
      id: 'w21',
      latitude: 44.6667,
      longitude: -1.1667,
      name: 'Arcachon',
      type: 'stop',
      order: 5,
      estimatedArrivalTime: 'J13 - 12:00',
      description: 'Bassin d\'Arcachon et huîtres (2 jours)'
    },
    {
      id: 'w22',
      latitude: 44.5833,
      longitude: -1.2167,
      name: 'Dune du Pilat',
      type: 'destination',
      order: 6,
      estimatedArrivalTime: 'J15 - 14:00',
      description: 'Plus haute dune d\'Europe (1 jour)'
    }
  ],
  estimatedTime: 720, // 12h de route
  roadType: 'mixte'
},

decouverte: {
  id: '5',
  nom: 'Châteaux de la Loire',
  description: 'Circuit culturel à travers les plus beaux châteaux de la Loire. Histoire, architecture et art de vivre français.',
  duree: '8 jours',
  distance: '480 km',
  spots: ['Chambord', 'Chenonceau', 'Amboise', 'Villandry', 'Azay-le-Rideau'],
  note: 4.4,
  nbVues: 750,
  createdAt: new Date('2024-02-10'),
  image: 'https://example.com/chateaux-loire.jpg',
  
  waypoints: [
    {
      id: 'w23',
      latitude: 43.6108,
      longitude: 3.8767,
      name: 'Montpellier',
      type: 'departure',
      order: 1,
      description: 'Départ vers la Loire'
    },
    {
      id: 'w24',
      latitude: 47.6167,
      longitude: 1.5167,
      name: 'Chambord',
      type: 'stop',
      order: 2,
      estimatedArrivalTime: 'J2 - 14:00',
      description: 'Le plus grandiose des châteaux (1 jour)'
    },
    {
      id: 'w25',
      latitude: 47.3250,
      longitude: 1.0700,
      name: 'Chenonceau',
      type: 'stop',
      order: 3,
      estimatedArrivalTime: 'J3 - 16:00',
      description: 'Le château des Dames (1 jour)'
    },
    {
      id: 'w26',
      latitude: 47.4123,
      longitude: 0.9828,
      name: 'Amboise',
      type: 'stop',
      order: 4,
      estimatedArrivalTime: 'J5 - 10:00',
      description: 'Château royal et Clos Lucé (2 jours)'
    },
    {
      id: 'w27',
      latitude: 47.3394,
      longitude: 0.5142,
      name: 'Villandry',
      type: 'stop',
      order: 5,
      estimatedArrivalTime: 'J7 - 11:00',
      description: 'Jardins à la française remarquables (1 jour)'
    },
    {
      id: 'w28',
      latitude: 47.2617,
      longitude: 0.4656,
      name: 'Azay-le-Rideau',
      type: 'destination',
      order: 6,
      estimatedArrivalTime: 'J8 - 15:00',
      description: 'Joyau de la Renaissance (1 jour)'
    }
  ],
  estimatedTime: 600,
  roadType: 'nationale'
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