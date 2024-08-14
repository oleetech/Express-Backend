# Get All Categories

**Endpoint**: `GET /api/categories`

**Method**: GET

**Description**: Retrieves a list of all categories.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## Responses
- **200 OK**: Returns an array of category objects.
- **500 Internal Server Error**: Indicates a server issue.


# Get Category by ID

**Endpoint**: `GET /api/categories/:id`

**Method**: GET

**Description**: Retrieves a single category by its ID.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## URL Params
| Parameter | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| `id`       | string | The ID of the category to retrieve.           |

## Responses
- **200 OK**: Returns the category object.
- **404 Not Found**: If the category with the specified ID is not found.
- **500 Internal Server Error**: Indicates a server issue.



# Create Category

**Endpoint**: `POST /api/categories`

**Method**: POST

**Description**: Creates a new category.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## Request Body

```json
{
    "name": "Electronics"
}
```


## Responses
- ***201 Created***: Returns the created category object.
- ***400 Bad Request***: If required fields are missing or invalid.
- ***500 Internal Server Error***: Indicates a server issue.


---

### **Update Category** (`PUT /api/categories/:id`)

```markdown
# Update Category

**Endpoint**: `PUT /api/categories/:id`

**Method**: PUT

**Description**: Updates an existing category by its ID.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## URL Params
| Parameter | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| `id`       | string | The ID of the category to update.             |

## Request Body

```json
{
    "name": "Updated Electronics"
}

```
## Responses
- ***200 OK***: Returns a success message.
- ***404 Not Found***: If the category with the specified ID is not found.
- ***400 Bad Request***: If required fields are missing or invalid.
- ***500 Internal Server Error***: Indicates a server issue.


---

### **Delete Category** (`DELETE /api/categories/:id`)

```markdown
# Delete Category

**Endpoint**: `DELETE /api/categories/:id`

**Method**: DELETE

**Description**: Deletes a category by its ID.

## Headers
- `Content-Type`: `application/json`
- `Authorization`: (optional) `Bearer <token>` (if authentication is required)

## URL Params
| Parameter | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| `id`       | string | The ID of the category to delete.             |

## Responses
- **200 OK**: Returns a success message.
- **404 Not Found**: If the category with the specified ID is not found.
- **500 Internal Server Error**: Indicates a server issue.
