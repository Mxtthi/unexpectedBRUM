<?php

session_start();
require "../../database.php";
$error = "";

if (isset($_POST["car"]) && isset($_SESSION["id"])) {
    $car = $_POST["car"];
    $userID = $_SESSION["id"];

    $sql = "INSERT INTO unlockeditems (userID, itemname)
        VALUES (?, ?);";
    $stmt = $db->prepare($sql);
    $stmt->execute([$userID, $car]);
}

if (isset($_POST["coins"])) {
    $coins = $_POST["coins"];
    $userID = $_SESSION["id"];

    $sql = "SELECT * FROM usersdetails WHERE userID = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$userID]);
    $data = $stmt->fetchAll();

    if (empty($data)) {
        $sql = "INSERT INTO usersdetails (userID, coins)
        VALUES (?, ?);";
        $stmt = $db->prepare($sql);
        $stmt->execute([$userID, $coins]);
    } else {
        $sql = 'UPDATE usersdetails SET coins = ? WHERE userID =  ?;';
        $stmt = $db->prepare($sql);
        $stmt->execute([$coins, $userID]);
    }
}

if (isset($_POST["code"])) {
    $trackCode = $_POST["code"];

    $sql = "SELECT * FROM tracks WHERE trackCode = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$trackCode]);
    $data = $stmt->fetchAll();

    echo '<input type="text" id="codeInput" name="codeInput" value=' . $trackCode  . '>';

    if (empty($data)) {
        $error .= "Track existiert nicht";
    } else {
        $track = $data[0]["contents"];
        $_SESSION["track"] = $track;
        echo "<script>window.location.reload()</script>";
    }
}

if (isset($_POST["track"])) {
    if (isset($_SESSION["auth"])) {
        $track = json_encode($_POST["track"]);
        $userID = $_SESSION["id"];
        $trackCode;
        $rndm;

        // check if code already exists
        do {
            $isUsed = false;
            $rndm = rand(1, 65535);

            $trackCode = strtoupper(dechex($rndm));

            $sql = "SELECT * FROM tracks WHERE trackCode = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$trackCode]);
            $data = $stmt->fetchAll();

            if (!empty($data)) {
                $isUsed = true;
            }
        } while ($isUsed);

        $sql = "INSERT INTO tracks (trackCode, userID, contents) 
        VALUES (?, ?, ?);";
        $stmt = $db->prepare($sql);
        $stmt->execute([$trackCode, $userID, $track]);
        echo '<input type="text" id="codeInput" name="codeInput" value=' . $trackCode  . '>';
    } else {
        $error .= "Du bist nicht eingeloggt.";
        echo '<input type="text" id="codeInput" name="codeInput" placeholder="4F35">';
    }
}

echo "<br><p style='color:#b0b0b0'>" . $error . "</p>";
