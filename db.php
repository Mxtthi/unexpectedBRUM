<?php

session_start();
require "../../database.php";

if (isset($_POST["code"])) {
    $trackCode = $_POST["code"];
    $error = "";

    $sql = "SELECT * FROM tracks WHERE trackCode = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$trackCode]);
    $data = $stmt->fetchAll();

    echo '<input type="text" id="codeInput" name="codeInput" value=' . $trackCode  . '>';

    if (empty($data)) {
        $error .= "Track existiert nicht";
        echo "<br>" . $error;
    } else {
        $track = $data[0]["contents"];
        $_SESSION["track"] = $track;
        echo "<script>window.location.reload()</script>";
    }
}

if (isset($_POST["track"]) && isset($_SESSION["auth"])) {
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
}
