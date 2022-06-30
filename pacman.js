// pos is the PacMan image position variable- it is set to 0 initially
// pos Calculated is maintained seperately from actual pixel position
// ideally I will evetually set this to where the center of pacman actually is and set him back by his z location
// or crop his image photos, if its posible to have non rectagular ones
// then pixel position is generated from calculated when moving to avoid accumulated rounding errors
var posXCalculated = 0;
var posYCalculated = 0;
let v = 20;
let aX = 0;
let aY = 0;
let vX = 0;
let vY = 0;
// console.log('v: ' + v);
//pageWidth is the width of the webpage. This is later used to calculate when Pac-Man needs to turn around. 
let pageWidth  = window.innerWidth;
let pageHeight = window.innerHeight;


//This array contains all the PacMan movement images
const pacArray = [
  ['./images/PacMan1.png', './images/PacMan2.png'],
  ['./images/PacMan3.png', './images/PacMan4.png'],
];
// this variable defines what photo should represent PacMan:
//keeping eyehole on top
// 0 = right facing
// 1 = left facing (mirror image)
var mirrorImage = 0;

//wait stops pacman from moving this many times, number, negative has same effect as positive, 
//I'm not sure if I'll still need this after I'm done reorganizing pacman.js
//Nope need to make pacman wait with a function that runs a setTimeout()
//var wait = 0;

//boundaryHitName gives the name of the wall that is hit,
// as a string = to 'left', 'right', 'top' or 'bottom', 'lTCorner', 'rTCorner', 'lBCorner', 'rBcorner'
// set to empty string if not at boundary
var boundaryHitName = '';

//faceBound,  boolean, true if pacman is on a wall and facing it, 
// for example true if pacman is at top wall, and  theta < 0 or theta > 180
// other example true if pacman is at LT corner and theta <0 or theta > 90
// remember theta is changed from inputs to be well defined on the interval -90 < theta <= 270 using theta cleaner
//var faceBound = false;
//not currently using

// This variable helps determine which PacMan image should be displayed. It flips between values 0 and 1
//opens and closes mouth
var focus = 1;

//theta is direction pacmans direction Pacman points as an angle
//0 theta will be left, 90 theta down, 180 theta right, 270 or -90 theta up
//the actual rotation of the image is more complex since four images are needed to keep his eyehole on top
//the eye hole will point left or right, for straight up be on the left straight down the eye hole is on the right

let theta = 0;
// console.log("theta: " + theta);
  
//   console.log("importing theta from button")
//   let tokenAmount = document.getElementById("userTheta").value;
//   theta = tokenAmount;
//   console.log("theta: " + theta);
let testing_counter = 0;
function PMboundary(timeBetweenSteps){
  testing_counter++;
  console.log ('PMboundary has been run ' + testing_counter + 'times');
  let img = document.getElementById('PacMan');
  pageWidth  = window.innerWidth;
  console.log('pageWidth: ' + pageWidth);
  pageHeight = window.innerHeight;
  console.log('pageHeight: ' + pageHeight);
  
  
  let imgWidth   = img.width;
  console.log('imgWidth: ' + imgWidth);
  let imgHeight  = img.height;
  console.log('imgHeight: ' + imgHeight);
  
  //calculating boundaries
  let leftBoundary  = 0;
  console.log('leftBoundary: ' + leftBoundary);
  let rightBoundary = pageWidth - imgWidth;
  console.log('rightBoundary: ' + rightBoundary);
  let topBoundary   = 0;
  console.log('topBoundary: ' + topBoundary);
  let bottomBoundary = pageHeight - imgHeight;
  console.log('bottomBoundary: ' + bottomBoundary);
  
  //stoping at boundaries
  boundaryHitName = '';
  console.log('boundaryHitName: ' + boundaryHitName);
  
  console.log('posXCalculated: ' + posXCalculated);;
  console.log('leftBoundary: ' + leftBoundary);;
  if(posXCalculated < leftBoundary)   { 
    posXCalculated = leftBoundary;
    boundaryHitName = 'left';
  }
  console.log('boundaryHitName: ' + boundaryHitName);;

  console.log('test2');;
  console.log('posXCalculated: ' + posXCalculated);;
  console.log('rightBoundary: ' + rightBoundary);;

  if(posXCalculated > rightBoundary)  { 
    posXCalculated = rightBoundary;
    boundaryHitName = 'right';
  }
  console.log('boundaryHitName: ' + boundaryHitName);;

  console.log('test3');;
  console.log('posYCalculated: ' + posYCalculated);;
  console.log('topBoundary: ' + topBoundary);;

  if(posYCalculated < topBoundary)    { 
    posYCalculated = topBoundary;
    switch(boundaryHitName){
      case '':
        boundaryHitName = 'top';
        break;
      case 'left':
        boundaryHitName = 'lTCorner';
        break;
      case 'right':
        boundaryHitName = 'rTcorner';
        break;  
    }
  }
  console.log('boundaryHitName: ' + boundaryHitName);

  console.log('test4');
  console.log('posYCalculated: ' + posYCalculated);
  console.log('topBoundary: ' + topBoundary);

  if(posYCalculated > bottomBoundary) { 
    posYCalculated = bottomBoundary;
    switch(boundaryHitName){
      case '':
        boundaryHitName = 'bottom';
        break;
      case 'left':
        boundaryHitName = 'lBCorner';
        break;
      case 'right':
        boundaryHitName = 'rBcorner';
        break;  
    }
  }
  
  console.log('boundaryHitName: ' + boundaryHitName);
  return boundaryHitName;

}  


//image_update_PM eventually takes, character object, and updates its img source
//right now is pacman specific, no pac object instead use:
//input theta and focus to udate pacmans image source
//mirrorImage and focus are globally scoped
function imageSourceUpdatePM(){
  let img = document.getElementById('PacMan');
  img.src = pacArray[mirrorImage][focus];
}

//rotatePM uses global variable theta, focus, updates mirrorImage updates image source and rotate, sets theta to (-90,270] using theta cleaner
function updateRotatePM(){

  theta = thetaCleaner(theta);

  if(theta <= 90){
    mirrorImage = 0;
  }else{mirrorImage = 1};

  let thetaRound = Math.round(theta);
  if  (mirrorImage) { thetaRound -= 180 };
  let img = document.getElementById('PacMan');
  let PacAngleString = 'rotate(' + thetaRound.toString() + 'deg)';
  img.style.transform = PacAngleString;
  imageSourceUpdatePM()
}

//update_position_pm takes posXCalculated, posYCalculated and positions PacMan image there
function updatePosistionPM(){

  let posXRound = Math.round(posXCalculated);
  let posYRound = Math.round(posYCalculated);
  
  let img = document.getElementById('PacMan');
  img.style.left = posXRound.toString() + 'px';
  img.style.top  = posYRound.toString() + 'px';
}

//rounds num to decimal places as a power of 10, for example, rounder(3475.4562, 3) returns 3000; rounder(3475.4562, -3) returns 3475.456, 
function rounder(num, decimalplaces){
  let reciprial = 10 ** (-1 * decimalplaces);
  let answer = (Math.round(num * reciprial) )/ reciprial;
  return answer;
}

//munchPM changes mouth position next time img is updated(or rotated)
function munchPM(){
  focus = (focus + 1) % 2;
}
//openMouth - opens mouth position next time img is updated(or rotated)
function openMouthPM(){
  focus = 0
}
//closeMouth - opens mouth position next time img is updated(or rotated)
function closeMouthPM(){
  focus = 1
}

//munchingPM(munchnumber)  - waits waitTime (ms) then moves mouth, munchnumber of times
// uses global variable munch count
function munchingPM(munchnumber, waitTime){
  munchPM();
  if(munchnumber <= 0){return};
  munchnumber--
  setTimeout(munchnumber, waitTime)
}


//walkingPM turns pacman and sets him walking in a new direction
//only the first two arguments are necessary
//many only affect the stlye of how he munches

//walkingPM(timebetween steps, rotation- PM rotates to global v theta and
//walks distance V and munches runs boundaryconditionfunction, until it returns false

//set theta and v as desired before running walkingPM 
//or input update v and theta with optional third and fouth argument

//delaytostart is optional fifth argument sets delay time between rotation and walk 
//defaults to timeBetweenSteps

//munch adds munch at rotation default to true
//closedmouthv=0 'open mouth at rotation', =1 'closed mouth at rotation', -1 noeffect

//munchdelay steps before munching, =negative 'never munches' , defaults to 0

function setPMwalking( timeBetweenSteps, boundaryFunction, newTheta, newV, delayToStart, Munch, closedMouth,munchdelay){ 
  if( !(newTheta   === undefined) ) {theta        = newTheta;}
  if( !(newV       === undefined) ) {v            = newV;}
  if( delayToStart === undefined)   {delayToStart = timeBetweenSteps;}
  if( Munch        === undefined)   {Munch        = true ;}
  if( closedMouth  === undefined)   {closedMouth  = -1 ;}
  if( munchdelay   === undefined)   {munchdelay  = 0 ;}

  if(Munch){munchPM()};
  if(closedMouth === 0){openMouthPM();}
  if(closedMouth > 1){ closeMouthPM();}
  updateRotatePM();
  VxyUsingTheta();
  setTimeout(function() {
    pMwalking(timeBetweenSteps, boundaryFunction, munchdelay)},
    munchdelay);
}

//adds aX(default 0) to vX then vX to posXCalulated and applies to PM same for y
function pMwalking(timeBetweenSteps, boundaryFunction, munchdelay){
  if(munchdelay ===0 ){
    munchPM();
    imageSourceUpdatePM();
    }else{
    munchdelay--;}

  updateKinematics();
  updatePosistionPM();
  let boundaryResponse = boundaryFunction(timeBetweenSteps);
  if( boundaryResponse === ''){
    setTimeout(function() {
      pMwalking(timeBetweenSteps, boundaryFunction, munchdelay)},
      timeBetweenSteps);
  }else{
  boundaryHitFunction(boundaryResponse, timeBetweenSteps, boundaryFunction)
  }
}


function boundaryHitFunction(boundaryResponse, timeBetweenSteps, boundaryFunction){
  theta = findRandomValidTheta(boundaryResponse);
  boundaryHitName = '';
  setPMwalking( timeBetweenSteps, boundaryFunction);
}

function findRandomValidTheta(boundaryResponse){
  let angleboundArray = -3;
  switch (boundaryResponse){
    case 'left':
      angleboundArray = 0;
      break;
    case 'right':
      angleboundArray = 1;
      break;
    case 'top':
      angleboundArray = 2;
      break;
    case 'bottom':
      angleboundArray = 3;
      break;
    case 'lTCorner':
      angleboundArray = 4;
      break;
    case 'rTcorner':
      angleboundArray = 5;
      break;
    case 'lBCorner':
      angleboundArray = 6;
      break;
    case 'rBcorner':
      angleboundArray = 7;
      break;
  }
  let lowerbound = LeaveAngles[angleboundArray][0];
  console.log('lowerbound: ' + lowerbound);
  let upperbound = LeaveAngles[angleboundArray][1];
  console.log('upperbound: ' + upperbound);
  let ans = findrandomanglebetween(lowerbound,upperbound);
  ans = Math.round(ans);
  console.log('angle found: ' + ans)
  return ans
}

function findrandomanglebetween(min,max){
  return Math.random() * (max - min) + min;
}

let LeaveAngles = [
  [-90,90],
  [90,270],
  [0,180],
  [180,360],
  [0,90],
  [90,180],
  [270,360],
  [180,270],
];








function VxyUsingTheta(){ 
  let thetaRad = theta * Math.PI / 180;
  vX = v * rounder((Math.cos(thetaRad)), -4);
  // console.log('vX: ' + vX);
  vY = v * rounder((Math.sin(thetaRad)),-4);
  // console.log('vY: ' + vY);
}

function updateKinematics(){
  vX += aX;
  vY += aY;
  posXCalculated += vX;
  posYCalculated += vY;
}

// walkingPM( timeBetweenSteps, boundary_condition, maxAmout, maxAmountType)
//optional max condition is a string 'distance' , 'time' or 'steps' default to steps

//numByMod function takes number, num, to its equivlent modulo, mod (must be positive number),
// third argument, floorNum , is lowest output (0 by default)
//if the forth argument optional topClosed is true (false by default), the floorNum number is now the maximum output instead,

function numByMod(num, mod, floorNum,topClosed){
  let ans = num % mod;
  if( ans < 0 ){ans += mod};
  if(floorNum === undefined){return ans};
  let floorNumEquivlent = floorNum % mod;
  if(floorNumEquivlent < 0){ floorNumEquivlent +=mod };
  if(ans === floorNumEquivlent){return floorNum};
  if(ans < floorNumEquivlent){ ans += mod};
  let shiftNeeded = Math.floor(floorNum / mod) * mod;
  ans += shiftNeeded;
  if(topClosed){ans -= mod};
  return ans;
}

//now I will customize numByMode into a function that moves any angle, into (-90,270] this will help determine which picture to use
function thetaCleaner( thetaInput){
  return numByMod(thetaInput, 360, 270, true);
}

//pacManAngleTester was built to rotate pacman around in a circle
//stopping and moving his mouth after increasing the angle a set amount of times
//it won't currently work as the run function has been divided into many other functions
//needs to be updated to work as this woould be a cool way for pacman to change his angle

function pacManAngleTester( numberOfCircles, mouthsPerRotation, rotationsToFullCircle, startAngle, movesPerSecond){

  let rotationIncrement = 360 / rotationsToFullCircle;
  let endAngle = 0;

  if(rotationIncrement > 0){
    endAngle = startAngle + (numberOfCircles * 360); 
  }else{
    endAngle = startAngle - (numberOfCircles * 360);
  }
  
  let msBetweenMoves = Math.round(1000/ movesPerSecond);

  setTimeout(function() {
    pacManTestWaiter(startAngle, endAngle, rotationIncrement, msBetweenMoves, mouthsPerRotation)
  }, msBetweenMoves);

}


// //rotationsToFullCircle negative for backwards rotations
// //pacManAngleTester( numberOfCircles, mouthsPerRotation, rotationsToFullCircle, startAngle, movesPerSecond)
// pacManAngleTester(                 4,                 10,                    -8,          0,              15);
//Run no longer a function I need to fix this
function pacManTestWaiter(startAngle,endAngle, rotationIncrement, msBetweenMoves, mouthsPerRotation){
  if(rotationIncrement > 0){
    if(startAngle > endAngle){return};
  }else{
    if(startAngle < endAngle){return};
  }
  theta = startAngle;
  Run();
  startAngle += rotationIncrement;
  
  if(mouthsPerRotation === 1){
    setTimeout(function() {
      pacManTestWaiter(startAngle, endAngle, rotationIncrement, msBetweenMoves, mouthsPerRotation)
    }, msBetweenMoves);
    
  }else{
    setTimeout(function() {
      mouthMover(startAngle, endAngle, rotationIncrement, msBetweenMoves, mouthsPerRotation, 1)
    }, msBetweenMoves);
  }
}

//Run no longer a function
//mouthmover will call itself and number of times then call waiter, 
function mouthMover(startAngle, endAngle, rotationIncrement, msBetweenMoves, mouthsPerRotation, mouthCount){
  Run();
  if(mouthCount <= mouthsPerRotation){
    setTimeout(function() {
      pacManTestWaiter(startAngle, endAngle, rotationIncrement, msBetweenMoves, mouthsPerRotation)
    }, msBetweenMoves);
  }else{
    mouthCount++;
    setTimeout(function() {
      mouthMover(startAngle, endAngle, rotationIncrement, msBetweenMoves, mouthsPerRotation, mouthCount)
    }, msBetweenMoves);
  }
}
//running tests
setPMwalking( 200, PMboundary);

//ideas about Pacman program improvement 
//I need a lot of constuctors, here to keep track of characters like pacmanm, boundaries, 
//character objects like pacman, keep track of his state, where he is, how he's moving and what he plans to do, given boundaries encountered or mouse clicks
//boundaries have types, like window, special points, 
//like links to other boundaries and endpoints, and corners, 
//js strings, and theta directions to update characters, to recognize collisions and direct characters towards or away from them, 
//paths given a point provide a direction, and js_script to recognize when to stop or link to another path
//targets are a state or set of states paths end on
//eatOrDie targets which involve other characters
//gamestate object provides global game info
//collision targets are fixed in space
//time targets are fixed in time