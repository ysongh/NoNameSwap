require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/getBalance/:walletaddress', async (req, res) => {
  const walletaddress = req.params.walletaddress;

  const url =
    "https://api.1inch.dev/balance/v1.2/1/balances/" + walletaddress;

  const config = {
    headers: {
      Authorization: `Bearer ${process.env.INCH_APIKEY}` ,
    },
    params: {},
    paramsSerializer: {
      indexes: null,
    },
  };

  try {
    const response = await axios.get(url, config);
    res.json({ data: response.data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/gettokendetail/:tokenaddress', async (req, res) => {
  const tokenaddress = req.params.tokenaddress;

  const url =
    "https://api.1inch.dev/token-details/v1.0/details/1/" + tokenaddress;

  const config = {
    headers: {
      Authorization: `Bearer ${process.env.INCH_APIKEY}` ,
    },
    params: {
      provider: "coinmarketcap",
    },
    paramsSerializer: {
      indexes: null,
    },
  };

  try {
    const response = await axios.get(url, config);
    res.json({ data: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch wallet transaction history
app.get("/api/:address/history", async (req, res) => {
  const address = req.params.address;
  const limit = req.query.limit || 10;

  try {
    const constructedUrl = `https://api.1inch.dev/history/v2.0/history/${address}/events?chainId=${1}&limit=${limit}`;

    const response = await axios.get(constructedUrl, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_APIKEY}`,
      },
    });

    // Send the response data back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});



app.get("/api/fetchNfts/:address", async (req, res) => {
  const address = req.params.address;
  const limit = req.query.limit || 50;
  const offset = req.query.offset || 0;
  const chainIds = req.query.chainIds || 1;

  const BASE_URL = "https://api.1inch.dev/nft/v2/byaddress";

  try {
    const constructedUrl = `${BASE_URL}?address=${address}&chainIds=${chainIds}&limit=${limit}&offset=${offset}`;

    const response = await axios.get(constructedUrl, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_APIKEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Axios Error: ", error.response);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
});

app.get("/api/:tokeAddress/prices/:interval", async (req, res) => {
  const { tokeAddress, interval } = req.params;

  const BASE_URL = "https://api.1inch.dev/token-details/v1.0/charts/interval";
  const CHAIN_ID = 1; // Eth

  try {
    const constructedUrl = `${BASE_URL}/${CHAIN_ID}/${tokeAddress}?interval=${interval}`;

    const response = await axios.get(constructedUrl, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_APIKEY}`,
      },
    });

    res.json(response.data.d);
  } catch (error) {
    console.error("Axios Error: ", error.response);
    res.status(500).json({ error: "Failed to fetch token price by interval" });
  }
});


app.get("/api/gas-price", async (req, res) => {
  try {
    const response = await axios.get("https://api.1inch.dev/gas-price/v1.4/1", {
      headers: {
        Authorization: `Bearer ${process.env.INCH_APIKEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching gas price]:", error);
    res.status(500).json({ message: "Error fetching gas prices" });
  }
});

app.get('/', (req, res) => res.send('It Work'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
