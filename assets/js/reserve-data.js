(function () {
  const TOKEN_MINT = '72NTbVWqvCxmGARj3zjEzFDybGJ5ehrgLcT1DfRdcwFH';
  const REPORTED_PHYSICAL_PENNIES = 1_295_008;
  const TOKEN_DECIMALS = 9;
  const CACHE_KEY = 'cent_token_supply';
  const JUPITER_TOKEN_API = `https://lite-api.jup.ag/tokens/v2/search?query=${TOKEN_MINT}`;

  function readCachedSupply() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      return Number.isFinite(cached?.supply) ? cached : null;
    } catch (error) {
      return null;
    }
  }

  function cacheSupply(supply) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ supply, timestamp: Date.now() }));
    } catch (error) {
      // The live request still works when storage is unavailable.
    }
  }

  async function fetchTokenSupply() {
    try {
      const response = await fetch(JUPITER_TOKEN_API);
      if (!response.ok) throw new Error(`Jupiter token API returned ${response.status}`);

      const tokens = await response.json();
      const token = tokens.find((candidate) => candidate.id === TOKEN_MINT);
      const supply = Number(token?.totalSupply);
      if (!Number.isFinite(supply)) throw new Error('Token supply unavailable');

      cacheSupply(supply);
      return { supply, checkedAt: Date.now(), source: 'jupiter' };
    } catch (error) {
      const cached = readCachedSupply();
      return cached ? { ...cached, checkedAt: cached.timestamp, source: 'cache' } : null;
    }
  }

  function formatCount(value, maximumFractionDigits = 2) {
    return value.toLocaleString(undefined, { maximumFractionDigits });
  }

  window.CENT_RESERVES = {
    tokenMint: TOKEN_MINT,
    tokenDecimals: TOKEN_DECIMALS,
    reportedPhysicalPennies: REPORTED_PHYSICAL_PENNIES,
    fetchTokenSupply,
    formatCount
  };
})();
