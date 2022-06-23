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
    <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
    <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>

<body>

    <?php
    require "../../database.php";
    session_start();

    $coins = 0;
    $cars = 0;
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
            $coins = $data[0]["coins"];
        }

        $sql = "SELECT * FROM unlockeditems WHERE userID = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$_SESSION['id']]);
        $data = $stmt->fetchAll();

        if (!empty($data)) {
            $cars = [];
            for ($i = 0; $i < count($data); $i++) {
                array_push($cars, $data[$i]["itemname"]);
            }
        }
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
        echo "var cars = [];";
        if ($cars != 0) {
            for ($i = 0; $i < count($cars); $i++) {
                echo "cars.push('$cars[$i]');";
            }
        }
        echo "var coins = $coins;";
        echo "var trackCourse = $track;";
        ?>
    </script>

    <div id="home">
        <a href="../../">
            <p>Home</p>
        </a>
    </div>

    <div id="mySidebar" class="sidebar">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
        <div id="mainContainer" class="unselectable">
            <button class="collapsible">General Settings</button>
            <hr>
            <div class="content">
                <div>
                    <div><label for="trackLengthSlider">Track-Length:</label><br>
                        <input id="trackLengthSlider" type="range" min="1" max="500" value="100">
                        <span id="trackLengthOutput"></span>
                    </div>
                    <div><label for="worldSizeSlider">World-Size:</label><br>
                        <input id="worldSizeSlider" type="range" min="5" max="50" value="25">
                        <span id="worldSizeOutput"></span>
                    </div>
                    <div><label for="ViewRadiusSlider">Render-Distance:</label><br>
                        <input id="ViewRadiusSlider" type="range" min="1" max="100" value="2">
                        <span id="ViewRadiusOutput"></span>
                    </div>
                    <div><label for="areaSizeSlider">Field of View:</label><br>
                        <input id="areaSizeSlider" type="range" min="5" max="200" value="100">
                        <span id="areaSizeOutput"></span>
                    </div>
                </div>
                <div id="codeDiv">
                    <input type="submit" id="getCode" name="getCode" value="Create Code">
                    <input type="submit" id="setCode" name="setCode" value="Load Code">
                    <div id="result">
                        <input type="text" id="codeInput" name="codeInput" placeholder="4F35">
                    </div>
                </div>
                <hr>
            </div>

            <button class="collapsible">Shop</button>
            <hr>
            <div id="collapsibleContent" class="content">
                <div id="shop">
                </div>
                <hr>
            </div>
        </div>
    </div>

    <div id="main" class="unselectable">
        <button id="openButton" class="openbtn" onclick="openNav()">☰</button>
    </div>






    <script>
        collapsible();

        window.addEventListener('click', function(e) {
            if (!document.getElementById('mySidebar').contains(e.target) && !document.getElementById('openButton').contains(e.target) && document.getElementById("mySidebar").style.width != "" && document.getElementById("mySidebar").style.width != "0px") {
                closeNav();
            }
        }, );

        for (let i = 0; i < document.getElementsByClassName("collapsible").length; i++) {
            document.getElementsByClassName("collapsible")[i].addEventListener('click', function() {
                if (document.getElementsByClassName("collapsible")[i].classList.contains("active")) {
                    let temp = 0;
                    if (i == 0) temp = 1;
                    if (i == 1) temp = 0;
                    document.getElementsByClassName("content")[temp].style = "";
                    document.getElementsByClassName("collapsible")[temp].classList.remove("active");
                }
            });
        }

        function collapsible() {
            let coll = document.getElementsByClassName("collapsible"),
                i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {
                    this.classList.toggle("active");
                    let content = this.nextElementSibling.nextElementSibling;

                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        }

        //open/close sidebar
        function openNav() {
            document.getElementById("mySidebar").style.width = "25%";
            document.getElementById("main").style.marginLeft = "25%";
            document.getElementById("openButton").style.display = "none";
            NavOpen = true;
        }

        function closeNav() {
            document.getElementById("mySidebar").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
            document.getElementById("openButton").style.display = "block";
            NavOpen = false;
        }
    </script>









    <div id="coinsDiv">
        <span id="coinCounter">0</span>
        <img src="./other/coin.webp" id="coinIcon">
    </div>

    <script type="text/javascript" src="gameSettings.js"></script>
    <script type="text/javascript" src="World.js"></script>
    <script type="text/javascript" src="Track.js"></script>
    <script type="text/javascript" src="Car.js"></script>
    <script type="text/javascript" src="game.js"></script>
    <script type="text/javascript" src="controls.js"></script>

</body>

</html>