<?php namespace database_access;

	/* database_access.php
	A module to connect to databases

	Revision history:
		Jeffrey Nelson 2016.10.18 Created
	*/

	/*--------------------------------------------------
	--Initialization------------------------------------
	--------------------------------------------------*/
	
	use \PDO;
	
	/*--------------------------------------------------
	--Contents------------------------------------------
	--------------------------------------------------*/
	
	$pdo_input = [
		"DSN" => "mysql",
		"host" => "localhost",
		"dbname" => "test",
		"user" => "root",
		"pass" => ""
	];
	$pdo = new PDOConnection($pdo_input);
	
	class PDOConnection
	{
		private $pdo_connection;
		
		//Creates the pdo connection
		public function __construct($input)
		{
			
			//Checks for required input
			if(!\lib_validation\validate($input,LV_ARRAY) 
				|| !\lib_validation\validate($input["DSN"],LV_STRING)
				|| !\lib_validation\validate($input["host"],LV_STRING)
				|| !\lib_validation\validate($input["dbname"],LV_STRING)
				|| !\lib_validation\validate($input["user"],LV_STRING)
				|| !\lib_validation\validate($input["pass"],LV_STRING,true))
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