<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>unexpectedBrum</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
</head>

<body>

    <?php
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
        sessionStorage.setItem('loggedIn', false);;
        </script>";
    }

    if (isset($_SESSION["track"])) {
        $track = $_SESSION["track"];
        unset($_SESSION["track"]);
    } else {
        $track = 0;
    }
    ?>

    <script>
        <?php
        echo "var trackCourse = $track;";
        ?>
        console.log(trackCourse);
    </script>

    <div id="codeDiv">
        <input type="submit" id="getCode" name="getCode" value="Create Code">
        <input type="submit" id="setCode" name="setCode" value="Load Code">
        <div id="result">
            <input type="text" id="codeInput" name="codeInput" placeholder="4F35">
        </div>
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