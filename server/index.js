const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { setAPIParams, convertEpochtoDate } = require('./util.js');

const app = express();

app.use(express.static(`${__dirname}/../react-client/dist`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/prices', (req, res) => {
  const { coin, startDate, endDate } = req.query;

  const options = setAPIParams(coin, startDate, endDate);

  axios(options)
    .then(({ data }) => {
      const cleanData = data.Data.map((item, index) => ({
        date: convertEpochtoDate(item.time),
        price: item.close.toLocaleString('us-EN', { style: 'currency', currency: 'USD' }),
        count: index,
        rawPrice: item.close,
      }));
      res.json(cleanData.slice());
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(8080, () => {
  console.log('listening on port 8080!');
});

