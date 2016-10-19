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

\user_login\verify_logged_in();

?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Title of the document</title>
</head>

<body>
	<form action="index.php" method="post">
		<label>Username</label>
		<input type="text" name="username">
		<br/>
		<label>Password</label>
		<input type="text" name="password">
		<br/>
		<input type="submit">
	</form>
	<br/>
	<br/>
	<?php
	if(isset($_SESSION["LoggedIn"]))
		echo "Logged in.";
	else
		echo "Logged out.";
	?>
</body>

</html>