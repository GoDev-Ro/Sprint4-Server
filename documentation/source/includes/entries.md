# Entries

## Fetch entries

> Sample request

```shell
curl -X GET \
http://server.godev.ro:8080/api/michael/entries
```

> Sample response (**status 200**)


```json
{
    "page": 1,
    "perPage": 5,
    "totalPages": 1,
    "list": [
        {
            "id": 1,
            "name": "Bucharest",
            "visited": 1,
            "stars": 3
        }
    ]
}
```

### HTTP Request

`GET /:student/entries`

### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
page | 1 | Get a specific page of the result set
perPage | 5 | How many items per page should be returned

## Create an entry

> Sample request

```shell
curl -X POST \
-H "Content-Type: application/json" \
--data "{\"name\": \"London\", \"visited\": 0, \"stars\": 4}" \
http://server.godev.ro:8080/api/michael/entries
```

> Sample response (**status 201**)

```json
{
    "id": 2,
    "name": "London",
    "visited": 0,
    "stars": 4
}
```

### HTTP Request

`POST /:student/entries`

The request body should be a valid JSON representing a JavaScript object literal with the following required properties:

Property | Type
-------- | -----------
name | string
visited | numeric (0,1)
stars | numeric (1-5)

After adding a new entry, the API auto assigns an "id" property to the newly created entry for later retrieval and manipulation.

## Update an entry

> Sample request

```shell
curl -X PUT \
-H "Content-Type: application/json" \
--data "{\"name\": \"London\", \"visited\": 1, \"stars\": 5}" \
http://server.godev.ro:8080/api/michael/entries/2
```

> Sample response (**status 200**)

```json
{
    "id": 2,
    "name": "London",
    "visited": 1,
    "stars": 5
}
```

### HTTP Request

`PUT /:student/entries/:id`

The request body should be a valid JSON representing a JavaScript object literal with the following required properties:

Property | Type
-------- | -----------
name | string
visited | numeric (0,1)
stars | numeric (1-5)

## Delete an entry

> Sample request

```shell
curl -X DELETE \
-H "Content-Type: application/json" \
http://server.godev.ro:8080/api/michael/entries/2
```

> Sample response (**status 204**)

### HTTP Request

`DELETE /:student/entries/:id`

The response does not have content. The `204` HTTP status indicates that the operation was successful.