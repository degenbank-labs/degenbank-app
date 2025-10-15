"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { 
  UserIcon, 
  WalletIcon, 
  ArrowRightOnRectangleIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

export function Dashboard() {
  const {
    user,
    loading,
    wallets,
    logout,
    connectWallet,
    disconnectWallet,
  } = useAuth();

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'text-purple-600' : 'text-blue-600';
  };

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'text-red-600';
    if (isVerified) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'Inactive';
    if (isVerified) return 'Verified';
    return 'Unverified';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 text-black">
                      {user?.name ? getInitials(user.name) : <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.name || user?.email}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-black">
                Welcome back, {user?.name || 'User'}!
              </CardTitle>
              <CardDescription>
                Manage your profile and connected wallets from your dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-black">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-black">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <p className="text-black">@{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <p className={`font-medium ${getRoleColor(user?.role || 'user')}`}>
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className={`font-medium ${getStatusColor(user?.isActive || false, user?.isVerified || false)}`}>
                    {getStatusText(user?.isActive || false, user?.isVerified || false)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Privy ID</label>
                  <p className="text-gray-600 font-mono text-sm">{user?.privyUserId || 'Not linked'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-black">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-black">
                  <WalletIcon className="h-5 w-5" />
                  Wallet Addresses
                </CardTitle>
                <Button
                  onClick={connectWallet}
                  disabled={loading}
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
              <CardDescription>
                Manage your Solana and Ethereum wallet addresses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Solana Wallet */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <WalletIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Solana Wallet</p>
                        {user?.solanaWalletAddress ? (
                          <button
                            onClick={() => handleCopyAddress(user.solanaWalletAddress!)}
                            className="text-sm text-gray-600 hover:text-black font-mono"
                          >
                            {formatAddress(user.solanaWalletAddress)}
                          </button>
                        ) : (
                          <p className="text-sm text-gray-500">Not connected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ethereum Wallet */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <WalletIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Ethereum Wallet</p>
                        {user?.ethWalletAddress ? (
                          <button
                            onClick={() => handleCopyAddress(user.ethWalletAddress!)}
                            className="text-sm text-gray-600 hover:text-black font-mono"
                          >
                            {formatAddress(user.ethWalletAddress)}
                          </button>
                        ) : (
                          <p className="text-sm text-gray-500">Not connected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected Wallets from Privy */}
                {wallets.length > 0 && (
                  <div>
                    <h4 className="font-medium text-black mb-3">Active Wallet Connections</h4>
                    <div className="space-y-3">
                      {wallets.map((wallet, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                              <WalletIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-black">
                                {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : 'External Wallet'}
                              </p>
                              <button
                                onClick={() => handleCopyAddress(wallet.address)}
                                className="text-sm text-gray-600 hover:text-black font-mono"
                              >
                                {formatAddress(wallet.address)}
                              </button>
                            </div>
                          </div>
                          <Button
                            onClick={() => disconnectWallet(wallet.address)}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={connectWallet}
                  disabled={loading}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="font-medium">Connect New Wallet</div>
                    <div className="text-sm text-gray-600">Add another Solana wallet</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto p-4"
                  disabled
                >
                  <div className="text-left">
                    <div className="font-medium">Export Data</div>
                    <div className="text-sm text-gray-600">Download your account data</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}