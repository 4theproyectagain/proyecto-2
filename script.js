import {
  FaceLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/+esm";


const video = document.getElementById("video");
const emotionText = document.getElementById("emotion");


let faceLandmarker;
let lastVideoTime = -1;


// Cargar modelo de MediaPipe
async function createFaceLandmarker() {

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
  );


  faceLandmarker = await FaceLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "./models/face_landmarker.task"
      },

      runningMode: "VIDEO",

      numFaces: 1
    }
  );

  startCamera();
}



// Encender cámara
function startCamera() {

  navigator.mediaDevices.getUserMedia({
    video: {
      width: 640,
      height: 480
    }
  })

  .then((stream)=>{

    video.srcObject = stream;

  })

  .catch((error)=>{

    console.error(
      "No se pudo activar la cámara:",
      error
    );

  });

}



// Detectar rostro
async function predict() {

  if (
    video.currentTime !== lastVideoTime &&
    faceLandmarker
  ) {

    lastVideoTime = video.currentTime;


    const results =
      faceLandmarker.detectForVideo(
        video,
        performance.now()
      );


    if(results.faceLandmarks.length > 0){

      const landmarks =
        results.faceLandmarks[0];


      /*
        Aquí analizamos puntos del rostro.
        Después conectamos el modelo de emociones.
      */


      emotionText.innerHTML =
        "Rostro detectado ✅";


    } else {

      emotionText.innerHTML =
        "No se detecta rostro";

    }

  }


  requestAnimationFrame(predict);

}



// Iniciar
createFaceLandmarker()
.then(()=>{
  predict();
});