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
    "category_id": "integer"
}
```

### **200 OK**
- **Description**: Returns the created subcategory object.
- **Example Response**:

```json
{
    "id": 1,
    "name": "New Subcategory Name",
    "category_id": 1, // ID of the associated category
    "parent_category": "Existing Category Name", // Name of the associated category
    "createdAt": "2024-08-18T12:00:00Z",
    "updatedAt": "2024-08-18T12:00:00Z"
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
    "category_id": "integer"
}
```

## Responses

### **200 OK**
- **Description**: Returns the updated subcategory object.
- **Example Response**:
```json
{
    "id": 1,
    "name": "Updated Subcategory Name",
    "category_id": 2, // ID of the updated category
    "parent_category": "New Category Name", // Name of the updated category
    "createdAt": "2024-08-18T12:00:00Z",
    "updatedAt": "2024-08-18T12:30:00Z"
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




