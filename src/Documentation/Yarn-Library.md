# Get All Products

**Endpoint**: `GET /api/products`

**Method**: GET

**Description**: Retrieves a list of all products.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## Query Parameters

| Parameter | Type   | Description                | Default | Example Value |
|-----------|--------|----------------------------|---------|---------------|
| `limit`   | number | Number of products to return per page. | 10      | `20`          |
| `offset`  | number | Number of products to skip. | 0       | `30`          |
| `category`| string | Filter products by category. | -       | `"Electronics"` |

## JSON Example Response

```json
[
    {
        "id": 1,
        "name": "Sample Product",
        "specification": "Detailed specs here",
        "weight": "500g",
        "description": "This is a sample product description.",
        "color": "Red",
        "price": "19.99",
        "category": "Electronics",
        "sub_category": "Mobile Phones",
        "image": "/uploads/sample-product.jpg",
        "createdAt": "2024-08-14T12:34:56.789Z",
        "updatedAt": "2024-08-14T12:34:56.789Z"
    },
    {
        "id": 2,
        "name": "Another Product",
        "specification": "Another detailed spec",
        "weight": "300g",
        "description": "Another product description.",
        "color": "Blue",
        "price": "29.99",
        "category": "Home Appliances",
        "sub_category": "Blenders",
        "image": "/uploads/another-product.jpg",
        "createdAt": "2024-08-14T12:34:56.789Z",
        "updatedAt": "2024-08-14T12:34:56.789Z"
    }
]
```

# Create Product

**Endpoint**: `POST /api/products`

**Method**: POST

**Description**: Creates a new product with optional image upload.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Content-Type`  | `multipart/form-data`          |
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## Request Body

| Parameter       | Type    | Description                            | Required | Example Value      |
|-----------------|---------|----------------------------------------|----------|--------------------|
| `name`          | string  | The name of the product.               | Yes      | `"Sample Product"` |
| `specification` | string  | Specifications or features of the product. | No       | `"Detailed specs here"` |
| `weight`        | string  | Weight of the product.                 | No       | `"500g"`           |
| `description`   | string  | Detailed description of the product.   | No       | `"This is a sample product description."` |
| `color`         | string  | Color of the product.                  | No       | `"Red"`            |
| `price`         | string  | Price of the product.                  | Yes      | `"19.99"`          |
| `category_id`   | int  | Category ID.                              | Yes      | `"Electronics"`    |
| `sub_category_id`| int  | Sub-category ID                        | No       | `"Mobile Phones"`  |
| `image`         | file    | The image file of the product.         | No       | `sample-product.jpg` |

## JSON Example Request

```json
{
  "id": 1,
  "name": "Sample Product",
  "specification": "Product specification",
  "weight": "1kg",
  "description": "Product description",
  "color": "Red",
  "price": 99.99,
  "category": 1,
  "subcategory": 2,
  "image": "uploads/sample.jpg"
}

```
# Get Product By ID

**Endpoint**: `GET /api/products/:id`

**Method**: GET

**Description**: Retrieves a single product by its ID.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## Path Parameters

| Parameter | Type   | Description                               | Example Value |
|-----------|--------|-------------------------------------------|---------------|
| `id`      | number | The ID of the product to retrieve.        | `1`           |

## JSON Example Response

```json
{
    "id": 1,
    "name": "Sample Product",
    "specification": "Detailed specs here",
    "weight": "500g",
    "description": "This is a sample product description.",
    "color": "Red",
    "price": "19.99",
    "category": "Electronics",
    "sub_category": "Mobile Phones",
    "image": "/uploads/sample-product.jpg",
    "createdAt": "2024-08-14T12:34:56.789Z",
    "updatedAt": "2024-08-14T12:34:56.789Z"
}
```


# Update Product

**Endpoint**: `PUT /api/products/:id`

**Method**: PUT

**Description**: Updates the details of an existing product by its ID.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |
| `Content-Type`  | `application/json`            |

## Path Parameters

| Parameter | Type   | Description                          | Example Value |
|-----------|--------|--------------------------------------|---------------|
| `id`      | number | The ID of the product to update.     | `1`           |

## Request Body

| Field          | Type   | Description                              | Example Value           |
|----------------|--------|------------------------------------------|-------------------------|
| `name`         | string | Name of the product                      | `"Updated Product Name"` |
| `specification`| string | Specification details                    | `"Updated specs here"`   |
| `weight`       | string | Weight of the product                    | `"600g"`                |
| `description`  | string | Description of the product               | `"Updated product description"` |
| `color`        | string | Color of the product                     | `"Blue"`                |
| `price`        | string | Price of the product                     | `"29.99"`               |
| `category_id`     | string | Category of the product                  | `"Electronics"`         |
| `sub_category_id` | string | Sub-category of the product              | `"Laptops"`             |
| `image`        | string | Path to the new image file (optional)    | `"/uploads/new-image.jpg"` |

## JSON Example Request

```json
{
    "name": "Updated Product Name",
    "specification": "Updated specs here",
    "weight": "600g",
    "description": "Updated product description",
    "color": "Blue",
    "price": "29.99",
    "sub_category_id": 1,
    "sub_category_id": 2,
    "image": "/uploads/new-image.jpg"
}
```


# Delete Product

**Endpoint**: `DELETE /api/products/:id`

**Method**: DELETE

**Description**: Deletes an existing product by its ID.

## Headers

| Header          | Value                         |
|-----------------|-------------------------------|
| `Authorization` | (optional) `Bearer <token>` (if authentication is required) |

## Path Parameters

| Parameter | Type   | Description                          | Example Value |
|-----------|--------|--------------------------------------|---------------|
| `id`      | number | The ID of the product to delete.     | `1`           |

## Responses

- **200 OK**: Returns a success message if the product is deleted successfully.

    **Example Response:**
    ```json
    {
        "message": "Product deleted successfully"
    }
    ```

- **404 Not Found**: If the product with the specified ID does not exist.

    **Example Response:**
    ```json
    {
        "message": "Product not found"
    }
    ```

- **500 Internal Server Error**: Indicates a server issue.

    **Example Response:**
    ```json
    {
        "message": "Failed to delete product",
        "error": "Error details here"
    }
    ```


