# Create Subsubcategory

**Endpoint**: `POST /api/subsubcategories`

**Method**: POST

**Description**: Creates a new subsubcategory under a specified subcategory.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Content-Type`  | `application/json`            |
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## Request Body

| Parameter       | Type    | Description                            | Required | Example Value        |
|-----------------|---------|----------------------------------------|----------|----------------------|
| `name`          | string  | The name of the subsubcategory.        | Yes      | `"Smartphones"`      |
| `sub_category_id` | int   | Sub-category ID to which the subsubcategory belongs. | Yes      | `2`                  |

## JSON Example Request

```json
{
  "name": "Smartphones",
  "sub_category_id": 2
}
```

# Read All Subsubcategories

**Endpoint**: `GET /api/subsubcategories`

**Method**: GET

**Description**: Retrieves a list of all subsubcategories.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Content-Type`  | `application/json`            |
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## Response

### Success Response

**Status Code**: 200 OK

**Content-Type**: `application/json`

**Body**:

```json
[
    {
        "id": 1,
        "name": "Smartphones",
        "sub_category_id": 2,
        "parent_sub_category": "Electronics",
        "createdAt": "2024-08-22T12:00:00Z",
        "updatedAt": "2024-08-22T12:00:00Z"
    },
    {
        "id": 2,
        "name": "Laptops",
        "sub_category_id": 2,
        "parent_sub_category": "Electronics",
        "createdAt": "2024-08-22T12:00:00Z",
        "updatedAt": "2024-08-22T12:00:00Z"
    }
]
```

# Get Subsubcategory By ID

**Endpoint**: `GET /api/subsubcategories/:id`

**Method**: GET

**Description**: Retrieves a specific subsubcategory by its ID.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Content-Type`  | `application/json`            |
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## URL Parameters

| Parameter | Type | Description                       | Required | Example Value |
|-----------|------|-----------------------------------|----------|---------------|
| `id`      | int  | The ID of the subsubcategory to retrieve. | Yes      | `1`           |

## Response

### Success Response

**Status Code**: 200 OK

**Content-Type**: `application/json`

**Body**:

```json
{
    "id": 1,
    "name": "Smartphones",
    "sub_category_id": 2,
    "parent_sub_category": "Electronics",
    "createdAt": "2024-08-22T12:00:00Z",
    "updatedAt": "2024-08-22T12:00:00Z"
}
```

# Update Subsubcategory

**Endpoint**: `PUT /api/subsubcategories/:id`

**Method**: PUT

**Description**: Updates the details of a specific subsubcategory by its ID.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Content-Type`  | `application/json`            |
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## URL Parameters

| Parameter | Type | Description                       | Required | Example Value |
|-----------|------|-----------------------------------|----------|---------------|
| `id`      | int  | The ID of the subsubcategory to update. | Yes      | `1`           |

## Request Body

| Parameter     | Type    | Description                            | Required | Example Value      |
|---------------|---------|----------------------------------------|----------|--------------------|
| `name`        | string  | The new name for the subsubcategory.   | Yes      | `"Smartphones"`    |
| `subCategoryId` | int  | The ID of the subcategory to associate with. | Yes      | `2`               |

## Response

### Success Response

**Status Code**: 200 OK

**Content-Type**: `application/json`

**Body**:

```json
{
    "id": 1,
    "name": "Smartphones",
    "subCategoryId": 2,
    "parent_sub_category": "Electronics",
    "createdAt": "2024-08-22T12:00:00Z",
    "updatedAt": "2024-08-23T12:00:00Z"
}
```

# Delete Subsubcategory

**Endpoint**: `DELETE /api/subsubcategories/:id`

**Method**: DELETE

**Description**: Deletes a specific subsubcategory by its ID. Returns the deleted subsubcategory data if the deletion is successful.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## URL Parameters

| Parameter | Type | Description                       | Required | Example Value |
|-----------|------|-----------------------------------|----------|---------------|
| `id`      | int  | The ID of the subsubcategory to delete. | Yes      | `1`           |

## Response

### Success Response

**Status Code**: 200 OK

**Content-Type**: `application/json`

**Body**:

```json
{
    "id": 1,
    "name": "Sample Subsubcategory",
    "sub_category_id": 2,
    "createdAt": "2024-08-22T12:34:56.789Z",
    "updatedAt": "2024-08-22T12:34:56.789Z"
}
```