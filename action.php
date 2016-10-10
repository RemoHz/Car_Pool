
<?php

include('db_config.php');

// Insert driver path
if (isset($_POST["action"]) && $_POST["action"] == "addPath")
{
    $username = $_POST["username"];
    $from = $_POST["from"];
    $to = $_POST["to"];
    $start = $_POST["start"];
    $end = $_POST["end"];
    $seat = $_POST["seat"];

	$sql = "INSERT INTO driver (username, departure, arrival, departure_time, arrival_time, seat) VALUES('".$username."','".$from."','".$to."','".$start."','".$end."','".$seat."');";
	$result = mysql_query($sql);

	mysql_close($link);

	echo "Success";
}

?>
