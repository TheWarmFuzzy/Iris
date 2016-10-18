<?php namespace user_login;
	$config_location = "configs/user_login";
	$configs = \config_loader\load($config_location);
	
	var_dump($configs["Test"]);
	
	include("pages/error.php");
	exit();
?>