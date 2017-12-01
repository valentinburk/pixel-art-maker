<?php
    $now = new \DateTime('now',  new \DateTimeZone('UTC'));
    $name = $now -> format('Ymdhis') . '_' . $_POST["name"];
    file_put_contents("share/" . $name, file_get_contents("php://input"));
?>
