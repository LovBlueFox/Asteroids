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
let score = 0;

//timers
let time_left_ship_rotate;
let time_aft_ship_thrust;
let time_right_ship_rotate;
let time_stop_ship;
let time_shoot_ship;

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
        case 90: //fire
            if (time_shoot_ship) {
                break;
            }
            time_shoot_ship = setInterval(function(){
                ship_fire();
            }, 100);
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
        case 90: //fire
            clearInterval(time_shoot_ship);
            time_shoot_ship = null;
            break;
    }
};
function start_game() {
    asteroid();
    loop();
}

function loop() {
    updatePlayerMovement();
    updateAsteroidMovement();
    updateLaserMovement();
    setTimeout(function(){
        loop();
    },10);
}

function updatePlayerMovement() {
    document.getElementById('char_position').style.transform = 'translate('+posX+'px, '+posY+'px)';
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
    for (let x = 0; x < asteroids + 1; x++) {
        if (checkCollision(document.getElementById('char_position'), document.getElementById('ast_large_'+x))) {
            if (ast_array[x].life === 1) {
                document.body.innerHTML = '<div class="dead">' +
                    '<h1>You Died!</h1>' +
                    '<p>Score: '+score+'</p>' +
                    '</div>'

                throw new Error('This is not an error. This is just to abort javascript');
            }
        }
    }
    document.getElementById('degree').innerText = 'Degree: '+(deg % 360);
    document.getElementById('direction').innerText = ('Direction: '+(direction % 360 + 90));
    document.getElementById('Heading').innerText = ('Heading: '+GetHeadingDiff((deg % 360), (direction % 360) + 90));
    document.getElementById('speed').innerText = ('Speed: '+speed);
    document.getElementById('directionX').innerText = ('directionX: '+posX);
    document.getElementById('directionY').innerText = ('directionY: '+posY);
}

let ast_deg = 0;
function updateAsteroidMovement() {
    ast_deg++;
    for (let i = 0; i < asteroids + 1; i++) {
        ast_array[i].posX = ast_array[i].posX + (ast_array[i].speed) * Math.cos(ast_array[i].direction * Math.PI / 180);
        ast_array[i].posY = ast_array[i].posY + (ast_array[i].speed) * Math.sin(ast_array[i].direction * Math.PI / 180);
        if (ast_array[i].posX > 1700){
            ast_array[i].posX = -99
        } else if (ast_array[i].posX < -100){
            ast_array[i].posX = 1699
        }
        if (ast_array[i].posY > 900){
            ast_array[i].posY = -99
        } else if (ast_array[i].posY < -100){
            ast_array[i].posY = 898
        }
        document.getElementById('ast_large_'+i).children[0].style.transform = 'rotate('+ast_deg+"deg)";
        document.getElementById('ast_large_'+i).style.transform = 'translate('+ast_array[i].posX+'px, '+ast_array[i].posY+'px)';
    }
}

function updateLaserMovement() {
    for (let i = 0; i < lasers + 1; i++) {
        for (let x = 0; x < asteroids + 1; x++) {
            if (checkCollision(document.getElementById('laser_'+i), document.getElementById('ast_large_'+x))) {
                if (ast_array[x].life === 1) {
                    ast_array[x].life = 0;
                    ast_array[x].speed = 0;
                    laser_array[i].life = 100;
                    score = score + 500;
                    document.getElementById('ast_large_'+x).children[0].style.opacity = '0';
                    asteroid();
                    if (roll() < 0.5) {
                        asteroid();
                    }
                    document.getElementById('score').innerText = 'Score: '+score.toString();
                }
            }
        }

        if (laser_array[i].life !== 100) {
            document.getElementById('laser_'+i).style.display = 'block';
            laser_array[i].posX = laser_array[i].posX + (laser_array[i].speed) * Math.cos(laser_array[i].direction * Math.PI / 180);
            laser_array[i].posY = laser_array[i].posY + (laser_array[i].speed) * Math.sin(laser_array[i].direction * Math.PI / 180);
            laser_array[i].life++;
        } else {
            document.getElementById('laser_'+i).style.display = 'none';
        }
        document.getElementById('laser_'+i).children[0].style.transform = 'rotate('+(laser_array[i].direction - 90)+"deg)";
        document.getElementById('laser_'+i).style.transform = 'translate('+laser_array[i].posX+'px, '+laser_array[i].posY+'px)';
    }
}

function checkCollision(object_elm, asteroid_elm) {
    let object_rect = object_elm.getBoundingClientRect();
    let asteroid_rect = asteroid_elm.getBoundingClientRect();

    return (object_rect.right >= asteroid_rect.left &&
        object_rect.left <= asteroid_rect.right) &&
        (object_rect.bottom >= asteroid_rect.top &&
            object_rect.top <= asteroid_rect.bottom);
}

let asteroids = -1;
let ast_array = [];
function asteroid() {
    let ast_posX;
    let ast_posY;
    asteroids++;
    if (roll()  < 0.5) {
        if (roll() < 0.5) { //top
            ast_posX = Math.floor(Math.random() * 1600);
            ast_posY = -100;
        } else { //bottom
            ast_posX = Math.floor(Math.random() * 1600);
            ast_posY = 900;
        }
    } else {
        if (roll() < 0.5) { //left
            ast_posX = -100;
            ast_posY = Math.floor(Math.random() * 800);
        } else { //right
            ast_posX = 1600;
            ast_posY = Math.floor(Math.random() * 800);
        }
    }
    ast_array.push({
        'type': 'large',
        'life': 1,
        'speed': Math.floor(Math.random() * 5) + 1,
        'direction': Math.floor(Math.random() * 360),
        'posX': ast_posX,
        'posY': ast_posY,
    });
    document.getElementById('game_set').innerHTML += '<div id="ast_large_'+asteroids+'" class="asteroid"><div></div></div>';
}

function roll() {
    return Math.random() * 2
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
let lasers = -1;
let lasers_rep = -1;
let laser_array = [];
function ship_fire() {
    if (lasers < 15) {
        if (lasers > 15) {
            lasers = 15;
            return;
        }
        lasers++;
        laser_array.push({
            'speed': ((speed > 7) ? 20:8 ),
            'direction': (deg - 90),
            'life': 0,
            'posX': posX,
            'posY': posY,
        });
        document.getElementById('game_set').innerHTML += '<div id="laser_'+lasers+'" class="laser"><div></div></div>';
    } else {
        lasers_rep++;
        if (lasers_rep > 15) {
            lasers_rep = 0;
        }
        laser_array[lasers_rep].direction = (deg - 90);
        laser_array[lasers_rep].speed = ((speed > 7) ? 10:8 );
        laser_array[lasers_rep].life = 0;
        laser_array[lasers_rep].posX = posX;
        laser_array[lasers_rep].posY = posY;
    }
}

