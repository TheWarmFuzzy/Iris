<?php namespace user_login;

	/* user_login.php
	A module to log a user in and verify the session on each page

	Revision history:
		Jeffrey Nelson 2016.10.18 Created
	*/
	
	/*--------------------------------------------------
	--Initialization------------------------------------
	--------------------------------------------------*/
	
	//Load configuration file
	$configs = \config_loader\load(__NAMESPACE__);
	
	//Configuration values
	if(null != $configs)
		define('TEST_CONSTANT', $configs["Test"]);
	
	//Default values
	defined('TEST_CONSTANT') or define('TEST_CONSTANT', "My Value");
	
	
	/*--------------------------------------------------
	--Contents------------------------------------------
	--------------------------------------------------*/
	
	//Check if logged in
	if(isset($_SESSION["LoggedIn"]))
	{
		//Verify session credentials
		if(isset($_SESSION["Username"]) 
			&& isset($_SESSION["Password"]))
		{
			
			//Ensures the user's credentials are valid
			verify_user($_SESSION["Username"], $_SESSION["Password"], true);
			
		}
		else
		{
			
			//Credentials are incomplete or non-existant
			attempt_login();
			
		}
			
	}
	else
	{
		
		//Attempt to log user in
		attempt_login();
		
	}
	
	
	//Attempts to log the user in with post data 
	function attempt_login()
	{
		//Checks for post data
		if(isset($_POST["Username"]) 
			&& isset($_POST["Password"]))
		{
				
		}
		
		//User has failed to log in
		//Reset session variables
		if(isset($_SESSION["LoggedIn"])) unset($_SESSION["LoggedIn"]);
		if(isset($_SESSION["Username"])) unset($_SESSION["Username"]);
		if(isset($_SESSION["Password"])) unset($_SESSION["Password"]);
	}
	
	//Verifys that the user's name and password match the stored values
	function verify_user($username, $password, $hash = false)
	{
		
		
		
		
	}
	
	$password = password_hash("Hello",PASSWORD_DEFAULT);
	var_dump($password);
	
	echo password_verify("Hello", $password);
	echo bin2hex(openssl_random_pseudo_bytes(16));
	
	
	
	include("pages/error.php");
	exit();
?>