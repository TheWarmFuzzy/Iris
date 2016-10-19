<?php namespace database_access;

	/* database_access.php
	A module to connect to databases

	Revision history:
		Jeffrey Nelson 2016.10.18 	Created
		Jeffrey Nelson 2016.10.19 	Added: query function, configuration loading

	*/

	/*--------------------------------------------------
	--Initialization------------------------------------
	--------------------------------------------------*/
	
	//Namespaces
	use \PDO;
	use \lib_validation as lv;
	
	//Load configuration file
	$configs = \config_loader\load(__NAMESPACE__);
	
	//Check if config is valid array
	if(lv\validate($configs,LV_ARRAY))
	{
		//Load DSN
		if(lv\validate($configs["DSN"],LV_STRING))
			define('DSN', $configs["DSN"]);

		//Load Host
		if(lv\validate($configs["HOST"],LV_STRING))
			define('HOST', $configs["HOST"]);
		
		//Load database name
		if(lv\validate($configs["DBNAME"],LV_STRING))
			define('DBNAME', $configs["DBNAME"]);
		
		//Load database username
		if(lv\validate($configs["USERNAME"],LV_STRING))
			define('USERNAME', $configs["USERNAME"]);
		
		//Load database password, allows empty string
		if(lv\validate($configs["PASSWORD"],LV_STRING, true))
			//Lets not store passwords in global constants
			define('PASSWORD', $configs["PASSWORD"]);
	}
	
	//Set default configuration if config file failed
	defined('DSN') or define('DSN', "mysql");
	defined('HOST') or define('HOST', "localhost");
	defined('DBNAME') or define('DBNAME', "DATABASE_NAME");
	defined('USERNAME') or define('USERNAME', "USERNAME");
	//Lets not store passwords in global constants
	//TO DO: find a solution to this
	defined('PASSWORD') or define('PASSWORD', "PASSWORD");
	
	
	/*--------------------------------------------------
	--Contents------------------------------------------
	--------------------------------------------------*/
	
	//Runs a query on a database
	function query($sql,$args = [])
	{
		//Prepare inputs
		$pdo_input = [
			"DSN" => DSN,
			"host" => HOST,
			"dbname" => DBNAME,
			"user" => USERNAME,
			"pass" => PASSWORD
		];

		//Create pdo connection
		$pdo = new PDOConnection($pdo_input);
		
		//Run query
		$result = $pdo->query($sql,$args);
		
		//Actually return the fucking value
		return $result["0"];
	}
	
	class PDOConnection
	{
		private $pdo_connection;
		
		//Creates the pdo connection
		public function __construct($input)
		{
			
			//Checks for required input
			if(!lv\validate($input,LV_ARRAY) 
				|| !lv\validate($input["DSN"],LV_STRING)
				|| !lv\validate($input["host"],LV_STRING)
				|| !lv\validate($input["dbname"],LV_STRING)
				|| !lv\validate($input["user"],LV_STRING)
				|| !lv\validate($input["pass"],LV_STRING,true))
				throw new \Exception("Invalid inputs for PDO class.");

			//Create string for PDO object
			$dsn = $input["DSN"] . ":host=" . $input["host"] . ";dbname=" . $input["dbname"] . ";charset=utf8";
			
			//Create PDO object
			$this->pdo_connection = new PDO($dsn, $input["user"], $input["pass"]);
			
			//Sets attributes
			$this->pdo_connection->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
			$this->pdo_connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

		}
		
		//Runs a query with the pdo object
		public function query($sql, $args)
		{
			try
			{
				//Prepares statement
				$clean_PDO = $this->pdo_connection->prepare($sql);
				
				//Runs statement replacing arguments
				$clean_PDO->execute($args);
				
				//Collects results
				$result = $clean_PDO->fetchAll();
				
				//Replaces result with id of last value if there are no results
				//This is used for creating foreign keys
				if(count($result)<1){
					
					$result = $this->pdo_connection->lastInsertId();
				}
				return $result;
			}
			catch(\PDOException $ex)
			{
				//Error handling is for people with more time on their hands
				var_dump($ex);
				//TO DO: ERROR HANDLING
				return null;
				
				
			}

		}
		
		//Closes the pdo connection
		public function close()
		{
			//Close the Connections
			$this->pdoConnection = null;
		}
	}

?>