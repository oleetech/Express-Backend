# Register a New User

**Endpoint**: `POST /auth/register`

**Method**: `POST`

**Description**: Registers a new user with the provided information.

## Headers
- `Content-Type`: `application/json`

## Body Parameters
| Parameter | Type   | Description                              |
|-----------|--------|------------------------------------------|
| `username` | string | (optional) The unique username of the user. |
| `email`    | string | (optional) The email address of the user. |
| `password` | string | The password for the user's account.     |
| `phone`    | string | (optional) The phone number of the user. |

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

## Responses
- **201 Created**: If the user is successfully registered.
  - Body: `{ "message": "ব্যবহারকারী সফলভাবে নিবন্ধিত। প্রয়োজনীয় যাচাই সম্পন্ন করুন।" }`
- **400 Bad Request**: If the user already exists.
  - Body: `{ "message": "ব্যবহারকারী ইতোমধ্যে নিবন্ধিত" }`
- **500 Internal Server Error**: If there is a server error during registration.
  - Body: `{ "message": "ব্যবহারকারী নিবন্ধন করতে ত্রুটি", "error": "<error details>" }`



# User Login

**Endpoint**: `POST /auth/login`

**Method**: `POST`

**Description**: Authenticates a user with an email, phone number, or username along with their password.

## Headers
- `Content-Type`: `application/json`

## Body Parameters
| Parameter   | Type   | Description                                          |
|-------------|--------|------------------------------------------------------|
| `identifier`| string | The email, phone number, or username of the user.    |
| `password`  | string | The password associated with the user's account.     |

## Responses
- **200 OK**: If the user is successfully authenticated.
  - Body: `{ "token": "<JWT token>", "user": { "id": "<user id>", "username": "<username>", ... } }`
- **400 Bad Request**: If the user is not found or the password is incorrect.
  - Body: `{ "message": "Invalid credentials" }`
- **500 Internal Server Error**: If there is a server error during login.
  - Body: `{ "message": "Error logging in user", "error": "<error details>" }`


# Activate User Account

**Endpoint**: `GET /auth/activate/:token`

**Method**: `GET`

**Description**: Activates a user's account using the activation token sent via email.

## Headers
- `Content-Type`: `application/json`

## URL Parameters
| Parameter | Type   | Description                         |
|-----------|--------|-------------------------------------|
| `token`   | string | The activation token for the user.  |

## Responses
- **200 OK**: If the account is successfully activated.
  - Body: `{ "message": "Account activated successfully" }`
- **400 Bad Request**: If the activation token is invalid or expired.
  - Body: `{ "message": "Invalid activation link", "error": "<error details>" }`
- **500 Internal Server Error**: If there is a server error during account activation.
  - Body: `{ "message": "Invalid or expired activation link", "error": "<error details>" }`



### Verify OTP for Registration

**Endpoint**: `POST /auth/verify-otp`

**Method**: `POST`

**Description**: Verifies the OTP sent to the user's contact information and completes the registration process.

**Headers**:
- `Content-Type`: `application/json`

**Body Parameters**:
| Parameter  | Type   | Description                                                  |
|------------|--------|--------------------------------------------------------------|
| `contact`  | string | The phone number or email address associated with the OTP.  |
| `otp`      | string | The OTP sent to the user.                                    |
| `params`   | string | Should be `register` to indicate the registration process.   |

**Responses**:

- **200 OK**: If the OTP is successfully verified and registration is completed.
  - **Body**: `{ "message": "অ্যাকাউন্ট সফলভাবে সক্রিয় করা হয়েছে।" }`
- **400 Bad Request**: If the OTP is invalid or the user is not found.
  - **Body**: `{ "message": "অবৈধ OTP", "error": "<error details>" }`
- **500 Internal Server Error**: If there is a server error during OTP verification.
  - **Body**: `{ "message": "OTP যাচাই করার সময় ত্রুটি", "error": "<error details>" }`


### Verify OTP for Login

**Endpoint**: `POST /auth/verify-otp`

**Method**: `POST`

**Description**: Verifies the OTP sent to the user's contact information and completes the login process.

**Headers**:
- `Content-Type`: `application/json`

**Body Parameters**:
| Parameter  | Type   | Description                                                  |
|------------|--------|--------------------------------------------------------------|
| `contact`  | string | The phone number or email address associated with the OTP.  |
| `otp`      | string | The OTP sent to the user.                                    |
| `params`   | string | Should be `login` to indicate the login process.             |

**Responses**:

- **200 OK**: If the OTP is successfully verified and login is completed.
  - **Body**: `{ "message": "লগইন সফল", "token": "<JWT token>" }`
- **400 Bad Request**: If the OTP is invalid or the user is not found.
  - **Body**: `{ "message": "অবৈধ OTP", "error": "<error details>" }`
- **500 Internal Server Error**: If there is a server error during OTP verification.
  - **Body**: `{ "message": "OTP যাচাই করার সময় ত্রুটি", "error": "<error details>" }`


### Verify OTP for Reset Password

**Endpoint**: `POST /auth/verify-otp`

**Method**: `POST`

**Description**: Verifies the OTP sent to the user's contact information and allows the user to reset their password.

**Headers**:
- `Content-Type`: `application/json`

**Body Parameters**:
| Parameter  | Type   | Description                                                  |
|------------|--------|--------------------------------------------------------------|
| `contact`  | string | The phone number or email address associated with the OTP.  |
| `otp`      | string | The OTP sent to the user.                                    |
| `params`   | string | Should be `reset-password` to indicate the password reset process. |
| `newPassword` | string | The new password to set for the user's account.              |

**Responses**:

- **200 OK**: If the OTP is successfully verified and the password is reset.
  - **Body**: `{ "message": "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।" }`
- **400 Bad Request**: If the OTP is invalid or the user is not found.
  - **Body**: `{ "message": "অবৈধ OTP", "error": "<error details>" }`
- **500 Internal Server Error**: If there is a server error during OTP verification or password reset.
  - **Body**: `{ "message": "OTP যাচাই করার সময় ত্রুটি", "error": "<error details>" }`
