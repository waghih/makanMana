<?php
$host="10.101.237.101"; //replace with database hostname
$username="mad"; //replace with database username
$password="mad71"; //replace with database password
$db_name="mad_afarooqezhar"; //replace with database name
$con=mysql_connect("$host", "$username", "$password")or die("cannot
connect");
mysql_select_db("$db_name")or die("cannot select DB");
$sql = "select * from poster_database";
$result = mysql_query($sql);
$json = array();
if(mysql_num_rows($result)){
while($row=mysql_fetch_assoc($result)){
$json['moja_poster'][]=$row;
}
}
mysql_close($con);
echo json_encode($json);
?>