# Role-Based Authentication API Endpoints

This document outlines all the API endpoints for role-based authentication in the FilernowUI application.

## Architecture

The frontend Next.js application proxies all API requests to a FastAPI backend running on `http://localhost:8000/api`. Each endpoint handler forwards requests through with proper headers and authorization tokens.

---

## User Management (Super Admin Only)

### POST `/api/admin/create-user`
**Description:** Create the first superadmin user

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "secure_password",
  "name": "Admin User"
}
```

**Response:** User object with token

**File:** `app/api/admin/create-user/route.ts`

---

### GET `/api/admin/users`
**Description:** List all users in the system

**Query Parameters:**
- `skip` (optional): Number of records to skip
- `limit` (optional): Number of records to return

**Response:** Array of user objects

**File:** `app/api/admin/users/route.ts`

---

### POST `/api/admin/users`
**Description:** Create a new admin user with a specific role

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "secure_password",
  "name": "New Admin",
  "role": "admin"
}
```

**Response:** Newly created user object

**File:** `app/api/admin/users/route.ts`

---

### PUT `/api/admin/users/{user_id}`
**Description:** Update user details (email, password, name)

**Path Parameters:**
- `user_id`: The ID of the user to update

**Request Body:**
```json
{
  "email": "updated@example.com",
  "password": "new_password",
  "name": "Updated Name"
}
```

**Response:** Updated user object

**File:** `app/api/admin/users/[user_id]/route.ts`

---

### POST `/api/admin/users/{user_id}/assign-role`
**Description:** Assign or change a user's role

**Path Parameters:**
- `user_id`: The ID of the user

**Request Body:**
```json
{
  "role": "editor"
}
```

**Response:** Updated user object with new role

**File:** `app/api/admin/users/[user_id]/assign-role/route.ts`

---

## Role Management (Super Admin Only)

### GET `/api/admin/roles`
**Description:** List all available roles (custom and built-in)

**Response:** Array of role objects

**File:** `app/api/admin/roles/route.ts`

---

### POST `/api/admin/roles`
**Description:** Create a new custom role

**Request Body:**
```json
{
  "name": "custom_role",
  "description": "A custom role with specific permissions",
  "permissions": [
    "read:content",
    "write:content",
    "manage:users"
  ]
}
```

**Response:** Newly created role object

**File:** `app/api/admin/roles/route.ts`

---

### GET `/api/admin/roles/{role_name}`
**Description:** Get details for a specific role

**Path Parameters:**
- `role_name`: The name of the role

**Response:** Role object with permissions

**File:** `app/api/admin/roles/[role_name]/route.ts`

---

### PUT `/api/admin/roles/{role_name}`
**Description:** Update an existing role

**Path Parameters:**
- `role_name`: The name of the role

**Request Body:**
```json
{
  "description": "Updated description",
  "permissions": [
    "read:content",
    "write:content",
    "manage:users",
    "manage:roles"
  ]
}
```

**Response:** Updated role object

**File:** `app/api/admin/roles/[role_name]/route.ts`

---

### DELETE `/api/admin/roles/{role_name}`
**Description:** Delete a custom role

**Path Parameters:**
- `role_name`: The name of the role

**Response:** Confirmation message

**File:** `app/api/admin/roles/[role_name]/route.ts`

---

### POST `/api/admin/roles/init-builtin`
**Description:** Reinitialize built-in roles to their defaults

**Request Body:** Empty or `{}`

**Response:** List of reinitialized built-in roles

**File:** `app/api/admin/roles/init-builtin/route.ts`

---

### GET `/api/admin/roles/builtin/list`
**Description:** Get list of all built-in roles

**Response:** Array of built-in role objects

**File:** `app/api/admin/roles/builtin/list/route.ts`

---

## Authentication

### POST `/api/admin/login`
**Description:** Authenticate admin user and receive authentication token

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "superadmin"
  }
}
```

**File:** `app/api/admin/login/route.ts`

---

### GET `/api/admin/me`
**Description:** Get current authenticated admin user's profile

**Headers Required:**
- `Authorization: Bearer <token>`

**Response:** Current user object

**File:** `app/api/admin/me/route.ts`

---

### POST `/api/admin/forgot-password`
**Description:** Request a password reset token

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

**Response:** Confirmation message with reset email sent

**File:** `app/api/admin/forgot-password/route.ts`

---

### POST `/api/admin/reset-password`
**Description:** Reset password using reset token

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "new_secure_password"
}
```

**Response:** Success message

**File:** `app/api/admin/reset-password/route.ts`

---

## Authorization Headers

All authenticated endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <jwt_token>
```

The token is typically obtained from the `/api/admin/login` endpoint and stored in localStorage via the `lib/auth.ts` utility functions.

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Environment Variables

The API handlers use the following environment variable:
- `BACKEND_URL`: Base URL for the FastAPI backend (default: `http://localhost:8000`)

---

## Frontend Integration

Use the utilities in `lib/auth.ts` to manage authentication:

```typescript
import { getAdminAuthHeaders, getStoredAdminToken, setStoredAdminToken } from '@/lib/auth';

// Get authorization headers for API calls
const headers = getAdminAuthHeaders();

// Fetch with auth
const response = await fetch('/api/admin/users', {
  headers: {
    ...headers,
    'Content-Type': 'application/json',
  },
});
```
