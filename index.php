<?php
?>
<html lang="en">
<head>
    <title>Game</title>
    <link href="game-sheet.css" rel="stylesheet">
</head>
<body onload="start_game()">
    <div class="box">
        <div id="char_position" class="character">
            <div id="char_rotate">
                <div class="char-tri"></div>
                <div class="char-body"></div>
                <div class="char-booster"></div>
            </div>
        </div>
    </div>
    <div class="box-text">
        <div>
            <h2>Objective: Destroy Asteroids</h2>
            <p>
                Left or Right: Rotate<br>
                Up: Acceleration<br>
                Down: Space Break<br>
                Fire: Z<br>
            </p>
        </div>
        <div>
            <h2>Stats</h2>
            <p id="degree"></p>
            <p id="direction"></p>
            <p id="Heading"></p>
            <p id="speed"></p>
            <p id="directionX"></p>
            <p id="directionY"></p>
        </div>
    </div>

    <script src="game-script.js"></script>
</body>
</html>
