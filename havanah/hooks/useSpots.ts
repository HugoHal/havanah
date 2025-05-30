import { useState, useEffect } from 'react';
import { Spot, SpotFilters } from '../types/Spot';
import { spotService } from '../services/spotService';

export function useSpots(filters?: SpotFilters) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpots = async (newFilters?: SpotFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await spotService.getSpots(newFilters || filters);
      setSpots(data);
    } catch (err) {
      setError('Erreur lors du chargement des spots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpots();
  }, []);

  const refetch = () => loadSpots();
  const applyFilters = (newFilters: SpotFilters) => loadSpots(newFilters);

  return {
    spots,
    loading,
    error,
    refetch,
    applyFilters,
  };
}

export function useSpotSearch() {
  const [results, setResults] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await spotService.searchSpots(query);
      setResults(data);
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, search };
}