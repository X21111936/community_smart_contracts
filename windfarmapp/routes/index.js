var express = require('express');
var router = express.Router();
var { OpenWeatherAPI } = require("openweather-api-node")
var request = require('request')
//var fetchHistoricalWindData = require("../api/accuweather");
var API_KEY = "2241ef50ceb342a1a0fc475d45568040"

let weather = new OpenWeatherAPI({
  key: API_KEY,
  locationName: "Cloghan",
  units: "metric"
})
// Function to return a random noise level
function getRandomNoiseLevel() {
  return Math.random() < 0.5 ? 'High' : 'Normal';
}

function fetchHistoricalWindData() {
  const LOCATION_ID = '3526825';
  const API_KEY = 'OKNhoUzUhqyBSt3bS5bEXliuZKAf6mGR';
  const url = `http://dataservice.accuweather.com/currentconditions/v1/${LOCATION_ID}/historical/24?apikey=${API_KEY}&details=true`;

  return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
          if (error) {
              reject(error);
              return;
          }

          if (response.statusCode !== 200) {
              const errorResponse = response.body ? JSON.parse(response.body) : {};
              reject(new Error(`Received status code ${response.statusCode}, Code: ${errorResponse.Code}, Message: ${errorResponse.Message}`));
              return;
          }
          try {
              console.log('body:', body);
              const parsedData = JSON.parse(body);
              const windData = parsedData.map(item => ({
                  dateTime: item.LocalObservationDateTime,
                  epochTime: item.EpochTime * 1000,
                  direction: {
                      degrees: item.Wind.Direction.Degrees,
                      english: item.Wind.Direction.English,
                      localized: item.Wind.Direction.Localized
                  },
                  speed: { value: item.Wind.Speed.Metric.Value, unit: item.Wind.Speed.Metric.Unit },
                  gust: { value: item.WindGust.Speed.Metric.Value, unit: item.WindGust.Speed.Metric.Unit },
                  noiseLevel: getRandomNoiseLevel(), // Assign a random noise level here
              }));
              resolve(windData);
          } catch (parseError) {
              reject(new Error('Error parsing response data'));
          }
      });
  });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Midland Wind Energy', name:null });
});

router.post('/', function(req, res, next) {
  res.render('index', { title: 'Midland Wind Energy', name:req.body.name });
});

router.get('/wallet', function(req, res, next) {
  res.render('wallet', { title: 'Midland Wind Energy', name:null });
});

router.get('/checkBalance', function(req, res, next) {
  res.render('checkBalance', { title: 'Midland Wind Energy', name:null });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Midland Wind Energy', name:null });
});

router.get('/contracts', function(req, res, next) {
  res.render('contracts', { title: 'Midland Wind Energy', name:null });
});

router.get('/readings', async function (req, res, next) {
  // Accuweather Free Tier limit is 50 Requests per day
  try {
    var accuWeatherWindData = await fetchHistoricalWindData();
    //console.log("accuWeatherWindData", accuWeatherWindData);
    res.render('readings', { title: 'Midland Wind Energy', name: null, accuWeatherWindData });
  } catch (error) {
    console.error(`Error while connecting to AccuWeatherAPI: ${error.message}`);
    res.render('readings', { title: 'Midland Wind Energy', name: null, accuWeatherWindData: null, error });
  }
});

router.get('/forecasts', async function(req, res, next) {
  // OpenWeatherMap Free Tier only allows 3-hourly Forecasts for 5 days
  // No historical data available on Free Tier
  try {
    var data = await weather.getForecast();
    var openWeatherMapWindData = data.map(item => ({
      dateTime: item.dt,
      epochTime: item.dtRaw * 1000,
      ...item.weather.wind,
    }));
    //console.log('openWeatherMapWindData:', openWeatherMapWindData);
    res.render('forecasts', { title: 'Midland Wind Energy', name: null, openWeatherMapWindData });
  } catch (error) {
    console.error(`Error while connecting to OpenWeatherAPI: ${error.message}`);
    res.render('forecasts', { title: 'Midland Wind Energy', name: null, openWeatherMapWindData: null, error });
  }
});

module.exports = router;

