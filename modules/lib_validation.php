<?php namespace lib_validation;

	/* lib_validation.php
	A module to validate any given value

	Revision history:
		Jeffrey Nelson 2016.10.18 Created
	*/

	/*--------------------------------------------------
	--Initialization------------------------------------
	--------------------------------------------------*/
	define("LV_STRING",0);
	define("LV_NUMBER",1);
	define("LV_INTEGER",2);
	define("LV_ARRAY",3);
	
	/*--------------------------------------------------
	--Contents------------------------------------------
	--------------------------------------------------*/
	
	//Returns if the data matches the given type
	function validate($data, $data_type = LIV_STRING, $allow_empty = false)
	{
		//Checks if the data exists
		if(!isset($data))
			return false;
		
		//Checks if the data is empty
		if(empty($data) && !$allow_empty)
			return false;
		
		//Verify data type
		switch($data_type)
		{
			
			//String
			case LV_STRING: 
				return is_string($data);
				break;
			
			//Number			
			case LV_NUMBER: 
				return is_numeric($data);
				break;
			
			//Integer
			case LV_INTEGER: 
				return is_int($data);
				break;
			
			//Array
			case LV_ARRAY:
				return is_array($data);
				break;
				
			//None of the above
			default:
				return false;
				break;
		}
		
		return false;
	}
?>