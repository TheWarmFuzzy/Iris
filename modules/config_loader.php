<?php namespace config_loader;

	function load($filename){
		
		//Add json extension
		$filename .= ".json";
		
		//Check if the input exists
		if(!isset($filename))
			return null;

		//Check if the input is valid
		if(!is_string($filename))
			return null;
		
		//Check if the filename is empty
		if(empty($filename))
			return null;
		
		//Checks if the file exists
		if(!file_exists($filename))
			return null;
		
		//Load the file
		$json = file_get_contents($filename);
		
		//Parse the file
		$data = json_decode($json, true);
		
		//Return the results
		return $data;
	}

?>