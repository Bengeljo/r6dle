<?php
// Get the JSON string from the request body
$jsonString = file_get_contents('php://input');

// Write the JSON string back to the operator.json file
file_put_contents('operator.json', $jsonString);
?>