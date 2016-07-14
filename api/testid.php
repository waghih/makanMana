<?php 

$pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
$randomId ='u' . substr(str_shuffle(str_repeat($pool, 5)), 0, 5);
$password = 123456;
$username1 = user1;
$username2 = user2;

echo sha1($username1.$password);
echo sha1($username2.$password);
echo $randomId;


?>