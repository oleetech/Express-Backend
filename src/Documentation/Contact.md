#  Create New Contact

## Endpoint: POST /api/contacts

### Description
This endpoint allows you to submit a contact form with a name, email, and message.

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "message": "This is a test message."
}
```


# Get All Contacts 

## Endpoint: GET /api/contacts

### Description
This endpoint retrieves a list of all contacts submitted through the contact form.

### Request Headers

- `Authorization: Bearer <token>` (if authentication is required)

### Example cURL Request

```bash
curl -X GET https://yourapi.com/api/contacts \
     -H "Authorization: Bearer <your_token>"
```

# Contacts By Id


## Endpoint: GET /api/contacts/{id}

### Description
This endpoint retrieves the details of a specific contact by its ID.

### URL Parameters

- `id` (integer, required): The unique identifier of the contact.

### Request Headers

- `Authorization: Bearer <token>` (if authentication is required)

### Example cURL Request

```bash
curl -X GET https://yourapi.com/api/contacts/{id} \
     -H "Authorization: Bearer <your_token>"
```

# Contacts Delete By Id

## Endpoint: DELETE /api/contacts/{id}

### Description
This endpoint deletes a specific contact by its ID from the database.

### URL Parameters

- `id` (integer, required): The unique identifier of the contact to delete.

### Request Headers

- `Authorization: Bearer <token>` (if authentication is required)

### Example cURL Request

```bash
curl -X DELETE https://yourapi.com/api/contacts/{id} \
     -H "Authorization: Bearer <your_token>"

```

