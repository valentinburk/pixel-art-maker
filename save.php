<?php
    // Generate name
    $now = new \DateTime('now',  new \DateTimeZone('UTC'));
    $name = $now -> format('Ymdhis') . '_' . $_POST["name"];

    // Save table content
    file_put_contents('share/' . $name . '.save', file_get_contents("php://input"));

    // Save thumbnail png
    $data = substr($_POST['thumbnail'], strpos($_POST['thumbnail'], ",") + 1);
    $decodedData = base64_decode($data);
    $fp = fopen('share/' . $name . '.png', 'wb');
    fwrite($fp, $decodedData);
    fclose();
?>
