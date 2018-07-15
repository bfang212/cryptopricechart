const moment = require('moment');

const convertDatetoEpoch = date => moment.utc(date, 'YYYY-MM-DD hh:mm').unix();

const convertEpochtoDate = epoch => moment.utc(epoch, 'X').format('MMM-DD-YY hh:mm');

const setAPIParams = (coin, startDate, endDate) => {
  const ticker = {
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Litecoin: 'LTC',
  };

  let options = {};

  if (moment.utc().format('YYYY-MM-DD') === moment.utc(endDate).format('YYYY-MM-DD') && moment.utc(endDate).diff(moment.utc(startDate), 'days') <= 1) {
    options = {
      method: 'GET',
      params: {
        fsym: ticker[coin],
        tsym: 'USD',
        limit: moment.utc(endDate, 'YYYY-MM-DD hh:mm').diff(startDate, 'minutes'),
        toTs: convertDatetoEpoch(endDate),
      },
      url: 'https://min-api.cryptocompare.com/data/histominute?',
    };
  } else if (moment.utc(endDate, 'YYYY-MM-DD').diff(moment.utc(startDate, 'YYYY-MM-DD'), 'days') <= 61) {
    options = {
      method: 'GET',
      params: {
        fsym: ticker[coin],
        tsym: 'USD',
        limit: moment.utc(endDate, 'YYYY-MM-DD hh:mm').diff(startDate, 'hours'),
        toTs: convertDatetoEpoch(endDate),
      },
      url: 'https://min-api.cryptocompare.com/data/histohour?',
    };
  } else {
    options = {
      method: 'GET',
      params: {
        fsym: ticker[coin],
        tsym: 'USD',
        limit: moment.utc(endDate, 'YYYY-MM-DD hh:mm').diff(startDate, 'days') + 1,
        toTs: convertDatetoEpoch(endDate),
      },
      url: 'https://min-api.cryptocompare.com/data/histoday?',
    };
  }
  return options;
};

exports.convertDatetoEpoch = convertDatetoEpoch;
exports.convertEpochtoDate = convertEpochtoDate;
exports.setAPIParams = setAPIParams;
