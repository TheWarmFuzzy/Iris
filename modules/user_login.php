<?php namespace user_login;

	/* user_login.php
	A module to log a user in and verify the session on each page

	Revision history:
		Jeffrey Nelson 2016.10.18 Created
	*/
	
	/*--------------------------------------------------
	--Initialization------------------------------------
	--------------------------------------------------*/
	use \lib_validation as lv;
	use \database_access as database;
	//Load configuration file
	$configs = \config_loader\load(__NAMESPACE__);
	
	//Check if config is valid array
	if(lv\validate($configs,LV_ARRAY))
	{
		//Load DSN
		if(lv\validate($configs["USER_TABLE"],LV_STRING))
		define('USER_TABLE', $configs["USER_TABLE"]);
	
	}
	
	//Default values
	defined('USER_TABLE') or define('USER_TABLE', "USER_TABLE");
	
	
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
	
	
	function get_user($username)
	{
		$sql = "SELECT * FROM " . USER_TABLE . " WHERE username = :username";
		
		$results = database\query($sql,["username"=>$username]);
		
		var_dump($results);
	}
	
	function input_user($username,$password)
	{
		$sql = "INSERT INTO " . USER_TABLE . " (username,password) VALUES (:username,:password)";
		
		$results = database\query($sql,["username"=>$username,"password"=>$password]);

		var_dump($results);
	}
	
	$password = password_hash("Hello",PASSWORD_DEFAULT);

	
	echo password_verify("Hello", $password);
	echo bin2hex(openssl_random_pseudo_bytes(16));
	
	get_user("hello","test");
	
	include("pages/error.php");
	exit();
?>