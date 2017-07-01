const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

const date = '2017-06-29';
const wrappedDate = moment(date);
const year = wrappedDate.format('YYYY');
const month = wrappedDate.format('MM');
const day = wrappedDate.format('DD');

const baseUrl = 'https://api.nasa.gov/EPIC';
const outputType = 'jpg';

try {
  fs.mkdirSync(__dirname + '/tmp');
} catch (err) {
  if (err.code !== 'EEXIST') throw err;
}

axios.get(`${ baseUrl }/api/natural/date/${ date }?api_key=yJ7I1YmphfhICUaAKkXV7fsCEGGBIEIiGblhBv0g`)
  .then(({ data }) => {
    const timepoints = data
      .map(asset => {
        return Object.assign({}, asset, {
          identifier: asset.image.split('_').slice(2).join('_')
        });
      })
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

    timepoints.forEach((timepoint, index) => {
      axios.get(
        `${ baseUrl }/archive/natural/${ year }/${ month }/${ day }/${ outputType }/epic_1b_${ timepoint.identifier }.${ outputType }?api_key=yJ7I1YmphfhICUaAKkXV7fsCEGGBIEIiGblhBv0g`,
        { responseType: 'stream' }
      )
        .then(({ data }) => {
          data.pipe(fs.createWriteStream(`./tmp/img${ index + 1 }.${ outputType }`));
        });
    });
  });
