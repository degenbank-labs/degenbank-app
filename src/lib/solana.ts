import {
  Connection,
  PublicKey,
  Transaction,
  Signer,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
} from "@solana/web3.js";

// Solana configuration
export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
export const PROGRAM_ID = new PublicKey(
  "D48CDyR4fnT57dTUnH2LYEYJA3CmoSMSEJpxa1TPKNPU"
);
export const VAULT_PDA = new PublicKey(
  "4KbdwX1vhADhW6xonCvEp6hdVLKMsJatbUbYompER32q"
);
export const SOL_DUMMY_TOKEN = new PublicKey(
  "6mHmTJ3irg5MnYraS4XAZddcJfd6BmDdvsRvzDnsimke"
);

// Connection instance
export const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Utility functions for Solana program interactions
export class SolanaService {
  private connection: Connection;
  private programId: PublicKey;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, "confirmed");
    this.programId = PROGRAM_ID;
  }

  // Get vault PDA
  async getVaultPDA(manager: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), manager.toBuffer()],
      this.programId
    );
  }

  // Get battle PDA
  async getBattlePDA(authority: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("battle"), authority.toBuffer()],
      this.programId
    );
  }

  // Get vault account info
  async getVaultAccount(vaultPubkey: PublicKey) {
    try {
      const accountInfo = await this.connection.getAccountInfo(vaultPubkey);
      return accountInfo;
    } catch (error) {
      console.error("Error fetching vault account:", error);
      return null;
    }
  }

  // Get battle account info
  async getBattleAccount(battlePubkey: PublicKey) {
    try {
      const accountInfo = await this.connection.getAccountInfo(battlePubkey);
      return accountInfo;
    } catch (error) {
      console.error("Error fetching battle account:", error);
      return null;
    }
  }

  // Get token account balance
  async getTokenBalance(tokenAccount: PublicKey): Promise<number> {
    try {
      const balance =
        await this.connection.getTokenAccountBalance(tokenAccount);
      return balance.value.uiAmount || 0;
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return 0;
    }
  }

  // Get SOL balance
  async getSolBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      return 0;
    }
  }

  // Simulate transaction
  async simulateTransaction(
    transaction: Transaction
  ): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    try {
      const simulation = await this.connection.simulateTransaction(transaction);
      return simulation;
    } catch (error) {
      console.error("Error simulating transaction:", error);
      throw error;
    }
  }

  // Send and confirm transaction
  async sendAndConfirmTransaction(
    transaction: Transaction,
    signers: Signer[]
  ): Promise<string> {
    try {
      const signature = await this.connection.sendTransaction(
        transaction,
        signers
      );
      await this.connection.confirmTransaction(signature, "confirmed");
      return signature;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }
}

export const solanaService = new SolanaService();
