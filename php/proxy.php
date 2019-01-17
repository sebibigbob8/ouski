<?php
$long=$_GET['long'];
$lat=$_GET['lat'];
echo $long;
header("Content-Type:application/xml");
$hello=file_get_contents("https://api.darksky.net/forecast/e8b7b11bdcb547cb506e922bf5ebd041/".$long.",".$lat);
echo $hello;

?>