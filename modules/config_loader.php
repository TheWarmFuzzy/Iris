<?php namespace config_loader;

	function load($filename){
		
		//Check if the input exists
		if(!isset($filename))
			return null;

		//Check if the input is valid
		if(!is_string($filename))
			return null;
		
		//Check if the filename is empty
		if(empty($filename))
			return null;
		
		//Escape characters just to be safe 
		$filename = addslashes($filename);
		
		//Convert namespace to a file path
		$filename = "configs/" . $filename . ".json";
		
		//Checks if the file exists
		if(!file_exists($filename))
			return null;
		
		//Load the file
		$json = file_get_contents($filename);
		
		//Parse the file
		$data = json_decode($json, true);
		
		//Return the results (associative array)
		return $data;
	}

?>