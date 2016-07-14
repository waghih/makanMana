<?php 
	
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, x-xsrf-token");

	$request = json_decode(file_get_contents("php://input"));
		
		//Getting values
	// $request = json_decode($data);
	$to = 'alfaruq93@gmail.com'
	$subject = $request->subject;
	$name = $request->name;
	$email = $request->email;
	$msg = $request->message;
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

	// More headers
	$headers .= 'From: ' . $email . "\r\n";

	if(mail($to,$subject,$msg,$headers);){
		echo 'success'
	}else{
		echo 'failed';
	}
	
	
?>