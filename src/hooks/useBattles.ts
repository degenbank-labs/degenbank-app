import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { Battle } from '@/lib/api';

// Extended interface for frontend display
interface BattleWithMetrics extends Battle {
  // Frontend-specific fields
  id: string;
  name: string;
  type: string;
  status: string;
  phase: string;
  timeRemaining: string;
  totalTVL: number;
  activeVaults: number;
  participants: number;
  prizePool: number;
  description: string;
  color: string;
  cubePosition: { row: number; col: number };
}

interface BattleStats {
  totalActiveBattles: number;
  totalPrizePool: number;
  totalParticipants: number;
  totalTVL: number;
}

export function useBattles() {
  const [battles, setBattles] = useState<BattleWithMetrics[]>([]);
  const [stats, setStats] = useState<BattleStats>({
    totalActiveBattles: 0,
    totalPrizePool: 0,
    totalParticipants: 0,
    totalTVL: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBattles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch battles from API
      const response = await apiService.getAllBattles(0, 100);
      
      if (response.results) {
        // Transform API data to match frontend interface
        const transformedBattles: BattleWithMetrics[] = response.results.map((battle: Battle, index: number) => ({
          ...battle,
          // Map API fields to frontend fields
          id: battle.battleId.toString(),
          name: battle.battleName || `Battle Arena #${index + 1}`,
          type: 'Mixed Strategy', // Not in API yet
          status: 'Ongoing Battle', // Not in API yet
          phase: 'Battle Phase', // Not in API yet
          // Mock time remaining calculation
          timeRemaining: `${Math.floor(Math.random() * 15 + 1)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
          // Mock additional fields since they're not in the API yet
          totalTVL: Math.floor(Math.random() * 500000 + 100000),
          activeVaults: Math.floor(Math.random() * 8 + 2),
          participants: Math.floor(Math.random() * 150 + 20),
          prizePool: Math.floor(Math.random() * 75000 + 15000),
          description: battle.battleDescription || 'Vault managers compete for the highest returns in this arena',
          color: ['#6fb7a5', '#FB605C', '#FFB800', '#9333EA'][index % 4],
          cubePosition: { 
            row: Math.floor(index / 2), 
            col: index % 2 
          },
        }));

        setBattles(transformedBattles);

        // Calculate stats
        const battleStats: BattleStats = {
          totalActiveBattles: transformedBattles.filter(b => b.status === 'Ongoing Battle').length,
          totalPrizePool: transformedBattles.reduce((sum, b) => sum + b.prizePool, 0),
          totalParticipants: transformedBattles.reduce((sum, b) => sum + b.participants, 0),
          totalTVL: transformedBattles.reduce((sum, b) => sum + b.totalTVL, 0),
        };

        setStats(battleStats);
      }
    } catch (err) {
      console.error('Error fetching battles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch battles');
    } finally {
      setLoading(false);
    }
  };

  const getBattleById = async (battleId: string): Promise<BattleWithMetrics | null> => {
    try {
      const battle = await apiService.getBattle(battleId);
      
      if (battle) {
        return {
          ...battle,
          // Map API fields to frontend fields
          id: battle.battleId.toString(),
          name: battle.battleName || `Battle Arena`,
          type: 'Mixed Strategy', // Not in API yet
          status: 'Ongoing Battle', // Not in API yet
          phase: 'Battle Phase', // Not in API yet
          timeRemaining: `${Math.floor(Math.random() * 15 + 1)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
          totalTVL: Math.floor(Math.random() * 500000 + 100000),
          activeVaults: Math.floor(Math.random() * 8 + 2),
          participants: Math.floor(Math.random() * 150 + 20),
          prizePool: Math.floor(Math.random() * 75000 + 15000),
          description: battle.battleDescription || 'Vault managers compete for the highest returns in this arena',
          color: '#6fb7a5',
          cubePosition: { row: 0, col: 0 },
        };
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching battle:', err);
      throw err;
    }
  };

  const refreshBattles = () => {
    fetchBattles();
  };

  useEffect(() => {
    fetchBattles();
  }, []);

  return {
    battles,
    stats,
    loading,
    error,
    refreshBattles,
    getBattleById,
  };
}