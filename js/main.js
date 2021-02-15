    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "./my_model/";

    let model, webcam, labelContainer, maxPredictions;

    let postureCheck = 0
    let badPostureMsg = ["straighten your back!", "Keep your head up!", "Shoulders down!", "Don't be lazy..", "Focus on your form."]

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        //remove button
        let button = document.getElementById("button-start");
        button.parentNode.removeChild(button);

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
        
        if(prediction[0].probability > 0.9){
            setTimeout(() => goodPosture(),400)
        }

        if(prediction[1].probability > 0.5) {
            setTimeout(() => badPosture(),400)
        }

    }


function goodPosture() {
    document.getElementsByTagName("body")[0].style.backgroundColor="green"
    let postureContainer = document.getElementById("posture-container")
    postureContainer.innerHTML = "Very nice posture!"

    postureCheck = 1

}

function badPosture() {
    document.getElementsByTagName("body")[0].style.backgroundColor="red";

    if(postureCheck == 1){
        let postureContainer = document.getElementById("posture-container")
        postureContainer.innerHTML = random(badPostureMsg)
        postureCheck = 0
    }

}

function random(array) {
    let value = array[Math.floor(Math.random() * array.length)]
    return value;
}