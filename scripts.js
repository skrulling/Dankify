window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});

const imgElement = document.getElementById("dankPic");
const canvas = document.getElementById("canvas");
const justClick = document.getElementById("justClick");
const error = document.getElementById("error");
const instructions = document.getElementById("instructions");
const instructionsDrag = document.getElementById("instructionsDrag");
const box = document.getElementById("box");
const input = document.getElementById("input");
const clipboardSuccess = document.getElementById("clipboardSuccess");
const clipboardSuccessOr = document.getElementById("clipboardSuccessOr");

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  box.style.display = "none";
  input.style.display = "block";
}

document.onpaste = (event) => {
  removeStuff();
  const dataTransfer = event.clipboardData || window.clipboardData;
  handleDatatransfer(dataTransfer);
};

function handleDatatransfer(dataTransfer) {
  const file = dataTransfer.files[0];
  if (!isFileImage(file)) {
    error.style.display = "block";
    return;
  }
  error.style.display = "none";
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;
    img.onload = function () {
      const dank = makeDank(img);
      writeToClipboard(dank);
      imgElement.src = dank;
      wrapInAnchor();
      justClick.style.display = "block";
      imgElement.style.display = "block";
    };
  };
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
  anchor.download = "dank.jpeg";
  imgElement.parentNode.appendChild(anchor);
  return anchor.appendChild(imgElement);
}

function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];

  return file && acceptedImageTypes.includes(file["type"]);
}

function dragging(e) {
  e.preventDefault();
  box.style.borderColor = "#ffca28";
}

function doneDragging() {
  box.style.borderColor = "white";
}

function onDrop(e) {
  e.preventDefault();
  removeStuff();
  handleDatatransfer(e.dataTransfer);
}

function removeStuff() {
  box.style.display = "none";
  instructions.style.display = "none";
  instructionsDrag.style.display = "none";
}

function writeToClipboard(compressedImage) {
  convertToPng(compressedImage)
    .then((pngUrl) => fetch(pngUrl))
    .then((res) => res.blob())
    .then((blob) => {
      let data = [new ClipboardItem({ "image/png": blob })];

      navigator.clipboard
        .write(data)
        .then(() => {
          clipboardSuccess.style.display = "block";
          clipboardSuccessOr.style.display = "block";
        })
        .catch((err) => {
          console.error("Could not write image to clipboard: ", err);
          clipboardSuccess.style.display = "none";
          clipboardSuccessOr.style.display = "none";
        });
    });
}

function convertToPng(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

document.getElementById("helpButton").addEventListener("click", function () {
  var tipContainer = document.getElementById("tip");
  var tipButton = document.getElementById("helpButton");
  if (tipContainer.style.display === "none") {
    tipContainer.style.display = "block";
    tipButton.style.display = "none";
  } else {
    tipContainer.style.display = "none";
  }
});
