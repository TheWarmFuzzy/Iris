<?php namespace user_login;

	//Load configuration file
	$configs = \config_loader\load(__NAMESPACE__);
	
	//Configuration values
	if(null != $configs)
		define('TEST_CONSTANT', $configs["Test"]);
	
	//Default values
	defined('TEST_CONSTANT') or define('TEST_CONSTANT', "My Value");
	
	echo TEST_CONSTANT;
	include("pages/error.php");
	exit();
?>