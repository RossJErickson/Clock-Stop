//jshint esversion: 6

var dot = $(".dot");

const original_timeToAct = 1000;
var timeToDefuse = 333;
var scaleRatio = 0.95;

var actionTimer;
var countdown;
var timeToAct = original_timeToAct;
var record = 0;
var highRecord = 0;

var activatedAudio = new Audio("sounds/activated.mp3");
var disactivatedAudio = new Audio("sounds/disactivated.mp3");
var gameOverAudio = new Audio("sounds/gameOver.mp3");
activatedAudio.volume = 0.6;
disactivatedAudio.volume = 0.6;
gameOverAudio.volume = 0.6;

resetDot();

dot.hover(function(){
  dot.addClass("hovered");
  }, function() {
    dot.removeClass("hovered");
  }
);

dot.mouseenter(function(){
  dot.addClass("active");
  activatedAudio.play();
  clearActionTimer();
  setTimeout(function() {
    if (dot.hasClass("active")) {
      dot.removeClass("active");
      disactivatedAudio.play();
      advance();
      startActionTimer();
    }
  }, timeToDefuse);
});

dot.mouseleave(function(){
  if (dot.hasClass("active")) {
    dot.removeClass("active");
    gameOver();
  }
});

function advance() {
  record++;
  $(".record").text(record + " / " + highRecord);
  // if (record == highRecord + 1) {
  //   recordAudio.play();
  // }
  var newHeight = scaleRatio * parseInt(dot.css("height"), 10);
  var newWidth = scaleRatio * parseInt(dot.css("width"), 10);
  dot.css("height", newHeight + "px");
  dot.css("width", newWidth + "px");

  var coords = newCoords();
  var oldCoords = [parseInt(dot.css("left"), 10),
    parseInt(dot.css("top"), 10)];
  while (  distance(coords, oldCoords) < 200  ) {
    coords = newCoords();
  }
  dot.css("left", coords[0] + "px");
  dot.css("top", coords[1] + "px");

  timeToAct *= scaleRatio;
}

function clearActionTimer() {
  clearTimeout(actionTimer);
  clearInterval(countdown);
}

function startActionTimer() {
  actionTimer = setTimeout(function() {
    dot.removeClass("active");
    clearInterval(countdown);
    gameOver();
  }, timeToAct);

  timeRemaining = timeToAct - 1.8*(timeToAct / 50);
  $(".timer-filler").css("opacity", "0");
  $(".timer-mask").css("opacity", "1");
  countdown = setInterval(function() {
    timeRemaining -= timeToAct / 50;
    if (timeRemaining < 0) {
      timeRemaining = 0;
    }
    updateTimer(timeRemaining / timeToAct);
  }, timeToAct / 50);
}

function distance(coords1, coords2) {
  dx = coords1[0] - coords2[0];
  dy = coords1[1] - coords2[1];
  return Math.sqrt(dx*dx + dy*dy);
}

function updateTimer(percent) {
  var deg = 360 - (360 * percent);
  $(".timer-spinner").css("transform", "rotate(" + deg + "deg)");
  if (deg >= 180 && $(".timer-filler").css("opacity") == 0) {
    $(".timer-filler").css("opacity", "1");
    $(".timer-mask").css("opacity", "0");
  }
}

function gameOver() {
  gameOverAudio.play();
  highRecord = Math.max(record, highRecord);
  record = 0;
  resetDot();
  $(".timer-filler").css("opacity", "0");
  $(".timer-mask").css("opacity", "1");
  $(".timer-spinner").css("transform", "rotate(0deg)");
  timeToAct = original_timeToAct;
}

function newCoords() {
  var maxLeft = parseInt($(".bounding-box").css("width"), 10) - parseInt(dot.css("width"), 10);
  var maxTop = parseInt($(".bounding-box").css("height"), 10) - parseInt(dot.css("height"), 10);
  var left = maxLeft*Math.random();
  var top = maxTop*Math.random();
  return [left, top];
}

function resetDot() {
  dotDiameter = 0.2 * Math.min($(".bounding-box").height(), $(".bounding-box").width());
  dot.css("height", dotDiameter + "px");
  dot.css("width", dotDiameter + "px");
  var left = 0.5 * ($(".bounding-box").width() - dotDiameter);
  var top = 0.5 * ($(".bounding-box").height() - dotDiameter);
  dot.css("left", left + "px");
  dot.css("top", top + "px");
}
