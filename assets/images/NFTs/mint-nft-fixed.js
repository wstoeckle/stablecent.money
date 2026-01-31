import { Metaplex, keypairIdentity, mockStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import fs from "fs";

async function mintNFT() {
  console.log("🚀 Starting NFT minting process...\n");

  // Step 1: Set up connection (using devnet for testing)
  const connection = new Connection(clusterApiUrl("devnet"));
  console.log("✅ Connected to Solana devnet");

  // Step 2: Create or load wallet
  let wallet;
  const walletPath = "./wallet.json";
  
  if (fs.existsSync(walletPath)) {
    console.log("✅ Loading existing wallet...");
    const secretKey = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
  } else {
    console.log("✅ Creating new wallet...");
    wallet = Keypair.generate();
    fs.writeFileSync(walletPath, JSON.stringify(Array.from(wallet.secretKey)));
    console.log("⚠️  New wallet created and saved to wallet.json");
    console.log("⚠️  KEEP THIS FILE SAFE! It's your private key!");
  }

  console.log(`\n💼 Wallet Address: ${wallet.publicKey.toString()}`);

  // Step 3: Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`💰 Balance: ${balance / 1e9} SOL`);

  if (balance === 0) {
    console.log("\n⚠️  Your wallet has no SOL!");
    console.log("Run this command to get free devnet SOL:");
    console.log(`solana airdrop 2 ${wallet.publicKey.toString()} --url devnet`);
    console.log("\nOr visit: https://faucet.solana.com/");
    return;
  }

  // Step 4: Initialize Metaplex with mockStorage (works perfectly on devnet)
  console.log("\n📦 Initializing Metaplex...");
  console.log("ℹ️  Using mock storage for devnet (for mainnet, use Arweave/Irys)");
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(mockStorage());

  // Step 5: Upload image
  console.log("\n🖼️  Uploading image...");
  const imageBuffer = fs.readFileSync("./NFT1STEELCENT.png");
  const imageUri = await metaplex.storage().upload(imageBuffer);
  console.log(`✅ Image uploaded: ${imageUri}`);

  // Step 6: Create and upload metadata
  console.log("\n📝 Creating metadata...");
  const metadata = {
    name: "NFT#1943STEEL",
    symbol: "STEEL",
    description: "1943 Steel Penny - Edition 1/1. A rare wartime steel cent commemorating a unique year in numismatic history.",
    image: imageUri,
    attributes: [
      { trait_type: "Year", value: "1943" },
      { trait_type: "Material", value: "Steel" },
      { trait_type: "Edition", value: "1/1" },
      { trait_type: "Type", value: "Historical Coinage" }
    ],
    properties: {
      files: [{ uri: imageUri, type: "image/png" }],
      category: "image",
    }
  };

  console.log("📤 Uploading metadata...");
  const metadataUri = await metaplex.storage().uploadJson(metadata);
  console.log(`✅ Metadata uploaded: ${metadataUri}`);

  // Step 7: Mint the NFT
  console.log("\n🎨 Minting NFT...");
  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: metadata.name,
    sellerFeeBasisPoints: 0, // 0% royalty
    symbol: metadata.symbol,
  });

  console.log("\n" + "=".repeat(60));
  console.log("🎉 SUCCESS! Your NFT has been minted!");
  console.log("=".repeat(60));
  console.log(`\n📍 NFT Address: ${nft.address.toString()}`);
  console.log(`\n🔗 View on Solana Explorer:`);
  console.log(`   https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);
  console.log(`\n🔗 View on Solscan:`);
  console.log(`   https://solscan.io/token/${nft.address.toString()}?cluster=devnet`);
  console.log(`\n💼 Owner wallet: ${wallet.publicKey.toString()}`);
  console.log(`\n📋 Next step: Transfer to your Phantom wallet`);
  console.log(`   Run this command:`);
  console.log(`   spl-token transfer ${nft.address.toString()} 1 EnTej2oF99UjGVD9iaoPptPUCysTw8Lm692nCJJ4F9pH --url devnet --fund-recipient`);
  console.log(`\n⚠️  Note: This uses mock storage for devnet testing.`);
  console.log(`   For mainnet (real NFT), change to irysStorage() and use mainnet-beta.`);
  console.log("\n");
}

mintNFT().catch((error) => {
  console.error("\n❌ Error:", error.message);
  console.error("\nFull error:", error);
});
