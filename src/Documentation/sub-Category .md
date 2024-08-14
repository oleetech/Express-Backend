# Get All Subcategories

**Endpoint**: `GET /api/subcategories`

**Method**: GET

**Description**: Retrieves a list of all subcategories.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## Responses
- **200 OK**: Returns an array of subcategory objects.
- **500 Internal Server Error**: Indicates a server issue.


# Get Subcategory by ID

**Endpoint**: `GET /api/subcategories/:id`

**Method**: GET

**Description**: Retrieves a single subcategory by its ID.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## URL Params
| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `id`       | string | The ID of the subcategory to retrieve.           |

## Responses
- **200 OK**: Returns the subcategory object.
- **404 Not Found**: If the subcategory with the specified ID is not found.
- **500 Internal Server Error**: Indicates a server issue.


# Create Subcategory

**Endpoint**: `POST /api/subcategories`

**Method**: POST

**Description**: Creates a new subcategory.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## Request Body
```json
{
    "name": "string",
    "category": "integer"
}
```

# Update Subcategory

**Endpoint**: `PUT /api/subcategories/:id`

**Method**: PUT

**Description**: Updates an existing subcategory by its ID.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## URL Params
| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `id`       | string | The ID of the subcategory to update.             |

## Request Body
```json
{
    "name": "string",
     "category": "integer"
}
```

## Responses

### **200 OK**
- **Description**: Returns the updated subcategory object.
- **Example Response**:
```json
{
    "id": "1",
    "name": "Updated Subcategory Name",
    "category": "Category Name"
}
```

# Delete Subcategory

**Endpoint**: `DELETE /api/subcategories/:id`

**Method**: DELETE

**Description**: Deletes a subcategory by its ID.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## URL Params
| Parameter | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| `id`      | string | The ID of the subcategory to delete.        |

## Responses

### **200 OK**
- **Description**: Returns a success message indicating that the subcategory has been deleted.
- **Example Response**:
```json
{
    "message": "Subcategory deleted successfully"
}
```




