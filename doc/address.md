# Address API SPEC

## Create Address
Endpoint : /api/contacts/:contactId/addresses

Method :  POST

Headers: 
- Authorization : token

Request Body : 

```json
{
	"street" : "Jln Pulau", // Optional
	"city" : "Denpasar",
	"province" : "Bali",
	"country" : "Indonesia",
	"postal_code" : "123456"
}
```

Response Body : 

```json
{
	"data": {
		"id" : "uuid generated",
		"street" : "Jln Pulau",
		"city" : "Denpasar",
		"province" : "Bali",
		"country" : "Indonesia",
		"postal_code" : "123456"
	} 
}
```

## Get Address
Endpoint : /api/contacts/:contactId/addresses/:addressId

Method :  GET

Headers: 
- Authorization : token

Response Body : 

```json
{
	"data": {
		"id" : "uuid generated",
		"street" : "Jln Pulau",
		"city" : "Denpasar",
		"province" : "Bali",
		"country" : "Indonesia",
		"postal_code" : "123456"
	} 
}
```

## Update Address
Endpoint : /api/contacts/:contactId/addresses/:addressId

Method :  PUT

Headers: 
- Authorization : token

Request Body : 

```json
{
	"street" : "Jln Pulau", // Optional
	"city" : "Denpasar", // Optional
	"province" : "Bali", // Optional
	"country" : "Indonesia", // Optional
	"postal_code" : "123456" // Optional
}
```

Response Body : 

```json
{
	"data": {
		"id" : "uuid generated",
		"street" : "Jln Pulau",
		"city" : "Denpasar",
		"province" : "Bali",
		"country" : "Indonesia",
		"postal_code" : "123456"
	} 
}
```

## Delete Adress
Endpoint : /api/contacts/:contactId/addresses/:addressId

Method :  DELETE

Headers: 
- Authorization : token


Response Body : 

```json
{
	"data": true
}
```

## List Adresses
Endpoint : /api/contacts/:contactId/addresess

Method :  POST

Headers: 
- Authorization : token


Response Body : 

```json
{
	"data": [
		{
			"id" : "uuid generated",
			"street" : "Jln Pulau",
			"city" : "Denpasar",
			"province" : "Bali",
			"country" : "Indonesia",
			"postal_code" : "123456"
		},
		{
			"id" : "uuid generated",
			"street" : "Jln Pulau",
			"city" : "Denpasar",
			"province" : "Bali",
			"country" : "Indonesia",
			"postal_code" : "123456"
		} 
	]
}
```
