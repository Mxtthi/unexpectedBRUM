<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>unexpectedBrum</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
</head>

<body>

    <?php
    require "../../database.php";
    session_start();

    if (!isset($_SESSION['auth']) || $_SESSION['auth'] !== true) {
        echo "<script>
        if (confirm('Du bist nicht eingeloggt. Als Gast fortfahren?')) {
            sessionStorage.setItem('loggedIn', false);
        } else {
            window.location.href = '../../login.php';
        }
        </script>";
    } else {
        echo "<script>
        sessionStorage.setItem('loggedIn', true);;
        </script>";

        $sql = "SELECT * FROM usersdetails WHERE userID = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$_SESSION['id']]);
        $data = $stmt->fetchAll();

        if (!empty($data)) {
            echo $data[0]["coins"];
            $coins = $data[0]["coins"];
        }
    }

    if (isset($_SESSION["track"])) {
        $track = $_SESSION["track"];
        unset($_SESSION["track"]);
    } else {
        $track = 0;
        $coins = 0;
    }
    ?>

    <script>
        <?php
        echo "var coins = $coins;";
        echo "var trackCourse = $track;";
        ?>
        console.log(trackCourse);
    </script>

    <div id="codeDiv">
        <button class="collapsible active">Options</button>
        <div class="content">
            <div>
                <div><label for="trackLengthSlider">Track-Length:</label><br>
                    <input id="trackLengthSlider" type="range" min="1" max="500" value="25">
                    <span id="trackLengthOutput"></span>
                </div>
                <div><label for="worldSizeSlider">World-Size:</label><br>
                    <input id="worldSizeSlider" type="range" min="5" max="100" value="25">
                    <span id="worldSizeOutput"></span>
                </div>
                <div><label for="ViewRadiusSlider">Viewradius:</label><br>
                    <input id="ViewRadiusSlider" type="range" min="1" max="100" value="2">
                    <span id="ViewRadiusOutput"></span>
                </div>
                <div><label for="areaSizeSlider">Area-Size:</label><br>
                    <input id="areaSizeSlider" type="range" min="5" max="200" value="100">
                    <span id="areaSizeOutput"></span>
                </div>
            </div>
            <div>
                <input type="submit" id="getCode" name="getCode" value="Create Code">
                <input type="submit" id="setCode" name="setCode" value="Load Code">
                <div id="result">
                    <input type="text" id="codeInput" name="codeInput" placeholder="4F35">
                </div>
            </div>
        </div>
    </div>

    <div id="coinsDiv">
        <span id="coinCounter">0</span>
        <img src="./other/coin.webp" id="coinIcon">
    </div>

    <script type="text/javascript" src="functions.js"></script>
    <script type="text/javascript" src="gameSettings.js"></script>
    <script type="text/javascript" src="World.js"></script>
    <script type="text/javascript" src="Track.js"></script>
    <script type="text/javascript" src="Car.js"></script>
    <script type="text/javascript" src="game.js"></script>
    <script type="text/javascript" src="controls.js"></script>

</body>

</html>