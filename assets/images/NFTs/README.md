# Mint Your 1943 Steel Penny NFT

## Quick Start (3 steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Test SOL (for devnet testing)
```bash
# The script will give you a wallet address
# Then run:
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
```

### 3. Mint Your NFT
```bash
npm run mint
```

## What This Does

1. Creates a wallet for you (saved in `wallet.json`)
2. Uploads your NFT1STEELCENT.png to Arweave (permanent storage)
3. Creates metadata with your 1943 Steel Penny details
4. Mints the NFT on Solana
5. Gives you links to view it

## Important Notes

### First Run
- Script creates `wallet.json` with your private key
- **NEVER share this file or commit it to GitHub!**
- You need devnet SOL (free test tokens) to mint

### Testing vs Production

**DEVNET (Testing - Free):**
- Current setup uses devnet
- Get free SOL from faucet
- Perfect for testing

**MAINNET (Real):**
- Change line 12: `"devnet"` → `"mainnet-beta"`
- Need real SOL (~0.02 SOL = ~$4)
- NFT will be permanent and valuable

## Costs

**Devnet:** FREE (test network)
**Mainnet:** ~0.015-0.02 SOL (~$3-4)
- Rent: ~0.01 SOL
- Storage: ~0.005 SOL
- Transaction fees: ~0.00005 SOL

## Import to Phantom Wallet

After minting, to see your NFT in Phantom:

1. Open Phantom wallet
2. Settings → Import Private Key
3. Copy contents of `wallet.json`
4. Paste into Phantom
5. NFT will appear in your wallet

## Troubleshooting

**"Insufficient funds"**
- Run the airdrop command to get devnet SOL
- Or visit https://faucet.solana.com/

**"Module not found"**
- Make sure you ran `npm install`

**Want to use existing Phantom wallet?**
- Export private key from Phantom
- Save it as `wallet.json` in this format: `[123,45,67,...]`

## Files

- `mint-nft.js` - Main minting script
- `package.json` - Dependencies
- `wallet.json` - Your private key (auto-generated, KEEP SECRET!)
- `NFT1STEELCENT.png` - Your NFT image

## Next Steps

1. Test on devnet first
2. Once it works, switch to mainnet
3. Add real SOL to your wallet
4. Mint for real!

Your 1943 Steel Penny will be permanently on the Solana blockchain 🎉
