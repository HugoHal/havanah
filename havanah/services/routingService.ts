import { DetailedRoute, Waypoint } from '../types/Itineraire';

interface VanRoutingOptions {
  vehicle: 'van' | 'car' | 'truck';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  vehicleHeight?: number; // en mètres
  vehicleWeight?: number; // en tonnes
  vehicleWidth?: number; // en mètres
}

class RoutingService {
  private apiUrl = 'https://graphhopper.com/api/1/route'; // Exemple avec GraphHopper
  private apiKey = 'YOUR_API_KEY'; // À remplacer par ta vraie clé

  async getDetailedRoute(waypoints: Waypoint[], options: VanRoutingOptions): Promise<DetailedRoute> {
    try {
      // Construction des points de passage
      const points = waypoints
        .sort((a, b) => a.order - b.order)
        .map(w => [w.latitude, w.longitude]);

      // Paramètres spécifiques van
      const params = new URLSearchParams({
        key: this.apiKey,
        vehicle: options.vehicle,
        points_encoded: 'false',
        instructions: 'true',
        calc_points: 'true',
        debug: 'true',
        elevation: 'true',
        // Contraintes van
        ...(options.avoidTolls && { 'ch.disable': 'true' }),
        ...(options.avoidHighways && { 'avoid': 'motorway' }),
        ...(options.vehicleHeight && { 'vehicle.height': options.vehicleHeight.toString() }),
        ...(options.vehicleWeight && { 'vehicle.weight': options.vehicleWeight.toString() }),
        ...(options.vehicleWidth && { 'vehicle.width': options.vehicleWidth.toString() }),
      });

      // Ajouter les points
      points.forEach(point => {
        params.append('point', `${point[0]},${point[1]}`);
      });

      const response = await fetch(`${this.apiUrl}?${params}`);
      const data = await response.json();

      if (data.paths && data.paths[0]) {
        const route = data.paths[0];
        return {
          path: route.points.coordinates, // Déjà au format [lat, lng]
          instructions: route.instructions.map(this.mapInstruction),
          distance: route.distance,
          duration: route.time / 1000, // Convertir ms en secondes
          ascend: route.ascend,
          descend: route.descend,
        };
      }

      throw new Error('Aucune route trouvée');
    } catch (error) {
      console.error('Erreur routing:', error);
      // Fallback vers données mock si l'API échoue
      return this.getMockRoute();
    }
  }

  private mapInstruction(instruction: any): any {
    return {
      distance: instruction.distance,
      heading: instruction.heading,
      sign: instruction.sign,
      interval: instruction.interval,
      text: instruction.text,
      time: instruction.time,
      street_name: instruction.street_name || '',
      street_destination: instruction.street_destination,
      street_destination_ref: instruction.street_destination_ref,
      exit_number: instruction.exit_number,
      exited: instruction.exited,
      turn_angle: instruction.turn_angle,
      last_heading: instruction.last_heading,
    };
  }

  // Données mock basées sur ton exemple JSON
  private getMockRoute(): DetailedRoute {
    return {
      path: [
        [43.626247, 3.865761],
        [43.62613, 3.865532],
        [43.626004, 3.865347],
        [43.62607, 3.865573],
        [43.626173, 3.865812],
        // ... (reste du path de ton JSON)
        [43.603122, 3.920234]
      ],
      instructions: [
        {
          distance: 42.981,
          heading: 234.76,
          sign: 0,
          interval: [0, 2],
          text: "Continuez sur Avenue Frédéric Sabatier-d'Espeyran et prendre A9 A75 vers TOUTES DIRECTIONS",
          time: 4298,
          street_name: "Avenue Frédéric Sabatier-d'Espeyran",
          street_destination: "TOUTES DIRECTIONS, GANGES, LES CÉVENNES",
          street_destination_ref: "A9 A75"
        },
        {
          distance: 2789.819,
          sign: -3,
          interval: [2, 59],
          text: "Tournez fort à gauche sur Avenue Frédéric Sabatier-d'Espeyran",
          time: 290458,
          street_name: "Avenue Frédéric Sabatier-d'Espeyran"
        },
        {
          distance: 278.392,
          sign: 2,
          interval: [59, 68],
          text: "Tournez à droite sur Avenue Georges Frêche",
          time: 28682,
          street_name: "Avenue Georges Frêche"
        },
        {
          exit_number: 3,
          distance: 435.072,
          sign: 6,
          exited: true,
          turn_angle: -4.04,
          interval: [68, 85],
          text: "Au rond-point, prenez la 3e sortie vers Avenue Georges Frêche",
          time: 48550,
          street_name: "Avenue Georges Frêche"
        },
        // ... autres instructions de ton JSON
        {
          distance: 0,
          sign: 4,
          last_heading: 282.05566338700163,
          interval: [240, 240],
          text: "Arrivée",
          time: 0,
          street_name: ""
        }
      ],
      distance: 7620.913,
      duration: 907.262,
      ascend: 51.58660888671875,
      descend: 72.279052734375
    };
  }

  // Vérifier restrictions spécifiques van
  async checkVanRestrictions(route: DetailedRoute): Promise<VanWarning[]> {
    const warnings: VanWarning[] = [];
    
    // Exemple de vérifications
    if (route.ascend && route.ascend > 1000) {
      warnings.push({
        type: 'elevation',
        message: 'Dénivelé important (+' + Math.round(route.ascend) + 'm), vérifiez votre moteur',
        severity: 'warning'
      });
    }

    // Ajouter d'autres vérifications (ponts bas, restrictions, etc.)
    
    return warnings;
  }
}

interface VanWarning {
  type: 'height' | 'weight' | 'width' | 'elevation' | 'restriction';
  message: string;
  severity: 'info' | 'warning' | 'error';
  location?: [number, number];
}

export const routingService = new RoutingService();