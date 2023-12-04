
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 3aea849dfecf40509b33ffe04ea96f21");

// =========================================================================

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "face-detection",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response)
        }
    );
}


// =========================================================================
// const clarifyoutputauth = (urlofimage) => {

  
//     const PAT = '3c26075edbf54ec787f3ce2ced98c491';
//     const USER_ID = 'k8ihlsm53jgz';       
//     const APP_ID = 'Test';
//     const MODEL_ID = 'face-detection';
//     const IMAGE_URL = urlofimage;


//     const raw = JSON.stringify({
//       "user_app_id": {
//           "user_id": USER_ID,
//           "app_id": APP_ID
//       },
//       "inputs": [
//           {
//               "data": {
//                   "image": {
//                       "url": IMAGE_URL
//                   }
//               }
//           }
//       ]
//   });

//   const requestOptions = {
//       method: 'POST',
//       headers: {
//           'Accept': 'application/json',
//           'Authorization': 'Key ' + PAT
//       },
//       body: raw
//   };
//   return requestOptions;
// }

// ======================================================================

// const handleApiCall = (req, res) => {
//     const { input } = req.body;
//     fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", clarifyoutputauth(req.body.input))
//     .then(response => response.json())
//     .then(data => res.json(data))
//     .catch(err => res.status(400).json('unable to work with API'))
// }
// fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", clarifyoutputauth(req.body.input))

// ==============================================================================


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id' , '=' , id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}