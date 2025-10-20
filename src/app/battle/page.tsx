'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrophyIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  FlameIcon, 
  EyeIcon,
  SwordIcon,
  CrownIcon,
  ZapIcon,
  TargetIcon
} from 'lucide-react'

// Mock data for battle arenas
const ongoingBattles = [
  {
    id: 1,
    name: "DCA Arena - Phase #1",
    status: "ongoing",
    phase: "Battle Phase",
    timeRemaining: "5 days 12 hours",
    totalTVL: 150000,
    participants: 3,
    vaults: [
      {
        id: 1,
        name: "Solana DCA",
        manager: "The Scientist",
        strategy: "DCA into SOL with weekly rebalancing",
        tvl: 50000,
        roi: 12.5,
        risk: "medium",
        position: 1,
        volatility: 8.2,
        isDisqualified: false
      },
      {
        id: 2,
        name: "BONK DCA",
        manager: "Degen Master",
        strategy: "Aggressive BONK accumulation",
        tvl: 45000,
        roi: 8.3,
        risk: "high",
        position: 2,
        volatility: 15.7,
        isDisqualified: false
      },
      {
        id: 3,
        name: "Raydium DCA",
        manager: "The Banker",
        strategy: "Conservative RAY farming",
        tvl: 55000,
        roi: 6.8,
        risk: "low",
        position: 3,
        volatility: 4.1,
        isDisqualified: false
      }
    ]
  }
]

const openDeposits = [
  {
    id: 2,
    name: "Lending Arena",
    status: "open",
    phase: "Stake Phase",
    timeRemaining: "2 days to start",
    totalTVL: 0,
    participants: 3,
    vaults: [
      {
        id: 4,
        name: "Jupiter USDC Vault",
        manager: "Yield Hunter",
        strategy: "Deposit USDC in Jupiter lending",
        tvl: 0,
        expectedROI: "8-12%",
        risk: "low"
      },
      {
        id: 5,
        name: "Drift USDC Vault",
        manager: "Risk Taker",
        strategy: "Deposit USDC in Drift protocol",
        tvl: 0,
        expectedROI: "10-15%",
        risk: "medium"
      },
      {
        id: 6,
        name: "Kamino USDC Vault",
        manager: "Stable Genius",
        strategy: "Deposit USDC in Kamino lending",
        tvl: 0,
        expectedROI: "7-10%",
        risk: "low"
      }
    ]
  },
  {
    id: 3,
    name: "RWA VS Degen",
    status: "open",
    phase: "Stake Phase",
    timeRemaining: "5 days to start",
    totalTVL: 0,
    participants: 2,
    vaults: [
      {
        id: 7,
        name: "RWA Vault",
        manager: "Traditional Trader",
        strategy: "70% T-bills + 30% DeFi stable yield",
        tvl: 0,
        expectedROI: "6-9%",
        risk: "low"
      },
      {
        id: 8,
        name: "Degen Vault",
        manager: "Memecoin Warrior",
        strategy: "50% SOL/USDC LP + 30% Drift + 20% memecoins",
        tvl: 0,
        expectedROI: "15-25%",
        risk: "high"
      }
    ]
  }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'high': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1: return <CrownIcon className="h-4 w-4 text-yellow-500" />
    case 2: return <TrophyIcon className="h-4 w-4 text-gray-400" />
    case 3: return <TargetIcon className="h-4 w-4 text-orange-500" />
    default: return null
  }
}

export default function BattlePage() {
  const [selectedTab, setSelectedTab] = useState("ongoing")

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <SwordIcon className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Yield Arena
          </h1>
          <SwordIcon className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to the arena, gladiators. Vaults clash, strategies collide. 
          Degens stake with diamond hands. Only the sharpest minds farm the fattest yields.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center space-x-1">
            <ZapIcon className="h-4 w-4" />
            <span>Every APY&apos;s a flex</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <FlameIcon className="h-4 w-4" />
            <span>Every epoch&apos;s a bloodbath</span>
          </span>
          <span>•</span>
          <span>No losses. Just on-chain dominance.</span>
        </div>
      </div>

      {/* Arena Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ongoing" className="flex items-center space-x-2">
            <FlameIcon className="h-4 w-4" />
            <span>Ongoing Battles</span>
          </TabsTrigger>
          <TabsTrigger value="open" className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Open for Deposits</span>
          </TabsTrigger>
        </TabsList>

        {/* Ongoing Battles */}
        <TabsContent value="ongoing" className="space-y-6">
          {ongoingBattles.map((arena) => (
            <Card key={arena.id} className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FlameIcon className="h-5 w-5 text-red-500" />
                      <span>{arena.name}</span>
                      <Badge variant="destructive">{arena.phase}</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{arena.timeRemaining}</span>
                      </span>
                      <span>Total TVL: {formatCurrency(arena.totalTVL)}</span>
                      <span>{arena.participants} Gladiators</span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Spectate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Live Leaderboard</h4>
                  <div className="grid gap-4">
                    {arena.vaults.map((vault) => (
                      <Card key={vault.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getPositionIcon(vault.position)}
                              <div>
                                <h5 className="font-semibold">{vault.name}</h5>
                                <p className="text-sm text-muted-foreground">
                                  Managed by {vault.manager}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {vault.strategy}
                                </p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge className={getRiskColor(vault.risk)}>
                                  {vault.risk} risk
                                </Badge>
                                <span className="font-bold text-lg text-green-600">
                                  +{vault.roi}%
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                TVL: {formatCurrency(vault.tvl)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Volatility: {vault.volatility}%
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Performance</span>
                              <span>{vault.roi}% ROI</span>
                            </div>
                            <Progress value={vault.roi} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Open Deposits */}
        <TabsContent value="open" className="space-y-6">
          {openDeposits.map((arena) => (
            <Card key={arena.id} className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                      <span>{arena.name}</span>
                      <Badge variant="secondary">{arena.phase}</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{arena.timeRemaining}</span>
                      </span>
                      <span>{arena.participants} Vaults Ready</span>
                    </CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Enter Arena
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Choose Your Vault</h4>
                  <div className="grid gap-4">
                    {arena.vaults.map((vault) => (
                      <Card key={vault.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold">{vault.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                Managed by {vault.manager}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {vault.strategy}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge className={getRiskColor(vault.risk)}>
                                  {vault.risk} risk
                                </Badge>
                                <span className="font-bold text-lg text-blue-600">
                                  {vault.expectedROI}
                                </span>
                              </div>
                              <Button size="sm" variant="outline">
                                Stake Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* AI Commentary Section */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ZapIcon className="h-5 w-5 text-purple-500" />
            <span>Arena Commentary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border-l-4 border-l-purple-500">
              <p className="text-sm italic">
                &quot;The Scientist maintains the lead with steady 12.5% gains, but Degen Master&apos;s volatility 
                spikes to 15.7% — one wrong trade could trigger DQ. The Banker plays it safe with 
                conservative 6.8% returns, staying well below the danger zone.&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                AI Analysis • Updated 2 hours ago
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border-l-4 border-l-orange-500">
              <p className="text-sm italic">
                &quot;Market volatility increasing. BONK DCA vault showing signs of stress. 
                All eyes on the 10% loss threshold — any vault hitting this mark gets 
                automatically disqualified from the current epoch.&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Risk Alert • Updated 4 hours ago
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}