'use strict';

const express = require('express');
const cors = require('cors');
const automl = require('@google-cloud/automl');
const fs = require('fs');
var formidable = require('formidable');

var app = express();

const corsOptions = {
    origin: '*'
}

app.get('/', function (req, res) {
    res.status(200).send('Hello World!');
});

function getAutoML(res, content, scoreThreshold='0.5') {
    const projectId = 'The GCLOUD_PROJECT';
    const computeRegion = 'region-name';
    const modelId = 'id of the model';

    const client = new automl.PredictionServiceClient();
    const modelFullId = client.modelPath(projectId, computeRegion, modelId);

    const params = {};

    if (scoreThreshold) {
        params.score_threshold = scoreThreshold;
    }

    const payload = {};
    payload.image = {imageBytes: content};

    client.predict({
        name: modelFullId,
        payload: payload,
        params: params},
        (err, response) => {
            response.payload.forEach(result => {
                res.status(200).json({
                    class_name: result.displayName,
                    class_score: result.classification.score
                });
            })
    });
}

app.post('/api/automl', cors(corsOptions), function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) {
            res.status(200).send('上傳失敗')
        }
        var content = new Buffer.from(fs.readFileSync(files.uploadFile.path)).toString('base64')
        getAutoML(res, content, '0.5');
    });
});

if (module === require.main) {
    // Start the server
    const server = app.listen(process.env.PORT || 8080, () => {
      const port = server.address().port;
      console.log(`App listening on port ${port}`);
    });
  }
  
  module.exports = app;