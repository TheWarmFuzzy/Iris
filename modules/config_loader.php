<?php namespace config_loader;
	
	/* config_loader.php
	A module to load in json config files for each module

	Revision history:
		Jeffrey Nelson 2016.10.18 Created
	*/
	
	function load($filename){

		//Check if the input is valid
		if(!\lib_validation\validate($filename, LV_STRING))
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