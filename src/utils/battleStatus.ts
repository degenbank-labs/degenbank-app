/**
 * Battle and Vault Status Utilities
 *
 * This module provides functions to determine the correct status of battles and vaults
 * based on their timestamp fields (locked_start, locked_end, battle_start, battle_end).
 *
 * Status Flow:
 * - Stake Phase: Before locked_start/battle_start
 * - In Battle: Between locked_start/battle_start and locked_end/battle_end
 * - Completed: After locked_end/battle_end
 */

export type BattlePhase = "Stake Phase" | "Battle Phase" | "Completed";
export type VaultStatus = "Stake Phase" | "In Battle" | "Completed";

/**
 * Determines the current battle phase based on battle_start and battle_end timestamps
 */
export function getBattlePhase(
  battleStart: string,
  battleEnd: string
): BattlePhase {
  const now = new Date();
  const startTime = new Date(battleStart);
  const endTime = new Date(battleEnd);

  if (now < startTime) {
    return "Stake Phase";
  } else if (now >= startTime && now < endTime) {
    return "Battle Phase";
  } else {
    return "Completed";
  }
}

/**
 * Determines the current vault status based on locked_start and locked_end timestamps
 */
export function getVaultStatus(
  lockedStart: string,
  lockedEnd: string
): VaultStatus {
  const now = new Date();
  const startTime = new Date(lockedStart);
  const endTime = new Date(lockedEnd);

  if (now < startTime) {
    return "Stake Phase";
  } else if (now >= startTime && now < endTime) {
    return "In Battle";
  } else {
    return "Completed";
  }
}

/**
 * Calculates time remaining until a specific timestamp
 */
export function calculateTimeRemaining(targetDate: string): string {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Gets battle phases with their status and duration for UI display
 */
export function getBattlePhases(battleStart: string, battleEnd: string) {
  const currentPhase = getBattlePhase(battleStart, battleEnd);

  const phases = [
    { name: "Stake Phase", key: "Stake Phase" as BattlePhase },
    { name: "Battle Phase", key: "Battle Phase" as BattlePhase },
    { name: "Completed", key: "Completed" as BattlePhase },
  ];

  return phases.map((phase) => {
    let status = "pending";
    let duration = "";

    if (phase.key === currentPhase) {
      status = "active";

      // Calculate duration based on current phase
      if (phase.key === "Stake Phase") {
        duration = calculateTimeRemaining(battleStart);
      } else if (phase.key === "Battle Phase") {
        duration = calculateTimeRemaining(battleEnd);
      } else {
        duration = "Completed";
      }
    } else if (
      (phase.key === "Stake Phase" &&
        (currentPhase === "Battle Phase" || currentPhase === "Completed")) ||
      (phase.key === "Battle Phase" && currentPhase === "Completed")
    ) {
      status = "completed";
      duration = "Completed";
    } else {
      status = "pending";
      duration = "Pending";
    }

    return { ...phase, status, duration };
  });
}

/**
 * Determines if deposits should be allowed based on vault status
 */
export function isDepositAllowed(
  lockedStart: string,
  lockedEnd: string
): boolean {
  const status = getVaultStatus(lockedStart, lockedEnd);
  return status === "Stake Phase";
}

/**
 * Determines if withdrawals should be allowed based on vault status
 */
export function isWithdrawAllowed(
  lockedStart: string,
  lockedEnd: string
): boolean {
  const status = getVaultStatus(lockedStart, lockedEnd);
  return status === "Completed";
}

/**
 * Gets the appropriate CSS class for status badge styling
 */
export function getStatusBadgeClass(status: VaultStatus | BattlePhase): string {
  switch (status) {
    case "Stake Phase":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "In Battle":
    case "Battle Phase":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    case "Completed":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
}
