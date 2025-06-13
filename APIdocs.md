# API Docs

A REST API is used to deliver the following web services :

- Admin and User Registration
- Admin and User Login

admin and user are the only roles in the system

POST requests must always have `Content-Type` header set to `application/json`

*For admins :*

- Form creation
- Appending a form element to a form

## Registration

| Endpoint | HTTP Method | Authentication | Role | Response |
|---|---|---|---|---|
|/register|POST|Username and Password|Admin or User| Request Status |

Payload:

``` json
{
    "username":"sample-username",
    "password":"sameple-password",
    "role":"admin"
}
```

## Login

| Endpoint | HTTP Method | Authentication | Role | Response |
|---|---|---|---|---|
|/login|GET|Username and Password|Admin or User| JSON Web Token |

Payload:

``` json
{
    "username":"sample-username",
    "password":"sameple-password",
    "role":"admin"
}
```

Successful Response :

```json
{
    "Success": "User logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiasdasZSI6ImFkbWluIiwiaWFIjoxNzQ5ODI0MD4LCJeHAiOjE3sfs4MzEyNTh9.40YYMXjkrMguiOEx917ZNUkwlHasdaTksuzY6zfcNQU"
}
```

This token can then be used to avail the services of the system by placing it in the `Authorization` header as shown:

`Authorization: Bearer <auth-token>`

The token given in the example is only a sample web token and cannot be used for authentication.

## Create Form

| Endpoint | HTTP Method | Authentication | Role | Response |
|---|---|---|---|---|
|/create_form|POST|JSON Web Token|Admin only| Request Status and `form_id` |

Request Headers:

``` json
{
"Content-Type": "application/json",
"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ5ODI0MDU4LCJleHAiOjE3NDk4MzEyNTh9.40YYMXjkrMguiOEx917ZNUkwlHY3fmTksuzY6zfcNQU"
}
```

Payload:

``` json
{
    "form_name":"new-form"
}
```

Successful Response :

``` json
{
    "Success": "Form successfully created",
    "form_id": 4
}
```
