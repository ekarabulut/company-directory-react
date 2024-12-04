<?php

	$executionStartTime = microtime(true);
	// Capture raw POST JSON data
	$input = file_get_contents('php://input');
	// Decode JSON into an associative array
	$data = json_decode($input, true);
	$query = false;	
	
	include("utils.php");
	include("config.php");	

	$isInputProvided = checkInput($data);
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno() || !$isInputProvided) {
		
		http_response_code(300);
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = !$isInputProvided ? "Missing fields error." : "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.	
	switch($data['tCode']) {
		case 'p':
			$query = upsertPersonnel($conn, $data);
			break;
		case 'd':
			$query = upsertDepartment($conn, $data);
			break;
		case 'l':
			$query = upsertLocation($conn, $data);
			break;
		default:
			break;
	}
		
	$query->execute();	
	
	if (false === $query) {
		http_response_code(400);
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	http_response_code(200);
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>