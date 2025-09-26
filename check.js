// revoke_delegate.js
// This script revokes any delegate for an SPL token account in a Solana wallet.
// Usage: node revoke_delegate.js <TOKEN_MINT_ADDRESS>

const { Connection, Keypair, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { getOrCreateAssociatedTokenAccount, revoke } = require("@solana/spl-token");
const fs = require("fs");

// ====== CONFIGURATION ======
// Change this to your actual private key JSON file (64 numbers array)
const WALLET_FILE = "your_wallet.json";
// Use "mainnet-beta" for real transactions; "devnet" or "testnet" for testing
const NETWORK = "mainnet-beta";

// ====== SCRIPT START ======
async function main() {
  // Check for required argument
  if (process.argv.length < 3) {
    console.error("Usage: node revoke_delegate.js <TOKEN_MINT_ADDRESS>");
    process.exit(1);
  }
  const MINT_ADDRESS = process.argv[2];

  // Load wallet
  let secretKey;
  try {
    secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(WALLET_FILE)));
  } catch (e) {
    console.error("Error reading wallet file:", e.message);
    process.exit(1);
  }
  const owner = Keypair.fromSecretKey(secretKey);

  // Connect to Solana
  const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

  try {
    // Get or create associated token account
    const ataInfo = await getOrCreateAssociatedTokenAccount(
      connection,
      owner,
      new PublicKey(MINT_ADDRESS),
      owner.publicKey
    );

    // Revoke any delegate
    const sig = await revoke(
      connection,
      owner,                // payer
      ataInfo.address,      // token account
      owner.publicKey       // owner
    );

    console.log("✅ Delegate revoked (if any existed). Transaction signature:");
    console.log(sig);
  } catch (err) {
    console.error("❌ Error during revocation:", err.message);
    process.exit(1);
  }
}

main();
