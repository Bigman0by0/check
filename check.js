const { Connection, Keypair, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { getOrCreateAssociatedTokenAccount, revoke } = require("@solana/spl-token");
const fs = require("fs");

// Load your private key (replace with your actual private key file)
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("your_wallet.json", "utf8")));
const owner = Keypair.fromSecretKey(secretKey);

// Set up connection (use "mainnet-beta" for mainnet)
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// The mint address of the token you want to revoke delegate for (e.g., SOL wrapped token, or other SPL token)
const MINT_ADDRESS = "So11111111111111111111111111111111111111112"; // e.g., USDC's mint, or WSOL mint

(async () => {
  try {
    // Get your associated token account for this mint
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      owner,
      new PublicKey(MINT_ADDRESS),
      owner.publicKey
    );
    // Revoke delegate (removes any delegate for this token account)
    const tx = await revoke(
      connection,
      owner,            // payer
      ata.address,      // token account
      owner.publicKey   // owner
    );
    console.log("Revoke transaction signature:", tx);
    console.log("Delegate (if any) is now revoked.");
  } catch (err) {
    console.error("Error revoking delegate:", err);
  }
})();
