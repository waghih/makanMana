<?php
	
	header("Access-Control-Allow-Origin: *");

	$meal = $_GET['meal'];

	require_once('dbConnect.php');

	$sql = "SELECT * FROM restaurant WHERE breakfast=1";
	$sql2 = "SELECT * FROM restaurant WHERE lunch=1";
	$sql3 = "SELECT * FROM restaurant WHERE dinner=1";
	
	//creating a blank array 
	if($meal == 1) {
		$r = mysqli_query($con,$sql);
	}elseif ($meal == 2) {
		$r = mysqli_query($con,$sql2);		
	}else{
		$r = mysqli_query($con,$sql3);
	}
	
	
	//pushing result to an array 
	$result = array();	
	
	//looping through all the records fetched
	while($row = mysqli_fetch_array($r)){
		
		//Pushing name and id in the blank array created 
		array_push($result,array(
			"id"=>$row['id'],
			"name"=>$row['name'],
			"registrationNo"=>$row['registrationNo'],
			"latitude"=>$row['latitude'],
			"longitude"=>$row['longitude'],
			"address"=>$row['address'],
			"postalCode"=>$row['postalCode'],
			"city"=>$row['city'],
			"state"=>$row['state'],
			"cuisine"=>$row['cuisine'],
			"rating"=>$row['rating'],
			"halalStatus"=>$row['halalStatus'],
			"user_id"=>$row['user_id']
		));
	}

	// if(mysqli_num_rows($result)){
	// 	while($row=mysqli_fetch_assoc($result)){
	// 		$json['restaurant_info'][]=$row;
	// 	}
	// }
	
	//Displaying the array in json format 
	echo json_encode(array('result'=>$result));
	
	mysqli_close($con);
?>