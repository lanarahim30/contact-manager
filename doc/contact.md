# Contact API SPEC

## Create Contact
Endpoint : /api/contacts

Method :  POST

Headers: 
- Authorization : token

Request Body : 

```json
{
	"first_name" : "John",
	"last_name" : "Wick",
	"email" : "johnwick@gmail.com",
	"phone" : "08123456789"
}
```

Response Body : 

```json
{
	"data": {
		"id" : "uuid generated",
		"first_name" : "John",
		"last_name" : "Wick",
		"email" : "johnwick@gmail.com",
		"phone" : "08123456789"
	} 
}
```

## Get Contact
Endpoint : /api/contacts/:contactId

Method :  GET

Headers: 
- Authorization : token

Response Body : 

```json
{
	"data": {
		"id" : "uuid generated",
		"first_name" : "John",
		"last_name" : "Wick",
		"email" : "johnwick@gmail.com",
		"phone" : "08123456789"
	} 
}
```

## Update Contact
Endpoint : /api/contacts/:contactId

Method :  PUT

Headers: 
- Authorization : token

Request Body : 

```json
{
	"first_name" : "John",
	"last_name" : "Wick",
	"email" : "johnwick@gmail.com",
	"phone" : "08123456789"
}
```

Response Body : 

```json
{
	"data": {
		"id" : "uuid generated",
		"first_name" : "John",
		"last_name" : "Wick",
		"email" : "johnwick@gmail.com",
		"phone" : "08123456789"
	} 
}
```

## Delete Contact
Endpoint : /api/contacts/:contactId

Method :  DELETE

Headers: 
- Authorization : token


Response Body : 

```json
{
	"data": true
}
```

## Search Contact
Endpoint : /api/contacts/search

Method :  POST

Headers: 
- Authorization : token

Params:
- name: string (Optional)
- phone: string (Optional)
- email: string (Optional)
- page: number, default 1
- size:  number, default 10

Response Body : 

```json
{
	"data": [
		{
			"id" : "uuid generated",
			"first_name" : "John",
			"last_name" : "Wick",
			"email" : "johnwick@gmail.com",
			"phone" : "08123456789"
		},
		{
			"id" : "uuid generated",
			"first_name" : "John",
			"last_name" : "Wick",
			"email" : "johnwick@gmail.com",
			"phone" : "08123456789"
		} 
	],
	"paging" : {
		"current_page" : 1,
		"total_page" : 10,
		"size" : 10
	}
}
```
