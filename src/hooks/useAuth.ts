"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState, useCallback } from "react";
import { apiService, type User } from "@/lib/api";
import { toast } from "sonner";

export function useAuth() {
  const { 
    ready, 
    authenticated, 
    user: privyUser, 
    login, 
    logout: privyLogout,
    linkWallet,
    unlinkWallet,
    getAccessToken,
    connectWallet: privyConnectWallet,
  } = usePrivy();
  
  const { wallets } = useWallets();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Login with backend using Privy access token
  const loginWithBackend = useCallback(async () => {
    if (!privyUser || !authenticated || isLoggingOut || isLoggingIn) return;

    setIsLoggingIn(true);
    setLoading(true);
    try {
      // Get Privy access token
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get access token from Privy');
      }

      // Login with backend
      const response = await apiService.login({ accessToken });
      
      if (response.success && response.data) {
        const { user: backendUser, token: backendToken } = response.data;
        setUser(backendUser);
        setToken(backendToken);
        apiService.setToken(backendToken);
        
        // Store token in localStorage for persistence
        localStorage.setItem('auth_token', backendToken);
        
        toast.success(response.message);
      }
    } catch (error) {
      console.error('Error logging in with backend:', error);
      toast.error('Failed to authenticate with backend');
    } finally {
      setLoading(false);
      setIsLoggingIn(false);
    }
  }, [privyUser, authenticated, getAccessToken, isLoggingOut, isLoggingIn]);

  // Sync user data (update wallet addresses if changed)
  const syncUser = useCallback(async () => {
    if (!user || !token || isSyncing) return;

    setIsSyncing(true);
    try {
      // Find Solana wallets (embedded or external like Phantom)
      const solanaWallet = wallets.find(w => 
        w.walletClientType === 'privy' ||
        w.connectorType === 'phantom' ||
        w.connectorType === 'solflare' ||
        w.connectorType === 'backpack'
      );
      
      // Find Ethereum wallets (external wallets that are not Solana)
      const ethWallet = wallets.find(w => 
        w.walletClientType !== 'privy' && 
        w.connectorType !== 'phantom' &&
        w.connectorType !== 'solflare' &&
        w.connectorType !== 'backpack'
      );
      
      const updateData: Partial<{ solanaWalletAddress: string; ethWalletAddress: string }> = {};
      
      if (solanaWallet?.address && user.solanaWalletAddress !== solanaWallet.address) {
        updateData.solanaWalletAddress = solanaWallet.address;
      }
      
      if (ethWallet?.address && user.ethWalletAddress !== ethWallet.address) {
        updateData.ethWalletAddress = ethWallet.address;
      }

      if (Object.keys(updateData).length > 0) {
        const response = await apiService.updateUser(user.id, updateData);
        if (response.success && response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      toast.error('Failed to sync user data');
    } finally {
      setIsSyncing(false);
    }
  }, [user, token, wallets, isSyncing]);

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      apiService.setToken(storedToken);
    }
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (ready && authenticated && privyUser && !user && !isLoggingOut && !isLoggingIn) {
      loginWithBackend();
    } else if (ready && !authenticated && !isLoggingOut && !isLoggingIn) {
      setUser(null);
      setToken(null);
      apiService.setToken(null);
      localStorage.removeItem('auth_token');
    }
  }, [ready, authenticated, privyUser, user, loginWithBackend, isLoggingOut, isLoggingIn]);

  // Sync wallet addresses when wallets change (debounced)
  useEffect(() => {
    if (user && wallets.length > 0) {
      const timeoutId = setTimeout(() => {
        syncUser();
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [wallets, user, syncUser]);

  const logout = async () => {
    // Set logout flag to prevent any login attempts during logout
    setIsLoggingOut(true);
    
    try {
      // Logout from backend if we have a token (but don't let this block the cleanup)
      if (token) {
        try {
          await apiService.logout();
        } catch (backendError) {
          console.warn('Backend logout failed, but continuing with cleanup:', backendError);
        }
      }
      
      // Clear all localStorage items that might contain auth data
      localStorage.removeItem('auth_token');
      // Clear any other potential auth-related localStorage items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('privy') || 
          key.includes('auth') || 
          key.includes('token') || 
          key.includes('wallet') ||
          key.includes('user')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage completely to be safe
      sessionStorage.clear();
      
      // Clear any authentication cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        if (name.includes('auth') || name.includes('token') || name.includes('privy') || name.includes('wallet')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
      
      // Clear local React state
      setUser(null);
      setToken(null);
      setLoading(false);
      
      // Clear API service token and any cached data
      apiService.setToken(null);
      
      // Logout from Privy (this should clear all Privy-related data and wallet connections)
      await privyLogout();
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout fails, still clear local data for security
      setUser(null);
      setToken(null);
      setLoading(false);
      apiService.setToken(null);
      localStorage.clear();
      sessionStorage.clear();
      
      toast.error('Logout completed with some errors, but local data has been cleared');
    } finally {
      // Reset logout flag after logout is complete
      setIsLoggingOut(false);
    }
  };

  const connectWallet = async () => {
    try {
      // Use Privy's connectWallet method which better handles external wallets like Phantom
      await privyConnectWallet();
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = async (walletAddress: string) => {
    try {
      await unlinkWallet(walletAddress);
      toast.success('Wallet disconnected successfully');
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  return {
    // Privy states
    ready,
    authenticated,
    privyUser,
    wallets,
    
    // Our app states
    user,
    loading,
    token,
    
    // Actions
    login,
    logout,
    connectWallet,
    disconnectWallet,
    syncUser,
    loginWithBackend,
  };
}