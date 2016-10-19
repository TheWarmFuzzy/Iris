<?php
	//CSRF mitigation
	$LOGIN_TOKEN = bin2hex(openssl_random_pseudo_bytes (32));
	$_SESSION["__LOGIN_TOKEN"] = $LOGIN_TOKEN;
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome to Iris</title>
</head>

<body>

	<form action="index.php" method="post">
		<label>Username</label>
		<input type="text" name="username">
		<br/>
		<label>Password</label>
		<input type="text" name="password">
		<br/>
		<input type="hidden" name="__LOGIN_TOKEN" value="<?php echo $LOGIN_TOKEN ?>">
		<input type="submit">
	</form>
</body>

</html>