"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        appearance: {
          walletChainType: "solana-only",
          theme: "light",
          accentColor: "#000000",
          logo: undefined,
          // Add explicit wallet list to ensure Phantom and other Solana wallets are detected
          walletList: [
            "detected_solana_wallets", // This will detect all installed Solana wallets including Phantom
            "phantom", // Explicitly include Phantom
            "solflare", // Include other popular Solana wallets
            "backpack",
            "wallet_connect", // Fallback for mobile wallets
          ],
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors({
              // Enable auto-connect for better wallet detection
              shouldAutoConnect: true,
            }),
          },
        },
        loginMethods: ["google", "wallet"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
      }}
    >
      {children}
      <Toaster />
    </PrivyProvider>
  );
}
