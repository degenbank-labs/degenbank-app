"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useWallets, useConnectWallet } from "@privy-io/react-auth";

export function Dashboard() {
  const {
    user,
    loading,
    walletAddress,
    userName,
    userImage,
    logout,
    login,
    privyUser,
  } = useAuth();

  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {userImage && userImage !== 'https://via.placeholder.com/150' ? (
                      <AvatarImage src={userImage} alt={userName} />
                    ) : null}
                    <AvatarFallback className="bg-muted text-foreground">
                      {userName ? getInitials(userName) : <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{userName}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
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
              <CardTitle className="text-2xl text-foreground">
                Welcome back, {userName}!
              </CardTitle>
              <CardDescription>
                Manage your profile and connected wallets from your dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{userName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">
                    {privyUser?.email?.address || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Privy ID</label>
                  <p className="text-muted-foreground font-mono text-sm">{privyUser?.id || 'Not linked'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-foreground">
                    {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <WalletIcon className="h-5 w-5" />
                  Wallet Addresses
                </CardTitle>
                <Button
                  onClick={connectWallet}
                  disabled={loading}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
              <CardDescription>
                Manage your Solana wallet addresses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Primary Wallet Address */}
                {walletAddress && (
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <WalletIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Primary Solana Wallet</p>
                          <button
                            onClick={() => handleCopyAddress(walletAddress)}
                            className="text-sm text-muted-foreground hover:text-foreground font-mono"
                          >
                            {formatAddress(walletAddress)}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connected Wallets from Privy */}
                {wallets.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Connected Wallets</h4>
                    <div className="space-y-3">
                      {wallets.map((wallet, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                              <WalletIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : 'External Wallet'}
                              </p>
                              <button
                                onClick={() => handleCopyAddress(wallet.address)}
                                className="text-sm text-muted-foreground hover:text-foreground font-mono"
                              >
                                {formatAddress(wallet.address)}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No wallets connected */}
                {!walletAddress && wallets.length === 0 && (
                  <div className="text-center py-8">
                    <WalletIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No wallets connected</p>
                    <Button onClick={connectWallet} disabled={loading}>
                      Connect Your First Wallet
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
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
                    <div className="text-sm text-muted-foreground">Add another Solana wallet</div>
                  </div>
                </Button>
                <Button
                  onClick={() => login()}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="font-medium">Reconnect Account</div>
                    <div className="text-sm text-muted-foreground">Refresh your connection</div>
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