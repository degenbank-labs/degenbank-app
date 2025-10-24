import { useState, useCallback, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  useWallets,
  useSignAndSendTransaction,
} from "@privy-io/react-auth/solana";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token";
import {
  connection,
  PROGRAM_ID,
  TOKEN_MINT,
  solanaService,
} from "@/lib/solana";
import { apiService } from "@/lib/api";
import { toast } from "sonner";
import { Program, AnchorProvider, Idl, Wallet, BN } from "@coral-xyz/anchor";
import IDL from "@/idl/idl.json";

// Define wallet adapter interface
interface WalletAdapter {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  signAndSendTransaction?: (
    transaction: Transaction
  ) => Promise<{ signature: string } | string>;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
}

// Extend window interface for wallet adapters
declare global {
  interface Window {
    solana?: WalletAdapter;
    solflare?: WalletAdapter;
    backpack?: WalletAdapter;
  }
}

// Helper function to validate Solana address
const isSolanaAddress = (address: string): boolean => {
  try {
    // Solana addresses are base58 encoded and typically 32-44 characters long
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  } catch {
    return false;
  }
};

interface VaultOperationState {
  isLoading: boolean;
  error: string | null;
  txSignature: string | null;
}

interface VaultOperationResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export const useVaultOperations = () => {
  const { authenticated, user: privyUser } = usePrivy();
  const { wallets } = useWallets();
  const [depositState, setDepositState] = useState<VaultOperationState>({
    isLoading: false,
    error: null,
    txSignature: null,
  });
  const [withdrawState, setWithdrawState] = useState<VaultOperationState>({
    isLoading: false,
    error: null,
    txSignature: null,
  });

  // fake anchor provider
  const provider = useMemo(() => {
    if (!privyUser || !privyUser.wallet?.address) return null;

    const walletAddress = new PublicKey(privyUser.wallet.address);
    return new AnchorProvider(
      connection,
      {
        publicKey: walletAddress,
        signTransaction: async () => {
          throw new Error("Wallet does not support transaction signing");
        },
        signAllTransactions: async () => {
          throw new Error(
            "Wallet does not support multiple transaction signing"
          );
        },
      } as unknown as Wallet,
      AnchorProvider.defaultOptions()
    );
  }, [privyUser]);
  const program = useMemo(() => {
    if (!provider) return null;
    try {
      return new Program(IDL as unknown as Idl, provider);
    } catch (error) {
      console.error("Failed to initialize program:", error);
      return null;
    }
  }, [provider]);

  // Get wallet address (simplified to work with any Solana wallet)
  const getWalletAddress = useCallback(() => {
    if (!privyUser) return null;

    // Find any valid Solana wallet from connected wallets
    const validSolanaWallet = wallets.find((wallet) =>
      isSolanaAddress(wallet.address)
    );
    if (validSolanaWallet) {
      return validSolanaWallet.address;
    }

    // Check for embedded Solana wallet in linked accounts
    const embeddedWallet = privyUser.linkedAccounts.find(
      (account) =>
        account.type === "wallet" &&
        "address" in account &&
        isSolanaAddress(account.address)
    );

    if (embeddedWallet && "address" in embeddedWallet) {
      return embeddedWallet.address;
    }

    return null;
  }, [privyUser, wallets]);

  // Get connected Solana wallet (for backward compatibility)
  const getConnectedWallet = useCallback(() => {
    const address = getWalletAddress();
    if (!address) return null;

    // Return a wallet-like object
    return { address };
  }, [getWalletAddress]);

  // Get user's public key
  const getUserPublicKey = useCallback(() => {
    const address = getWalletAddress();
    if (!authenticated || !address) {
      throw new Error("Wallet not connected");
    }
    return new PublicKey(address);
  }, [authenticated, getWalletAddress]);

  // Create vault token mint if it doesn't exist
  const createVaultTokenMint = useCallback(
    async (
      vaultPubkey: PublicKey,
      userPubkey: PublicKey
    ): Promise<{
      mintKeypair: Keypair;
      instructions: TransactionInstruction[];
    }> => {
      const mintKeypair = Keypair.generate();
      const vtokenAuthority = vaultPubkey;

      const instructions: TransactionInstruction[] = [];

      // Create mint account
      instructions.push(
        SystemProgram.createAccount({
          fromPubkey: userPubkey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports:
            await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Initialize mint with vault authority as mint authority
      instructions.push(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          9, // decimals
          vtokenAuthority, // mint authority
          vtokenAuthority, // freeze authority
          TOKEN_PROGRAM_ID
        )
      );

      return { mintKeypair, instructions };
    },
    []
  );

  // Create deposit instruction
  const createDepositInstruction = useCallback(
    async (
      vaultPubkey: PublicKey,
      battlePubkey: PublicKey,
      userPubkey: PublicKey,
      amount: bigint,
      vaultTokenMint: PublicKey
    ): Promise<TransactionInstruction | null> => {
      // Use vault as authority
      const vtokenAuthority = vaultPubkey;

      // Get token accounts
      const depositorTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        userPubkey
      );

      const depositorVtokenAccount = await getAssociatedTokenAddress(
        vaultTokenMint,
        userPubkey
      );

      const vtokenAccount = vaultTokenMint;

      const vaultTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT, // This should be the deposit token (fkSOL), not vault token mint
        vaultPubkey,
        true
      );

      return program
        ? program.methods
            .deposit(new BN(amount.toString()))
            .accountsStrict({
              battle: battlePubkey,
              vault: vaultPubkey,
              depositor: userPubkey,
              depositorTokenAccount: depositorTokenAccount,
              depositorVtokenAccount: depositorVtokenAccount,
              vtokenAccount: vtokenAccount,
              vtokenAuthority: vtokenAuthority,
              vaultTokenAccount: vaultTokenAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .instruction()
        : null;
    },
    [program]
  );

  // Create withdraw instruction
  const createWithdrawInstruction = useCallback(
    async (
      vaultPubkey: PublicKey,
      battlePubkey: PublicKey,
      userPubkey: PublicKey,
      amount: bigint
    ): Promise<TransactionInstruction | null> => {
      // Use vault as authority
      const vtokenAuthority = vaultPubkey;

      // Get token accounts
      const depositorTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        userPubkey
      );

      const depositorVtokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        userPubkey
      );

      const vtokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        vtokenAuthority,
        true
      );

      // vaultTokenAccount: vault's fkSOL account (for receiving deposits)
      const vaultTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        vaultPubkey,
        true
      );

      return program
        ? program.methods
            .withdraw(new BN(amount.toString()))
            .accountsStrict({
              battle: battlePubkey,
              vault: vaultPubkey,
              depositor: userPubkey,
              depositorTokenAccount: depositorTokenAccount,
              depositorVtokenAccount: depositorVtokenAccount,
              vtokenAccount: vtokenAccount,
              vtokenAuthority: vtokenAuthority,
              vaultTokenAccount: vaultTokenAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
            })
            .instruction()
        : null;
    },
    [program]
  );

  const { signAndSendTransaction } = useSignAndSendTransaction();

  // Send and confirm transaction using Privy's signAndSendTransaction hook
  const sendTransaction = useCallback(
    async (
      transaction: Transaction,
      additionalSigners: Keypair[] = []
    ): Promise<string> => {
      if (!privyUser || !wallets.length) {
        throw new Error("Wallet not connected");
      }
      const selectedWallet = wallets[0];

      if (!selectedWallet.signAndSendTransaction) {
        throw new Error("Wallet does not support transaction signing");
      }
      transaction.feePayer = new PublicKey(selectedWallet.address);
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      console.log(transaction);

      const result = await selectedWallet.signAndSendTransaction({
        chain: `solana:devnet`,
        transaction: new Uint8Array(serializedTx),
      });

      const signature = typeof result === "string" ? result : result.signature;
      if (!signature) {
        throw new Error("Transaction signing failed");
      }

      return signature.toString();
    },
    [wallets, privyUser]
  );

  // Deposit function
  const deposit = useCallback(
    async (
      vaultId: string,
      amount: number,
      battleAddress?: string
    ): Promise<VaultOperationResult> => {
      try {
        setDepositState({ isLoading: true, error: null, txSignature: null });

        const userPubkey = getUserPublicKey();

        // Get vault data to retrieve the actual vault address
        const vaultData = await apiService.getVault(vaultId);

        if (!vaultData || !vaultData.vault_address) {
          throw new Error("Vault not found or vault address is missing");
        }

        // Use vault_address instead of vault_id for PublicKey creation
        const vaultPubkey = new PublicKey(vaultData.vault_address);
        const amountBigInt = BigInt(Math.floor(amount * 1e9)); // Convert to lamports

        // Build transaction
        const transaction = new Transaction();

        // Check if vault token mint exists, if not create it
        // let vaultTokenMint: PublicKey;
        // const mintKeypair: Keypair | null = null;

        // console.log("Checking vault token mint...", {
        //   vaultId: vaultData.vault_id,
        //   existingMint: vaultData.vault_token_mint,
        // });

        // if (vaultData.vault_token_mint) {
        //   // Use existing vault token mint
        //   try {
        //     vaultTokenMint = new PublicKey(vaultData.vault_token_mint);
        //     console.log(
        //       "Using existing vault token mint:",
        //       vaultTokenMint.toString()
        //     );

        //     // Check if the mint actually exists on-chain
        //     const mintInfo = await connection.getAccountInfo(vaultTokenMint);
        //     if (!mintInfo) {
        //       console.log(
        //         "Mint not found on-chain, will use TOKEN_MINT as fallback"
        //       );
        //       // Use TOKEN_MINT as fallback instead of creating new mint
        //       vaultTokenMint = TOKEN_MINT;
        //     } else {
        //       console.log("Mint exists on-chain, using existing mint");
        //     }
        //   } catch (error) {
        //     console.log(
        //       "Invalid vault token mint address, using TOKEN_MINT as fallback"
        //     );
        //     vaultTokenMint = TOKEN_MINT;
        //   }
        // } else {
        //   console.log(
        //     "No vault token mint in database, using TOKEN_MINT as fallback"
        //   );
        //   // Use TOKEN_MINT as fallback instead of creating new mint
        //   vaultTokenMint = TOKEN_MINT;
        // }

        const vaultTokenMint = new PublicKey(vaultData.vault_token_mint || "");

        // Get battle PDA or use provided address
        let battlePubkey: PublicKey;
        if (battleAddress) {
          battlePubkey = new PublicKey(battleAddress);
        } else {
          // Try to get battle PDA from vault's battle data
          if (vaultData.battle_id) {
            try {
              const battleData = await apiService.getBattle(
                vaultData.battle_id.toString()
              );
              if (battleData && battleData.pdaAddress) {
                console.log(
                  "Using battle PDA from database:",
                  battleData.pdaAddress
                );
                battlePubkey = new PublicKey(battleData.pdaAddress);
              } else {
                console.log("No battle PDA in database, calculating from user");
                const [battlePDA] =
                  await solanaService.getBattlePDA(userPubkey);
                battlePubkey = battlePDA;
              }
            } catch (error) {
              console.log(
                "Error fetching battle data, calculating from user:",
                error
              );
              const [battlePDA] = await solanaService.getBattlePDA(userPubkey);
              battlePubkey = battlePDA;
            }
          } else {
            console.log("No battle_id in vault data, calculating from user");
            const [battlePDA] = await solanaService.getBattlePDA(userPubkey);
            battlePubkey = battlePDA;
          }
        }

        // Get PDAs and token accounts
        // Try using vault itself as authority first
        const vtokenAuthority = vaultPubkey;
        console.log("Using vault as authority:", {
          vaultPubkey: vaultPubkey.toString(),
          vtokenAuthority: vtokenAuthority.toString(),
        });

        // Note: Vault authority PDA might not exist until vault is properly initialized
        // This is normal for new vaults
        const vtokenAuthorityInfo =
          await connection.getAccountInfo(vtokenAuthority);
        if (vtokenAuthorityInfo) {
          console.log("✓ Vault authority PDA exists");
        } else {
          console.log(
            "⚠ Vault authority PDA does not exist yet (normal for new vaults)"
          );
        }

        // Get all required token accounts
        const depositorTokenAccount = await getAssociatedTokenAddress(
          TOKEN_MINT,
          userPubkey
        );

        const depositorVtokenAccount = await getAssociatedTokenAddress(
          vaultTokenMint,
          userPubkey
        );

        // const vtokenAccount = vaultTokenMint;

        const vaultTokenAccount = new PublicKey(
          vaultData.vault_token_address || ""
        );

        // Validate all required accounts before creating instructions
        console.log("Validating accounts...");

        // Validate vault account
        const vaultAccountInfo = await connection.getAccountInfo(vaultPubkey);
        if (!vaultAccountInfo) {
          throw new Error(
            `Vault account does not exist: ${vaultPubkey.toString()}`
          );
        }
        console.log("✓ Vault account exists", {
          owner: vaultAccountInfo.owner.toString(),
          lamports: vaultAccountInfo.lamports,
          dataLength: vaultAccountInfo.data.length,
          isOwnedByProgram: vaultAccountInfo.owner.equals(PROGRAM_ID),
        });

        // Check if vault is owned by our program
        if (!vaultAccountInfo.owner.equals(PROGRAM_ID)) {
          console.warn(
            "⚠ Vault account is not owned by our program. Expected:",
            PROGRAM_ID.toString(),
            "Got:",
            vaultAccountInfo.owner.toString()
          );
        }

        // Validate battle account
        const battleAccountInfo = await connection.getAccountInfo(battlePubkey);
        if (!battleAccountInfo) {
          console.error(
            "❌ Battle account does not exist:",
            battlePubkey.toString()
          );
          console.log("Battle account derivation info:", {
            userPubkey: userPubkey.toString(),
            battlePubkey: battlePubkey.toString(),
            programId: PROGRAM_ID.toString(),
          });
          throw new Error(
            `Battle account does not exist: ${battlePubkey.toString()}. This battle may not be initialized yet. Please contact the administrator or try with a different battle address.`
          );
        }
        console.log("✓ Battle account exists", {
          owner: battleAccountInfo.owner.toString(),
          lamports: battleAccountInfo.lamports,
          dataLength: battleAccountInfo.data.length,
          isOwnedByProgram: battleAccountInfo.owner.equals(PROGRAM_ID),
        });

        // Validate TOKEN_MINT
        const tokenMintInfo = await connection.getAccountInfo(TOKEN_MINT);
        if (!tokenMintInfo) {
          throw new Error(
            `Token mint does not exist: ${TOKEN_MINT.toString()}`
          );
        }
        console.log("✓ Token mint exists");

        // Check and create depositor token account if needed
        const depositorTokenAccountInfo = await connection.getAccountInfo(
          depositorTokenAccount
        );
        if (!depositorTokenAccountInfo) {
          console.log("Creating depositor token account...");
          transaction.add(
            createAssociatedTokenAccountInstruction(
              userPubkey,
              depositorTokenAccount,
              userPubkey,
              TOKEN_MINT
            )
          );
        } else {
          console.log("✓ Depositor token account exists");
        }

        // Check and create depositor vtoken account if needed
        const depositorVtokenAccountInfo = await connection.getAccountInfo(
          depositorVtokenAccount
        );
        if (!depositorVtokenAccountInfo) {
          console.log("Creating depositor vault token account...");
          transaction.add(
            createAssociatedTokenAccountInstruction(
              userPubkey,
              depositorVtokenAccount,
              userPubkey,
              vaultTokenMint
            )
          );
        } else {
          console.log("✓ Depositor vault token account exists");
        }

        // Check and create vtoken account if needed
        // const vtokenAccountInfo =
        //   await connection.getAccountInfo(vtokenAccount);
        // if (!vtokenAccountInfo) {
        //   console.log("Creating vault token account...");
        //   transaction.add(
        //     createAssociatedTokenAccountInstruction(
        //       userPubkey,
        //       vaultTokenMint,
        //       vtokenAuthority,
        //       vaultTokenMint
        //     )
        //   );
        // } else {
        //   console.log("✓ Vault token account exists");
        // }

        // Check and create vault token account if needed
        const vaultTokenAccountInfo =
          await connection.getAccountInfo(vaultTokenAccount);
        if (!vaultTokenAccountInfo) {
          console.log("Creating vault token account...");
          transaction.add(
            createAssociatedTokenAccountInstruction(
              userPubkey,
              vaultTokenAccount,
              vaultPubkey,
              TOKEN_MINT
            )
          );
        } else {
          console.log("✓ Vault token account exists");
        }

        // Add deposit instruction
        const depositIx = await createDepositInstruction(
          vaultPubkey,
          battlePubkey,
          userPubkey,
          amountBigInt,
          vaultTokenMint
        );

        if (depositIx) {
          transaction.add(depositIx);
        } else {
          throw new Error("Failed to create deposit instruction");
        }

        console.log(deposit);

        // Send transaction (no additional signers needed since we're using existing mints)
        const signature = await sendTransaction(transaction, []);

        setDepositState({
          isLoading: false,
          error: null,
          txSignature: signature,
        });

        toast.success("Deposit successful!");
        return { success: true, signature };
      } catch (error) {
        console.log(error);
        const errorMessage =
          error instanceof Error ? error.message : "Deposit failed";
        setDepositState({
          isLoading: false,
          error: errorMessage,
          txSignature: null,
        });

        toast.error(`Deposit failed: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    },
    [getUserPublicKey, createDepositInstruction, sendTransaction]
  );

  // Withdraw function
  const withdraw = useCallback(
    async (
      vaultId: string,
      amount: number,
      battleAddress?: string
    ): Promise<VaultOperationResult> => {
      try {
        setWithdrawState({ isLoading: true, error: null, txSignature: null });

        const userPubkey = getUserPublicKey();

        // Get vault data to retrieve the actual vault address
        const vaultData = await apiService.getVault(vaultId);

        if (!vaultData || !vaultData.vault_address) {
          throw new Error("Vault not found or vault address is missing");
        }

        // Use vault_address instead of vault_id for PublicKey creation
        const vaultPubkey = new PublicKey(vaultData.vault_address);
        const amountBigInt = BigInt(Math.floor(amount * 1e9)); // Convert to lamports

        // Get battle PDA or use provided address
        let battlePubkey: PublicKey;
        if (battleAddress) {
          battlePubkey = new PublicKey(battleAddress);
        } else {
          const [battlePDA] = await solanaService.getBattlePDA(userPubkey);
          battlePubkey = battlePDA;
        }

        // Build transaction
        const transaction = new Transaction();

        // Add withdraw instruction
        const withdrawIx = await createWithdrawInstruction(
          vaultPubkey,
          battlePubkey,
          userPubkey,
          amountBigInt
        );

        if (withdrawIx) {
          transaction.add(withdrawIx);
        } else {
          throw new Error("Failed to create withdraw instruction");
        }

        // Send transaction
        const signature = await sendTransaction(transaction);

        setWithdrawState({
          isLoading: false,
          error: null,
          txSignature: signature,
        });

        toast.success("Withdrawal successful!");
        return { success: true, signature };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Withdrawal failed";
        setWithdrawState({
          isLoading: false,
          error: errorMessage,
          txSignature: null,
        });

        toast.error(`Withdrawal failed: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    },
    [getUserPublicKey, createWithdrawInstruction, sendTransaction]
  );

  return {
    deposit,
    withdraw,
    depositState,
    withdrawState,
    isConnected: authenticated && !!getWalletAddress(),
  };
};
