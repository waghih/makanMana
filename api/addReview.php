<?php 
	
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, x-xsrf-token");

	// include 'dbConnect.php';

		$request = json_decode(file_get_contents("php://input"));
		
		//Getting values
		// $request = json_decode($data);
		$name = $request->name;
		$rating = $request->rating;
		$description = $request->description;
		$restaurant_id = $request->restaurant_id;

		// $name = $_POST['name'];
		// $description = $_POST['description'];
		// $rating = $_POST['rating'];
		// $restaurant_id = $_POST['restaurant_id']
		
		//Creating an sql query
		$sql = "INSERT INTO review (id,name,rating,description,restaurant_id) VALUES ('','$name', $rating, '$description', $restaurant_id)";
		
		//Importing our db connection script
		require_once('dbConnect.php');

		//Executing query to database
		if(mysqli_query($con,$sql)){
			echo 'Task Added Successfully';
		}else{
			echo 'Could Not Add Task';
		}
		
		//Closing the database 
		mysqli_close($con);
?>