<?php

	$executionStartTime = microtime(true);

	$input = file_get_contents('php://input');
	$data = json_decode($input, true);

	$isInputProvided = isset($data['id']);

	include("config.php");			
	
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	$query = false;
	$path = explode('/', $_SERVER['REQUEST_URI']);
	$id = $path[count($path) - 1];
	$tCode = $path[count($path) - 2];
	$table = "";

	if(isset($id) && is_numeric($id)) {
		switch ($tCode) {
			case 'p':
			  	$table = "personnel";
			  	break;
			case 'd':
				$table = "department";
			  	break;
			case 'l':
				$table = "location";
			  	break;
			default:
				break;
		  }
		$query = $conn->prepare("DELETE FROM " . $table . " WHERE id = ?");
	
		$query->bind_param("i", $id);

		$query->execute();
	}
	
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>