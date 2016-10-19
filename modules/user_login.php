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
	
	//Checks if the user has a valid session and attempts to log them in if they don't
	function verify_logged_in(){
		//Check if logged in
		if(isset($_SESSION["LoggedIn"]))
		{
			//Verify session credentials
			if(isset($_SESSION["Username"]) 
				&& isset($_SESSION["Password"]))
			{
				
				//Ensures the user's credentials are valid
				if(null == verify_user_credentials($_SESSION["Username"], $_SESSION["Password"], true))
					destroy_user_session();
				
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
	}
	
	//Attempts to log the user in with post data 
	function attempt_login()
	{
		//Checks for post data
		if(isset($_POST["Username"]) 
			&& isset($_POST["Password"]))
		{
			$username = $_POST["Username"];
			$password = verify_user_credentials($_POST["Username"],$_POST["Password"]);
			
			//Checks if credentials were valid
			if(null != $password)
			{
				create_user_session($username,$password);
				return;
			}
		}
		
		//User has failed to log in
		destroy_user_session();
	}
	
	//Destroys the user's session information
	function create_user_session($username, $password)
	{
		//Set session variables
		$_SESSION["LoggedIn"] = true;
		$_SESSION["Username"] = $username;
		$_SESSION["Password"] = $password;
	}
	
	//Destroys the user's session information
	function destroy_user_session()
	{
		//Reset session variables
		if(isset($_SESSION["LoggedIn"])) unset($_SESSION["LoggedIn"]);
		if(isset($_SESSION["Username"])) unset($_SESSION["Username"]);
		if(isset($_SESSION["Password"])) unset($_SESSION["Password"]);
	}
	
	//Verifys that the user's name and password match the stored values, returns password hash
	function verify_user_credentials($username, $password, $hash = false)
	{
		
		//Get the user info
		$user = get_user($username);
		
		//If the user is not found return false
		if(!is_array($user))
			return null;
		
		//Check if the password provided is hashed or not
		if($hash)
		{
			//If the hashes match
			return $password == $user["password"] ? $password : null;
		}
		else
		{
			//Will attempt to rehash if necessary
			if(password_verify($password, $user["password"]))
			{
				//Prepares hash to be returned
				$password_hash = $user["password"];
				
				//Checks if the password needs re-hashing
				if(password_needs_rehash($password_hash, PASSWORD_DEFAULT))
				{
					//Create new hash
					$password_hash = password_hash($password, PASSWORD_DEFAULT);
					
					//Update the database
					update_user_password($username, $password_hash);
					
				}
				
				return $password_hash;
			}
			else
			{
				return null;
			}
		}
		
		
		
	}
	
	
	//Gets a user's information (username, password)
	function get_user($username)
	{
		//Prepare sql statement
		$sql = "SELECT password FROM " . USER_TABLE . " WHERE username = :username";
		
		//Execute the query
		$results = database\query($sql,["username"=>$username]);
		
		//Return the user data
		return $results;
	}
	
	//Updates a user's password
	function update_user_password($username,$password)
	{
		//Prepare sql statement
		$sql = "UPDATE " . USER_TABLE . " SET password=:password WHERE username = :username";
		
		//Execute the query
		$results = database\query($sql,["username"=>$username,"password"=>$password]);
		
		//Return the user data
		return $results;
	}
	
	//Inputs a user into the database
	function input_user($username,$password)
	{
		var_dump(get_user($username));
		//Checks if user exists
		if(is_array(get_user($username)))
			return 0;
		
		//Prepare sql statement
		$sql = "INSERT INTO " . USER_TABLE . " (username,password) VALUES (:username,:password)";
		
		//Execute the query
		$results = database\query($sql,["username"=>$username,"password"=>$password]);
		
		//Return the id
		return $results;
	}
	
	$password = password_hash("HEllo",PASSWORD_DEFAULT);

	
	echo password_verify("HEllo", $password);
	echo bin2hex(openssl_random_pseudo_bytes(16));
	
	var_dump(input_user("art","test"));
	
	include("pages/error.php");
	exit();
?>