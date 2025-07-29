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

app.get('/', (req, res) => res.send('It Work'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
