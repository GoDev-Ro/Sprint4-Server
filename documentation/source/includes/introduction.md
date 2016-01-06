# Introduction

The Sprint #4 REST API allows for programmatic access and manipulation of a list of cities.

The API uses JSON as the format for input and output. In order for the API to understand your data properly, each POST/PUT/DELETE request should contain the header `Content-Type: application/json`. 

The API URL is `http://server.godev.ro:8080/api/:your_name` where `:your_name` is a string containing each student's name. Using this the data of each student's project is differentiated from another's.

Any endpoint of the API will be further described as `/endpoint`, the actual URL being `https://server.godev.ro:8080/api/:your_name/endpoint`.