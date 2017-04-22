const axios = require('axios');
const moment = require('moment');

const date = '2016-07-14';
const wrappedDate = moment(date);
const year = wrappedDate.format('YYYY');
const month = wrappedDate.format('MM');
const day = wrappedDate.format('DD');

const baseUrl = 'https://epic.gsfc.nasa.gov';

axios.get(`${ baseUrl }/api/enhanced/date/${ date }`)
  .then(({ data }) => {
    const asset = data[0];
    const imageIdentifier = asset.image.split('_').slice(2).join('_');

    axios.get(
      `${ baseUrl }/archive/natural/${ year }/${ month }/${ day }/jpg/epic_1b_${ imageIdentifier }.jpg`,
      { responseType: 'arraybuffer' }
    )
      .then(({ data }) => {
        console.log(data);
      });
  });
