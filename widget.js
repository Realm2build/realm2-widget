<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MultiversX Token Tx Count</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #12121c; color: #eee; }
    input, button { font-size: 1rem; padding: 0.5rem; }
    input { width: 250px; margin-right: 0.5rem; }
    button { cursor: pointer; }
    #result { margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>MultiversX Token Tx Count</h1>
  <input id="tokenId" placeholder="e.g. RIDE-7d18e9" />
  <button id="fetchBtn">Get Tx Count</button>
  <div id="result"></div>

  <script>
    async function fetchTxCount(id) {
      const payload = {
        query: `
          query TokenTx($id:String!) {
            token(identifier:$id) {
              transactionsCount
            }
          }
        `,
        variables: { id }
      };
      const res = await fetch("https://explorer.multiversx.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { data, errors } = await res.json();
      if (errors) throw new Error(errors.map(e => e.message).join(", "));
      return data.token.transactionsCount;
    }

    document.getElementById("fetchBtn").onclick = async () => {
      const id = document.getElementById("tokenId").value.trim();
      const out = document.getElementById("result");
      if (!id) return void (out.textContent = "⚠️ Please enter a Token ID.");
      out.textContent = "⏳ Loading…";
      try {
        const count = await fetchTxCount(id);
        out.innerHTML = `✅ <strong>${id}</strong> has <strong>${count.toLocaleString()}</strong> transactions.`;
      } catch (err) {
        console.error(err);
        out.textContent = `❌ Error: ${err.message}`;
      }
    };
  </script>
</body>
</html>

