<?php


/* index.php
The main portal for the website

Revision history:
	Jeffrey Nelson 2016.10.18 Created
*/
	
//Start the session if one hasn't been started
if (!session_id())
	session_start();

//Load modules
require_once("modules/lib_validation.php");
require_once("modules/config_loader.php");
require_once("modules/database_access.php");
require_once("modules/user_login.php");

?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Title of the document</title>
</head>

<body>
	Here we go.
</body>

</html>