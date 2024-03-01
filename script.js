const dropArea = document.getElementById("dropArea");
const imageContainer = document.getElementById("imageContainer");

// Empêcher le navigateur d'ouvrir l'image par défaut lorsqu'elle est déposée
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Mettre en surbrillance la zone de dépôt lorsqu'une image est déposée
["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add("highlight");
}

function unhighlight() {
    dropArea.classList.remove("highlight");
}

// Récupérer l'image déposée et la traiter
dropArea.addEventListener("drop", handleDrop, false);

async function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const image = files[0];
        const imageUrl = URL.createObjectURL(image);
        displayImage(imageUrl);
        await classifyImage(image);
    }
}

async function classifyImage(imageFile) {
    // Charger le modèle MobileNet
    const mobilenetModel = await mobilenet.load();

    // Charger l'image
    const image = await loadImage(imageFile);

    const predictions = await mobilenetModel.classify(image);

    displayKeywords(predictions);
}

function loadImage(inputFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => resolve(tf.browser.fromPixels(image));
            image.onerror = (error) => reject(error);
            image.src = reader.result;
        };
        reader.readAsDataURL(inputFile);
    });
}

function displayImage(imageUrl) {
    imageContainer.innerHTML = `<img src="${imageUrl}" alt="Uploaded Image">`;
}

function displayImage(imageUrl) {
    const image = `<img src="${imageUrl}" alt="Uploaded Image">`;

    // Afficher l'image dans la div "imageContainer"
    imageContainer.innerHTML = image;

    // Modifier le style CSS pour afficher ou masquer la div "imageContainer"
    imageContainer.style.display = imageUrl ? "flex" : "none";
}

function displayKeywords(predictions) {
    const keywordsDiv = document.getElementById("keywords");
    keywordsDiv.innerHTML = "";
    predictions.forEach((prediction) => {
        keywordsDiv.innerHTML += `<p>${prediction.className}: ${Math.round(
            prediction.probability * 100
        )}%</p>`;
    });
}

async function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const image = files[0];
        const imageUrl = URL.createObjectURL(image);

        // Cacher la div avec la classe "uploadDiv"
        document.getElementById("uploadDiv").style.display = "none";

        // Afficher l'image et la classifier
        displayImage(imageUrl);
        await classifyImage(image);
    }
}
