<?php
	
	header("Access-Control-Allow-Origin: *");

	require_once('dbConnect.php');

	$sql = "SELECT * FROM food";

	// $result = mysqli_query($con,$sql);
	
	// //creating a blank array 
	// $json = array();

	// if(mysqli_num_rows($result)){
	// 	while($row=mysqli_fetch_assoc($result)){
	// 		$json['food_info'][]=$row;
	// 	}
	// }
	// while($row = mysqli_fetch_array($r)){
		
	// 	//Pushing name and id in the blank array created 
	// 	array_push($result,array(
	// 		"id"=>$row['id']
	// 	));
	// }
	
	// //Displaying the array in json format 
	// echo json_encode($json);
	
	// mysqli_close($con);
	$r = mysqli_query($con,$sql);
	
	//creating a blank array 
	$result = array();
	
	//looping through all the records fetched
	while($row = mysqli_fetch_array($r)){
		
		//Pushing name and id in the blank array created 
		array_push($result,array(
			"id"=>$row['id'],
		));
	}
	
	//Displaying the array in json format 
	echo json_encode(array('food'=>$result));
	
	mysqli_close($con);
?>