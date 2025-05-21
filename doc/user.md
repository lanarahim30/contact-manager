# USER API SPEC

## Register User

Endpoint : /api/users

Method: POST

Request Body :

```json
{
	"username" : "johndoe",
	"password" : "secret",
	"name" : "John Doe"
}
```

Response Body (Success):

```json
{
	"data" : {
		"username" : "johndoe",
		"name" : "John Doe"
	}
}
```

Response Body (Failed):

```json
{
	"errors" : "Username already exists"
}
```

## Login User
Endpoint : /api/users/login

Method: POST

Request Body :

```json
{
	"username" : "johndoe",
	"password" : "secret"
}
```

Response Body (Success):

```json
{
	"data" : {
		"username" : "johndoe",
		"name" : "John Doe",
		"token" : "token generate random"
	}
}
```

Response Body (Failed):

```json
{
	"errors" : "Username or password is wrong"
}
```

## Get User

Endpoint : /api/users/profile

Method: GET

Headers: 
- Authorization : token

Response Body (Success):

```json
{
	"data" : {
		"username" : "johndoe",
		"name" : "John Doe"
	}
}
```

Response Body (Failed):

```json
{
	"errors" : "unauthorize"
}
```

## Update User

Endpoint : /api/users/profile

Method: PATCH

Headers: 
- Authorization : token

Request Body :

```json
{
	"password" : "secret", // OPtional
	"name" : "John Doe" // Optional
}
```

Response Body (Success):

```json
{
	"data" : {
		"username" : "johndoe",
		"name" : "John Doe"
	}
}
```

Response Body (Failed):

```json
{
	"errors" : "Username already exists"
}
```

## Logout User
Endpoint : /api/users/logout

Method: DELETE

Headers: 
- Authorization : token

Request Body :

```json
{
	"password" : "secret", // Optional
	"name" : "John Doe" // Optional
}
```

Response Body (Success):

```json
{
	"data" : true
}
```
