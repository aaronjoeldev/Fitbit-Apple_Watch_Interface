import clock from "clock";
import { display } from "display";
import document from "document";
import { Gyroscope } from "gyroscope";
import { HeartRateSensor } from "heart-rate";
import { OrientationSensor } from "orientation";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";

/* Initialization of different variables later use  */
const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const sensors = [];
const steps = document.getElementById("steps");
const cals = document.getElementById("cals");
const floors = document.getElementById("floors");
const datum = document.getElementById("datum");
const batteryp = document.getElementById("percentage");
let goal;
let goalc;
let goalo;
let goalt;
let goalth;
let goalf;
const csteps;
const ccals;
const cfloors;
let date = new Date();
var month = date.getMonth() + 1;
var time = hours_with_leading_zeros(date) + ":" + minutes_with_leading_zeros(date);
var dateview = day_with_leading_zeros(date) + "." + month_with_leading_zeros();
var batterylevel = Math.floor(battery.chargeLevel);

/* Showing time and date with leading zeros if necessary / Could have been a single function with different variables. Might change that later */
function minutes_with_leading_zeros(dt) 
{ 
  return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
};

function hours_with_leading_zeros(dt) 
{ 
  return (dt.getHours() < 10 ? '0' : '') + dt.getHours();
};

function day_with_leading_zeros(dt) 
{ 
  return (dt.getDate() < 10 ? '0' : '') + dt.getDate();
};

function month_with_leading_zeros() 
{ 
  return (month < 10 ? '0' : '') + month;
};


clock.granularity = "minutes"; // seconds, minutes, hours

const clockLabel = document.getElementById("clock-label");


/* Getting the goals set by user and updating the values */
if (appbit.permissions.granted("access_activity")) {
   console.log(`${today.adjusted.steps} Steps`);
  
  csteps = today.adjusted.steps;
  ccals = today.adjusted.calories;
  cfloors = today.adjusted.elevationGain;
  goal = goals.steps;
  goalc = goals.calories;
  goalf = goals.elevationGain;
  goalo = goals.steps/100;
  goalt = goals.calories/100;
  goalth = goals.elevationGain/100;
  console.log(goalf + "gf");
   if (today.local.elevationGain !== undefined) {
     console.log(`${today.adjusted.elevationGain} Floor(s)`);
   }
}


  
/* Defining of variables and values for the progress circle */
const cone;
const ctwo;
const cthree;
const endCircle = document.getElementById("end-circle");
const arcSweep = document.getElementById("arc-sweep2");
const arcSweepC = document.getElementById("arc-sweep4");
const arcSweepF = document.getElementById("arc-sweep6");
const arcSweepB = document.getElementById("arc-sweep8");

/* Update the progress of the circle and the values */
function updateCircle(){
  steps.text = today.adjusted.steps;
  cals.text = today.adjusted.calories;
  floors.text = today.adjusted.elevationGain;
  batteryp.text = battery.chargeLevel;
  csteps = today.adjusted.steps;
  ccals = today.adjusted.calories;
  cfloors = today.adjusted.elevationGain;
  if(csteps > goal){
    cone = 360;
  }else{
    cone = (csteps / goalo)*3.6;
  };
  
  if(ccals > goalc){
    ctwo = 360;
  }else{
    ctwo = (ccals / goalt)*3.6;
  };
  
  if(cfloors > goalf){
    cthree = 360;
  }else{
    cthree = (cfloors / goalth)*3.6;
    
  };
  arcSweep.sweepAngle = cone;
  arcSweepC.sweepAngle = ctwo;
  arcSweepF.sweepAngle = cthree;
  arcSweepB.sweepAngle = battery.chargeLevel * 3.6;
}


/* Update time and date */
function updateClock() {
  let today = new Date();
  time = hours_with_leading_zeros(today) + ":" + minutes_with_leading_zeros(today);

  clockLabel.text = time;
  datum.text = dateview;
  }

  updateClock();

/* Change time and Date + Circle */
clock.ontick = () => 
{
  updateClock();
  updateCircle();
}


/* Heartrate Change detection */
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate; 
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmLabel.style.display = "none";
  hrmData.style.display = "none";
}


/* Circle and Value update on Display on */
display.onchange = function() {
  if (display.on) {
    console.log("ON");
    updateCircle();
  }
}


/* Sensor Update */
display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
  
  
});
