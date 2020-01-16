let deg = 0;
let direction = -90;
let speed = 0;
let turnRate = 5;
let posX = 800;
let posY = 420;
let max_speed = 20;
let acceleration = 2;
let declaration = 1;
let heading;

//timers
let time_left_ship_rotate;
let time_aft_ship_thrust;
let time_right_ship_rotate;
let time_stop_ship;

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: //left arrow
            if (time_left_ship_rotate) {
                break;
            }
            time_left_ship_rotate = setInterval(function(){
                ship_rotate('left');
            }, 25);
            break;
        case 38: //up arrow
            if (time_aft_ship_thrust) {
                break;
            }
            time_aft_ship_thrust = setInterval(function(){
                ship_thrust();
            }, 25);
            break;
        case 39: //right arrow
            if (time_right_ship_rotate) {
                break;
            }
            time_right_ship_rotate = setInterval(function(){
                ship_rotate('right');
            }, 25);
            break;
        case 40: //down arrow
            if (time_stop_ship) {
                break;
            }
            time_stop_ship = setInterval(function(){
                ship_break();
            }, 25);
            break;
    }
};
document.onkeyup = function(e) {
    switch (e.keyCode) {
        case 37: //left arrow
            clearInterval(time_left_ship_rotate);
            time_left_ship_rotate = null;
            break;
        case 38: //up arrow
            clearInterval(time_aft_ship_thrust);
            time_aft_ship_thrust = null;
            break;
        case 39: //right arrow
            clearInterval(time_right_ship_rotate);
            time_right_ship_rotate = null;
            break;
        case 40: //down arrow
            clearInterval(time_stop_ship);
            time_stop_ship = null;
            break;
    }
};
function start_game() {
    document.getElementById('char_position').style.transform = 'translate('+posX+'px, '+posY+'px)';
    updateMovement();
    setTimeout(function(){
        start_game();
    },10);
}

function updateMovement() {
    deg =Math.round(deg);
    direction =Math.round(direction);
    heading =Math.round(heading);
    speed =Math.round(speed);
    posX = posX + (speed / 4) * Math.cos(direction * Math.PI / 180);
    posY = posY + (speed / 4) * Math.sin(direction * Math.PI / 180);
    if (posX > 1620){
        posX = -20
    } else if (posX < -20){
        posX = 1620
    }
    if (posY > 898){
        posY = -47
    } else if (posY < -47){
        posY = 898
    }
    document.getElementById('degree').innerText = 'Degree: '+(deg % 360);
    document.getElementById('direction').innerText = ('Direction: '+(direction % 360 + 90));
    document.getElementById('Heading').innerText = ('Heading: '+GetHeadingDiff((deg % 360), (direction % 360) + 90));
    document.getElementById('speed').innerText = ('Speed: '+speed);
    document.getElementById('directionX').innerText = ('directionX: '+posX);
    document.getElementById('directionY').innerText = ('directionY: '+posY);
}

/**
 * @return {number}
 */
function GetHeadingDiff(_Heading1, _Heading2) {
    return (_Heading2-_Heading1+540) % 360 - 180;
}

function ship_thrust() {
    if (speed < 1) {
        speed = speed + acceleration;
        direction = -90 + deg;
        return;
    }
    if (direction + 90 === deg) {
        if (speed >= max_speed) {
            return;
        }
        speed = speed + acceleration;
    } else {
        heading = GetHeadingDiff((deg % 360), (direction % 360) + 90);
        if (heading === 180 || heading === -180) {
            speed = speed - declaration;
        } else if (heading < 0) {
            if (heading < -160) {
                speed = speed - declaration;
            } else if (heading < -135) {
                direction = direction + (turnRate / (speed / 15));
            } else if (heading < -90) {
                direction = direction + (turnRate / (speed / 15));
            } else if (heading < -45) {
                direction = direction + (turnRate / (speed / 10));
            } else {
                direction = direction + (turnRate / (speed / 8));
                if (speed < max_speed) {
                    speed = speed + acceleration / 2;
                }
            }
        } else {
            if (heading > 160) {
                speed = speed - declaration;
            } else if (heading > 135) {
                direction = direction - (turnRate / (speed / 15));
            } else if (heading > 90) {
                direction = direction - (turnRate / (speed / 15));
            } else if (heading > 45) {
                direction = direction - (turnRate / (speed / 10));
            } else {
                direction = direction - (turnRate / (speed / 8));
                if (speed < max_speed) {
                    speed = speed + acceleration / 2;
                }
            }
        }
    }
}
function ship_rotate(rot) {
    if (rot === 'left') {
        deg = deg - turnRate;
    } else if (rot === 'right') {
        deg = deg + turnRate;
    }
    document.getElementById('char_rotate').style.transform = 'rotate(' + deg + 'deg)';
}
function ship_break() {
    if (speed >= 1) {
        speed = speed - declaration;
        return;
    }
    speed = 0;
}


