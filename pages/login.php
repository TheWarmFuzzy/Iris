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
<link rel="stylesheet" type="text/css" href="styles/forms.css">
</head>

<body>

	<form action="index.php" method="post">
        <div class="label text">LOGIN</div>
		<input type="text" name="username" id="username" class="input text" placeholder="USERNAME" pattern="[A-Za-z0-9_-]"required>
		<br/>
		<input type="password" name="password" id="password"  class="input text" placeholder="PASSWORD" required>
		<br/>
		<input type="hidden" name="__LOGIN_TOKEN" value="<?php echo $LOGIN_TOKEN ?>">
		<input type="submit" class="input button" value="LOGIN">
	</form>
</body>

</html>