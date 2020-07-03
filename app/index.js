import clock from "clock";
import document from "document";
import HeartRateSensor from "heart-rate";
import display from "display";
import { me as appbit } from "appbit";
import { today } from "user-activity";

// Update the clock every second
clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
}

// Update the clock every tick event
clock.ontick = () => updateClock();

let watch = document.getElementById("watch");
let sensorLabel = document.getElementById("sensorLabel");
let sensorIcon = document.getElementById("sensorIcon");
let toggle = 0;

watch.onmousedown = function(e) {
  toggle = (toggle + 1) % 4;
  if (toggle == 1) {
    displayHeartRate();
  } else if (toggle == 2) {
    displaySteps();
  } else if (toggle == 3) {
    displayCalories();
  } else {
    displayNothing();
  }
}

// Displays the heart rate
function displayHeartRate() {
  sensorLabel.text = "-";
  sensorIcon.style.fill = "hotpink";
  sensorIcon.href = "icons/heartIcon.png";
  
  if (HeartRateSensor) {
    const hrs = new HeartRateSensor();
    hrs.addEventListener("reading", () => {
      if (toggle == 1) {
        sensorLabel.text = hrs.heartRate;
        sensorIcon.style.fill = "hotpink";
        sensorIcon.href = "icons/heartIcon.png";
      }
    });
    display.addEventListener("change", () => {
      // Automatically stop the sensor when the screen is off to conserve battery
      display.on ? hrs.start() : hrs.stop();
    });
    hrs.start();
  }
}

// Displays the stepcount 
function displaySteps() {
  let steps = today.adjusted.steps.toLocaleString().replace(",", ".");
  if (appbit.permissions.granted("access_activity")) {
    sensorLabel.text = steps;
    sensorIcon.style.fill = "lightskyblue";
    sensorIcon.href = "icons/stepsIcon.png";
  }
}

// Displays the calories
function displayCalories() {
  let calories = today.adjusted.calories.toLocaleString().replace(",", ".");
  if (appbit.permissions.granted("access_activity")) {
    sensorLabel.text = calories;
    sensorIcon.style.fill = "sandybrown";
    sensorIcon.href = "icons/calsIcon.png";
  }
}

function displayNothing() {
  sensorLabel.text = "";
  sensorIcon.href = "";
}
