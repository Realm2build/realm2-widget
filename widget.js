// widget.js
async function fetchTokenTxCount(tokenId) {
  try {
    const res = await fetch(`https://api.multiversx.com/tokens?identifier=${tokenId}`);
    const arr = await res.json();
    return arr[0]?.numTransfers || 0;
  } catch {
    return 0;
  }
}

async function fetchAccountTxCount(addr) {
  try {
    const res  = await fetch(`https://api.multiversx.com/accounts/${addr}?withTxCount=true`);
    const json = await res.json();
    return json.data?.txCount || 0;
  } catch {
    return 0;
  }
}

async function analyzeContract() {
  const raw = document.getElementById("contractInput").value
    .replace(/[^\x21-\x7E]/g,"")
    .trim();

  const isTokenId = /^[A-Z0-9]+-[a-z0-9]+$/i.test(raw);
  const isAddress = /^erd1[0-9a-z]{58}$/i.test(raw);

  if (!isTokenId && !isAddress) {
    alert("Invalid address or Token-ID format.");
    return;
  }

  document.getElementById("loading").style.display = "block";
  ["valBlockchain","valWebsite","valSocial"].forEach(id=>document.getElementById(id).innerText="...");
  document.getElementById("totalCO2").innerText="...";
  document.getElementById("txCountDisplay").innerText="";

  const txCount = isTokenId
    ? await fetchTokenTxCount(raw)
    : await fetchAccountTxCount(raw);

  const grams = Math.round(txCount * 0.00032);

  document.getElementById("valBlockchain").innerText = `${grams} g`;
  document.getElementById("totalCO2").innerText     = `${grams} g`;
  document.getElementById("txCountDisplay").innerText = `(based on ${txCount.toLocaleString()} tx)`;
  document.getElementById("loading").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnSubmit")
          .addEventListener("click", analyzeContract);
});

