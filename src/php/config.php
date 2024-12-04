
<?php
	// If not on remote server
	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		// connection details for MySQL database

		$cd_host = "127.0.0.1";
		$cd_port = 3306;
		$cd_socket = "";

		// database name, username and password

		$cd_dbname = "companydirectory";
		$cd_user = "root";
		$cd_password = "";
	}
	else {		

		$cd_host = "localhost";
		$cd_port = 3306;
		$cd_socket = "";
		
		$cd_dbname = "esramkarabulut";
		$cd_user = "esramkarabulut";
		$cd_password = "nalos365*";
	}

	// Common headers for all PHP files
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
	header('Content-Type: application/json; charset=UTF-8');

	// If it's a preflight request, respond with a 200 OK
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		http_response_code(200);
		exit();
	}
?>
