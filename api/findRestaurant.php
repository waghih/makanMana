<?php 
	
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, x-xsrf-token");

	// include 'dbConnect.php';

	$request = json_decode(file_get_contents("php://input"));
	
	//Getting values
	// $request = json_decode($data);
	// $name = $request->name;
	// $rating = $request->rating;
	// $description = $request->description;
	// $restaurant_id = $request->restaurant_id;

	$percent = "%";
	$state = $percent . $request->state . $percent;
	$city = $percent . $request->city . $percent;
	$meal = $percent . $request->meal . $percent;
	$cuisine = $percent . $request->cuisine . $percent;
	$food_name = $percent . $request->foodName . $percent;
	$halal = $request->halal;
	$price = $request->price;
	$rating = $request->rating;

	if($price == 0) {
		$sql = "SELECT r.id,name,latitude,longitude,state,city,f.type,f.cuisine,f.id,f.food_name,f.price 
				FROM restaurant r, food f 
				WHERE r.id=f.restaurant_id 
					AND r.state='$state'
					AND r.city='$city'
					AND f.type like'$meal' 
					AND f.cuisine like '$cuisine' 
					AND f.food_name like '$food_name'
					AND r.rating >= $rating
					GROUP BY r.name";
	}elseif($price > 0 && $price <=10) {
		$sql = "SELECT r.id,name,latitude,longitude,state,city,f.type,f.cuisine,f.id,f.food_name,f.price 
				FROM restaurant r, food f 
				WHERE r.id=f.restaurant_id 
					AND r.state='$state'
					AND r.city='$city'
					AND f.type like'$meal' 
					AND f.cuisine like '$cuisine' 
					AND f.food_name like '$food_name'
					AND f.price <= 10
					AND r.rating >= $rating
					GROUP BY r.name";
	}elseif($price <= 25) {
		$sql = "SELECT r.id,name,latitude,longitude,state,city,f.type,f.cuisine,f.id,f.food_name,f.price 
				FROM restaurant r, food f 
				WHERE r.id=f.restaurant_id 
					AND r.state='$state'
					AND r.city='$city'
					AND f.type like'$meal' 
					AND f.cuisine like '$cuisine' 
					AND f.food_name like '$food_name'
					AND f.price <= 25
					AND r.rating >= $rating
					GROUP BY r.name";
	}elseif($price > 25) {
		$sql = "SELECT r.id,name,latitude,longitude,state,city,f.type,f.cuisine,f.id,f.food_name,f.price 
				FROM restaurant r, food f 
				WHERE r.id=f.restaurant_id 
					AND r.state='$state'
					AND r.city='$city'
					AND f.type like'$meal' 
					AND f.cuisine like '$cuisine' 
					AND f.food_name like '$food_name'
					AND f.price >25
					AND r.rating >= $rating
					GROUP BY r.name";
	}

	$r = mysqli_query($con,$sql);

	$result = array();	
	
	//looping through all the records fetched
	while($row = mysqli_fetch_array($r)){		
		//Pushing name and id in the blank array created 
		array_push($result,array(
			"id"=>$row['id'],
			"name"=>$row['name'],
			"latitude"=>$row['latitude'],
			"longitude"=>$row['longitude'],
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