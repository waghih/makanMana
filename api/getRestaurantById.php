<?php
	
	header("Access-Control-Allow-Origin: *");

	$id = $_GET['id'];

	require_once('dbConnect.php');

	$sql = "SELECT * FROM restaurant where id=$id";

	$result = mysqli_query($con,$sql);
	
	//creating a blank array 
	$json = array();
	
	//looping through all the records fetched
	// while($row = mysqli_fetch_array($r)){
		
	// 	//Pushing name and id in the blank array created 
	// 	array_push($result,array(
	// 		"id"=>$row['id'],
	// 		"name"=>$row['name'],
	// 		"registrationNo"=>$row['registrationNo'],
	// 		"latitude"=>$row['latitude'],
	// 		"longitude"=>$row['longitude'],
	// 		"address"=>$row['address'],
	// 		"postalCode"=>$row['postalCode'],
	// 		"city"=>$row['city'],
	// 		"state"=>$row['state'],
	// 		"cuisine"=>$row['cuisine'],
	// 		"rating"=>$row['rating'],
	// 		"halalStatus"=>$row['halalStatus'],
	// 		"user_id"=>$row['user_id']
	// 	));
	// }

	if(mysqli_num_rows($result)){
		while($row=mysqli_fetch_assoc($result)){
			$json['restaurant_info'][]=$row;
		}
	}
	
	//Displaying the array in json format 
	echo json_encode($json);
	
	mysqli_close($con);
?>