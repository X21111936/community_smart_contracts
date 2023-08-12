const request = require('request');

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

module.exports = fetchHistoricalWindData;
