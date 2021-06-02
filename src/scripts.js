const imgElement = document.getElementById("dankPic");
const canvas = document.getElementById("canvas");
const justClick = document.getElementById("justClick");
const error = document.getElementById("error");
const instructions = document.getElementById("instructions");

document.onpaste = event => {
    instructions.style.display = "none";
    const dataTransfer = event.clipboardData || window.clipboardData;
    const file = dataTransfer.files[0];
    if (!isFileImage(file)) {
        error.style.display = "block";
        return;
    }
    error.style.display = "none";
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const dank = makeDank(img);
            imgElement.src = dank;
            wrapInAnchor();
            justClick.style.display = "block";
            imgElement.style.display = "block";
        }
    }
    reader.readAsDataURL(file);
}

function makeDank(img) {
    const width = img.width;
    const height = img.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.01);
}

function wrapInAnchor() {
    const anchor = document.createElement("a");
    anchor.classList.add("flexCenter");
    anchor.href = imgElement.src;
    anchor.download = "dank.jpeg"
    imgElement.parentNode.appendChild(anchor);
    return anchor.appendChild(imgElement);
}

function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
 
    return file && acceptedImageTypes.includes(file['type'])
}