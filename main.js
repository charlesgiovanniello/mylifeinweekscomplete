dayjs.extend(dayjs_plugin_duration);
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);

var myBday; // Javascript counts months from 0-11 ex : Jan = 0, feb = 1;
var years;
var now;
var myBdayThisYear;
var ageInYears;
var weekThisYear;
var timeLeftThisWeek;

//Set javascript local storage to rememeber birthday
if (localStorage.getItem("birthday") != null){
  document.getElementById("start").value = dayjs(localStorage.getItem("birthday")).format('YYYY-MM-DD');
}

//Set javascript local storage to rememeber birthday
if (localStorage.getItem("years") != null){
  years = localStorage.getItem("years");
}
else{
  years=80;
}

function updateTimeParts() {
  var dateControl = document.querySelector('input[type="date"]');
  myBday = dayjs(dateControl.value);
  localStorage.setItem("birthday", myBday);
  now = dayjs();
  //Adjust for DST
  if (dayjs().format("Z") == "-04:00") {
    now = dayjs().subtract(-1, "hour");
  }

  myBdayThisYear = myBday.clone().year(now.year());
  if(now - myBdayThisYear < 0 ){
    myBdayThisYear = myBday.clone().year(now.year()-1);
  }
  ageInYears = Math.floor(dayjs.duration( now - myBday ).asYears());

  
  weekThisYear = dayjs.duration(dayjs.duration( now - myBdayThisYear).asYears(), "y").asWeeks();
  timeLeftThisWeek = dayjs.duration(1 - (weekThisYear % 1), "weeks");

  //Life in Years and Weeks
  document.querySelector(
    ".clock-time"
  ).textContent = `Year ${ageInYears}, Week ${Math.floor(weekThisYear)+1}`;

  //Countdown
  document.querySelector(".countdown-timer").textContent = `${Math.floor(
    timeLeftThisWeek.asHours()
  )} Hours, 
        ${Math.floor(timeLeftThisWeek.minutes())} Minutes,
        ${Math.floor(timeLeftThisWeek.seconds())} Seconds, left this week`;
  paintCanvas();
}

//Runs continually to update webpage as time changes
updateTimeParts();
setInterval(() => {
  updateTimeParts();
}, 500);

//Paint the canvas
paintCanvas();

//Adds all age selections to Max Age select dropdown
for(i=ageInYears+1; i<101; i++){
  addListEntry(i,i);
}

//document.getElementById("start").onchange = function() {birthdayUpdate()};
function birthdayUpdate(){
  var parent = document.getElementById("agePickerInput")
  try {
    while (parent.firstChild != null) {
      parent.removeChild(parent.firstChild);
      //console.log('removed' + parent.firstChild.value )
    }
  } catch (error) {
    
  }
  
  for(i=ageInYears+1; i<101; i++){
    addListEntry(i,i);
  }
  paintCanvas();
  
}

document.getElementById("agePickerInput").onchange = function() {maxAgeUpdate()};

function maxAgeUpdate(){
  years = document.getElementById("agePickerInput").value
  localStorage.years = years
  paintCanvas();
}

document.getElementById("start").onchange = function() {paintCanvas()};

//Canvas for weeks grid display
function paintCanvas() {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const totalWeeks = ageInYears * 53 + Math.ceil(weekThisYear);
  let count = 1;
  let h = 1;
  const element = document.getElementById("myElement");
  //Resizing
  sqrLength = 12.5;
  posArg = 19.25;
  canvas.height = years * posArg + 20;
  canvas.width = 53 * posArg;
  //console.log(canvas.width);
  colorComplete = "#A3CDD9";
  colorCurrent = "#F2CC39";
  colorFuture = "grey";

  for (i = 0; i < years; i++) {
    //Year Label
    ctx.fillStyle = "white";
    ctx.font = "11px Arial";
    ctx.fillText(i, 0, posArg * h + 10);
    for (j = 0; j <= 52; j++) {
      if (count < totalWeeks) {
        ctx.fillStyle = colorComplete;
        ctx.fillRect(j * posArg + 20, posArg * h, sqrLength, sqrLength);
      } else if (count == totalWeeks) {
        ctx.fillStyle = colorCurrent;
        ctx.fillRect(j * posArg + 20, posArg * h, sqrLength, sqrLength);
      } else {
        ctx.fillStyle = colorFuture;
        ctx.fillRect(j * posArg + 20, posArg * h, sqrLength, sqrLength);
      }
      count++;
    }
    h++;
  }
}

//Add values to list
function addListEntry(value, text) {
 
  // Create a new option element.
  var optionNode =  document.createElement("option");

  // Set the value
  optionNode.value = value;

  if (value==years){
    optionNode.selected = true;
  }

  // create a text node and append it to the option element
  optionNode.appendChild(document.createTextNode(text));

  // Add the optionNode to the datalist
  document.getElementById("agePickerInput").appendChild(optionNode);
}


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

//pass this in document.getElementById("agePickerInput")
