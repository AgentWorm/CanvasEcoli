var stage, foodLayer, ecoliLayer, ecoliLineLayer, anim;
var ecoliArray = [];
var ecoliFood;
var canvasWidth = 500, canvasHeight = 500;
var MAX_SIZE = 5;
var layers = [];

var foodLocX, foodLocY;

var animationOption = 'start';

function initCanvas() {
    initializeStage();
    initializeEcoliLayer();
    initializeFoodLayer();

    addLayersToStage([ecoliLayer,ecoliLineLayer, foodLayer]);
    initializeAnimation([foodLayer, ecoliLineLayer, ecoliLayer]);
    animation(animationOption);
}

function addLayersToStage(layer) {
    for (var i = 0; i < layer.length; i++){
        stage.add(layer[i]);
    }
}

function initializeAnimation(layers) {
    anim = new Kinetic.Animation(function (frame) {
        $.each(ecoliArray, function (index, ecoliVal) {
            ecoliVal.updateEcoli();
        })
    }, layers)
}

function initializeEcoliLayer() {
    ecoliLayer = new Kinetic.Layer();
    ecoliLineLayer = new Kinetic.Layer();
}

function initializeFoodLayer() {
    ecoliFood = generateRandomRect();
    foodLayer = new Kinetic.Layer();
    foodLayer.add(ecoliFood);
}

function generateRandomRect() {
    foodLocX = Math.floor((Math.random() * ((canvasWidth + 1) - 0)) + 0);
    foodLocY = Math.floor((Math.random() * ((canvasHeight + 1) - 0)) + 0);

    var square = new Kinetic.Rect({
        width: 5,
        height: 5,
        x: foodLocX,
        y: foodLocY,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1
    });
    return square;
}

function initializeStage() {
    stage = new Kinetic.Stage({
        container: 'container',
        width: canvasWidth,
        height: canvasHeight
    });

    stage.on('mousedown', function (e) {
        generateEcoli(stage);
    });

    //enableMouseClick();
}

function generateEcoli(stage) {
    var pos = stage.getMousePosition();
    var mouseXCoord = parseInt(pos.x);
    var mouseYCoord = parseInt(pos.y);
    var ecoli = new Ecoli(mouseXCoord, mouseYCoord, foodLocX, foodLocY);
    ecoliArray.push(ecoli);
}

function animation(animOption) {
    animOption === 'start' ? anim.start() : anim.stop();
}

function disableMouseClick() {
    stage.off('mousedown');
}

function enableMouseClick() {

}

document.onkeydown = function (evt) {
    evt = evt || window.event;
    var keyPress = event.keyCode;

    // Keypress 'r' or 'R' for reset
    if (keyPress == 82 || keyPress == 114) {
        ecoliLayer.removeChildren();
        foodLayer.removeChildren();
        ecoliLineLayer.removeChildren();
        var food = generateRandomRect();
        foodLayer.add(food);
    }
    // keypress 's' or 'S' for start/stop. 
    if (keyPress == 83 || keyPress == 115) {
        if (animationOption == 'start') {
            animationOption = 'stop';
            animation(animationOption);
            disableMouseClick();
        } else {
            animationOption = 'start';
            animation(animationOption);
            enableMouseClick();
        }
    }
}


function Ecoli(xCoord, yCoord, foodLcX, foodLcY) {

    var value = Math.floor((Math.random() * 360));;
    this.xCoord = xCoord;
    this.yCoord = yCoord;

    this.foodLcX = foodLcX;
    this.foodLcY = foodLcY;

    var distance = getDistance(xCoord, yCoord);
    var ecoliRadius = 8;

    var flipXE = false;
    var flipXW = false;
    var flipYN = false;
    var flipYS = false;

    var flipX = 1;
    var flipY = 1;

    var foundFood = false;

    var linePoints = [{
        x: xCoord,
        y: yCoord
    }, {
        x: xCoord,
        y: yCoord
    }];

    var spline = new Kinetic.Spline({
        points: linePoints,
        stroke: 'green',
        strokeWidth: 1,
        lineCap: 'round',
        tension: 0
    });

    var circle = new Kinetic.Circle({
        x: xCoord,
        y: yCoord,
        radius: ecoliRadius,
        fill: 'blue',
        stroke: 'black',
        strokewidth: 1
    });

    ecoliLayer.add(circle);
    ecoliLineLayer.add(spline);

    function coordSetup(coord, setValue) {
        if (coord > (setValue - MAX_SIZE)) {
            return coord = setVAlue - MAX_SIZE;
        }
        else if (coord < MAX_SIZE) {
            return coord = 1;
        }
        else {
            return coord;
        }
    }

    function getDistance(x, y) {
        return Math.sqrt(Math.pow((y - foodLcY), 2) + Math.pow((x - foodLcX), 2));
    }

    function getRadians(angle) {
        return angle * (Math.PI / 180);
    }    

    function probability(xCoord, yCoord) {
        var newDistance = getDistance(xCoord, yCoord);
        var prob = (1 / (1 + Math.pow(2.7182818284590452353602875, (-100.0 * (newDistance - distance)))));
        distance = newDistance;
        return prob;
    }

    function getHeading() {
        var prob = probability(circle.getX(), circle.getY());
        var randomInt = Math.floor((Math.random() * 1001));
        if (randomInt / 1000 > prob) {
            return value;
        }
        else {
            value += Math.floor((Math.random() * 360));
            return value;
        }
    }

    function boundsCheck(loc, val, flip1, flip2, flipVal, isX) {

        if ((loc > val) && !flip1) {
            flipVal *= -1;
            flip1 = true;
        }
        else if ((loc < 1) && !flip2) {
            flipVal *= -1;
            flip2 = true;
        }
        else {
            flip1 = false;
            flip2 = false;
        }

        if (isX) {
            flipX = flipVal;
            flipXE = flip1;
            flipXW = flip2;
        }
        else {
            flipY = flipVal;
            flipYS = flip1;
            flipYN = flip2;
        }
    }

    function hasFoundFood() {
        return foundFood;
    }

    function updateEcoli() {

        if (foundFood) {
            return;
        }

        var heading = getRadians(getHeading());
        do {
            xCoord = xCoord - Math.sin(flipX * heading);
            boundsCheck(xCoord, (canvasWidth - MAX_SIZE), flipXE, flipXW, flipX, true);
        } while ((xCoord > (canvasWidth - MAX_SIZE)) || (xCoord < 1));

        do {
            yCoord = yCoord + (flipY * Math.cos(heading));
            boundsCheck(yCoord, (canvasHeight - MAX_SIZE), flipYS, flipYN, flipY, false);
        } while ((yCoord > (canvasHeight - MAX_SIZE)) || (yCoord < 1));

        if (Math.abs(xCoord - foodLcX) <= MAX_SIZE && Math.abs(yCoord - foodLcY) <= MAX_SIZE) {
            foundFood = true;
            circle.destroy();
            //spline.destroy();
        } else {
            circle.setX(xCoord)
            circle.setY(yCoord);

            var points = spline.getPoints();
            points.push({ x: xCoord, y: yCoord });
            spline.setPoints(points);

        }
    }

    this.updateEcoli = updateEcoli;
}

initCanvas();

