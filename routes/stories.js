const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Story = require('../models/Story');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
require('dotenv').config();

// Initialize Cloudinary with your Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// const generateAudio2 = async (id1) => {
//     try {
//         console.log(id1);
//         const url = `https://api.play.ht/api/v2/tts/${id1}`;
//         console.log(url);
//         // const response = setTimeout()=> { };
//         const response = await axios.get(url, {
//             headers: {
//                 "accept": 'application/json',
//                 "AUTHORIZATION": '063cd4acbfab4a74b28d85cacc10ccde',
//                 'X-USER-ID': 'DkM7nfjYFxMc5Agax3qT4F4EqSj2',

//             },
//         });

//         console.log("Response 2:");
//         console.log(response.data);
//         // console.log(response.data.output.url);
//         // You can return the URL or handle it as needed
//         const url1 = await response.data.output.url;
//         return url1;
//     } catch (error) {
//         console.error('Error:', error);
//         // Handle error as needed
//     }
// };

// const generateAudio = async (content) => {
//     try {
//         const url = 'https://api.play.ht/api/v2/tts';
//         const options = {
//             method: 'POST',
//             headers: {
//                 'accept': 'application/json',
//                 'content-type': 'application/json',
//                 'AUTHORIZATION': '063cd4acbfab4a74b28d85cacc10ccde',
//                 'X-USER-ID': 'DkM7nfjYFxMc5Agax3qT4F4EqSj2',
//             },
//             body: JSON.stringify({
//                 text: content,
//                 voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
//                 output_format: 'mp3',
//                 voice_engine: 'PlayHT2.0',
//             }),
//         };

//         const response = await axios.post(url, options.body, { headers: options.headers });
//         if (response.data && response.data.id) {
//             console.log("response 1")
//             console.log(response.data)
//             const id1 = response.data.id;
//             const audioUrl = await generateAudio2(id1);
//             return audioUrl;
//         } else {
//             console.error('Failed to generate audio:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         return null;
//     }
// };

// const aws = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// const s3 = new aws.S3({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     region: process.env.S3_BUCKET_REGION,
// });

// const upload = (bucketName) =>
//     multer({
//         storage: multerS3({
//             s3,
//             bucket: bucketName,
//             metadata: function (req, file, cb) {
//                 cb(null, { fieldName: file.fieldname });
//             },
//             key: function (req, file, cb) {
//                 cb(null, `image-${Date.now()}.jpeg`);
//             },
//         }),
//     });

// Route 1: fetching all stories user data : get "/api/stories/savedstories" : login required

// const generateAudio = async (text) => {
//     var asticaAPI_input = text; // Use the text as the prompt

//     var asticaAPI_key = '20763766-B95D-4836-A6D4-28AF0074C1FB8F14F7EA-CD87-43FB-9E1E-AF8223920D9A'
//     // const asticaAPI_key = ''
//     var asticaAPI_timeout = 10; // in seconds.
//     var asticaAPI_endpoint = 'https://voice.astica.ai/speak';
//     var asticaAPI_modelVersion = '1.0_full';
//     var asticaAPI_voiceid = 4001; // see list of voice id: https://astica.ai/voice/documentation/
//     var asticaAPI_lang = 'en-IN'; // language code

//     // Define payload dictionary
//     const asticaAPI_payload = {
//         tkn: asticaAPI_key,
//         modelVersion: asticaAPI_modelVersion,
//         input: asticaAPI_input,
//         voice: asticaAPI_voiceid,
//         lang: asticaAPI_lang,
//     };

//     axios.post(asticaAPI_endpoint, asticaAPI_payload, {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         timeout: asticaAPI_timeout * 1000,
//     })
//         .then(function (response) {
//             if (response.status === 200) {
//                 // console.log('astica API Output:');
//                 console.log(response.data);
//                 // Handle asticaAPI response
//                 if (response.data.status === 'error') {
//                     console.log('Output:\n', response.data.error);
//                     return null;
//                 } else if (response.data.status === 'success') {
//                     const audioData = new Uint8Array(response.data.wavBuffer.data);
//                     console.log(audioData);
//                     // Convert the Uint8Array to a base64 string
//                     const base64String = btoa(String.fromCharCode.apply(null, audioData));
//                     console.log(base64String);
//                     // Create a new audio element with the base64 data
//                     const newAudioElement = `data:audio/mp3;base64,${base64String}`;
//                     console.log(newAudioElement);
//                     return newAudioElement;

//                 }
//             }
//         }
//         )
//         .catch((error) => {
//             console.log(error);
//             return null;

//         });

// }


router.get('/savedstories', fetchUser, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id });
        res.json(stories);
    } catch (error) {
        res.status(500).send("Internal error has occurred");
    }
});

router.post('/createstory', fetchUser, async (req, res) => {
    try {
        const { title, description, rating } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const processedDescriptions = [];

        for (const item of description) {
            // const voice1 = await generateAudio(item.text);

            const imageSrc = `data:image/jpeg;base64,${item.image}`;

            try {
                // Upload image to Cloudinary
                const imageCloudinaryResponse = await cloudinary.uploader.upload(imageSrc, {
                    folder: 'saveStoriesImage',
                    resource_type: 'image',
                });

                // const voiceCloudinaryResponse = await cloudinary.uploader.upload(voice1, {
                //     folder: 'saveStoriesAudio',
                //     resource_type: 'video',
                // })

                const processedItem = {
                    image: imageCloudinaryResponse ? imageCloudinaryResponse.secure_url : null,
                    voice: item.text,
                    text: item.text,
                };
                processedDescriptions.push(processedItem);
            } catch (uploadError) {
                return res.status(500).send("Upload failed");
            }
        }

        // All images and audio have been uploaded, proceed to save the story
        const story = new Story({
            title: title,
            description: processedDescriptions,
            user: req.user.id,
            rating: rating,
        });

        const savedStory = await story.save();
        res.json(savedStory);
        console.log(savedStory)
        console.log("story saved")

    } catch (error) {
        res.status(500).send("Internal error has occurred");
    }
});


//Route 2: creating notes for user :Post "/api/notes/createstory" :login required
// router.post('/createstory', fetchUser, [
//     body('title', 'Enter a valid title').isLength({ min: 3 }),
//     body('description', 'Enter a valid description').isArray({ min: 1 }), // Make sure it's an array
// ], async (req, res) => {
//     try {
//         const { title, description } = req.body;

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const processedDescriptions = [];

//         // Keep track of the number of images successfully uploaded
//         let imagesUploaded = 0;

//         for (const item of description) {
//             const imageBase64 = `data:image/png;base64,${item.image}`;
//             const imageBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');

//             const params = {
//                 Bucket: process.env.S3_BUCKET_NAME,
//                 Key: `image-${Date.now()}.png`, // Use a unique key for each image
//                 Body: imageBuffer,
//                 ContentType: 'image/png',
//             };

//             s3.upload(params, (err, data) => {
//                 if (err) {
//                     console.error(err);
//                 } else {
//                     processedDescriptions.push({
//                         imageUrl: data.Location,
//                         text: item.text,
//                     });
//                     // imagesUploaded++;

//                     if (processedDescriptions.length === description.length) {
//                         // All images have been uploaded, proceed to save the story
//                         const story = new Story({
//                             title: title,
//                             description: processedDescriptions,
//                             user: req.user.id
//                         });

//                         story.save((err, savedStory) => {
//                             if (err) {
//                                 console.error(err);
//                                 return res.status(500).send("Failed to save the story");
//                             }
//                             res.json(savedStory);
//                         });
//                     }
//                 }
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal error has occurred");
//     }
// });

//Route 3: updating Stories for user :Put "/api/stories/updatestory" :login required
router.put('/updatestories/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, rating } = req.body;

        // Create a newStory object
        const newStory = {
            user: req.user.id,
            title: title,
            description: description,
            rating: rating,
        };

        // Find the story to be updated and check permissions
        let story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).send("Not found");
        }

        if (story.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the story and get the updated document
        story = await Story.findOneAndUpdate({ _id: req.params.id }, { $set: newStory }, { new: true });

        res.json({ story });
    } catch (error) {
        res.status(500).send("Internal error has occurred");
    }
});


//Route 4: Deleting notes for user :delete "/api/notes/deletenotes" :login required
// router.delete('/deletestory/:id', fetchUser, async (req, res) => {
//     try {
//         // find the note to be deleted and delete it
//         let note = await Story.findById(req.params.id);
//         if (!note) { return res.status(404).send("Not found") }

//         // allow deletion if user owns the note
//         if (note.user.toString() !== req.user.id) {
//             return res.status(401).send("Not Allowed");
//         }

//         note = await Story.findByIdAndDelete(req.params.id)
//         res.json({ "Success": "Successfully note has been deleted", note: note });
//     }
//     // catch if error has occured
//     catch (error) {
//         res.status(500).send("Internal error has occured");
//     }
// })


module.exports = router;