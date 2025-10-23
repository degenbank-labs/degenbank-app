import { useState, useEffect } from 'react';
import { apiService, Vault } from '@/lib/api';

export interface BattleVault {
  // Core vault data
  vault_id: string;
  vault_name: string;
  vault_strategy: string;
  total_value_locked: number;
  current_roi: number;
  participants_count: number;
  battle_status: string;
  risk_level?: 'Low' | 'Medium' | 'High';
  apy?: number;
  
  // Additional fields for battle display
  id: number;
  name: string;
  strategy: string;
  manager: string;
  tvl: number;
  participants: number;
  performance: number;
  risk: 'Low' | 'Medium' | 'High';
  status: string;
  color: string;
}

export const useBattleVaults = (battleId: string) => {
  const [vaults, setVaults] = useState<BattleVault[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBattleVaults = async () => {
    if (!battleId) return;

    setLoading(true);
    setError(null);

    try {
      const vaultsData = await apiService.getVaultsByBattleId(Number(battleId));
      
      // Transform API data to match frontend interface
        const transformedVaults: BattleVault[] = vaultsData.map((vault, index) => ({
          // Core vault data (now with dummy data from API)
          vault_id: vault.vault_id,
          vault_name: vault.vault_name,
          vault_strategy: vault.vault_strategy,
          total_value_locked: Number(vault.total_value_locked) || 0,
          current_roi: Number(vault.current_roi) || 0,
          participants_count: Number(vault.participants_count) || 0,
          battle_status: vault.battle_status || 'active',
          risk_level: vault.risk_level || 'Medium',
          apy: vault.apy || Number(vault.current_roi) || 0,
        
        // Map API fields to frontend fields
        id: Number(vault.vault_id) || index + 1,
        name: vault.vault_name,
        strategy: vault.vault_strategy,
        manager: vault.manager?.manager_name || `Manager ${index + 1}`,
        tvl: Number(vault.total_value_locked) || 0,
        participants: Number(vault.participants_count) || 0,
        // Calculate performance from current_roi
        performance: Number(vault.current_roi) || 0,
        // Determine risk level based on performance volatility or use existing risk_level
        risk: vault.risk_level || (['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High'),
        // Set status based on battle_status or default to active
        status: vault.battle_status || 'active',
        // Assign colors for UI display
        color: ['#6fb7a5', '#FB605C', '#FFB800', '#9333EA'][index % 4],
      }));

      // Sort by performance (current_roi) descending
      transformedVaults.sort((a, b) => b.performance - a.performance);

      setVaults(transformedVaults);
    } catch (err) {
      console.error('Failed to fetch battle vaults:', err);
      setError('Failed to load battle vaults');
    } finally {
      setLoading(false);
    }
  };

  const refreshVaults = () => {
    fetchBattleVaults();
  };

  useEffect(() => {
    fetchBattleVaults();
  }, [battleId]);

  return {
    vaults,
    loading,
    error,
    refreshVaults,
  };
};