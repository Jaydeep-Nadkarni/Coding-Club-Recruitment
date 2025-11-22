# Tasks & Notifications API Documentation

## Overview
This document describes the Task and Notification APIs for the AuthDash application.

---

## Task API

### Models

**Task Schema:**
```javascript
{
  title: String (required, max 100 chars),
  description: String (max 500 chars),
  status: String enum ('pending', 'in-progress', 'completed'),
  dueDate: Date (nullable),
  priority: String enum ('low', 'medium', 'high'),
  tags: [String],
  completedAt: Date,
  userId: ObjectId (reference to User),
  timestamps: { createdAt, updatedAt }
}
```

### Endpoints

#### 1. Create Task
**POST** `/api/tasks`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "Resolve 401 error on refresh token",
  "dueDate": "2025-12-01T00:00:00Z",
  "priority": "high",
  "tags": ["bug", "auth"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Fix login bug",
    "description": "Resolve 401 error on refresh token",
    "status": "pending",
    "dueDate": "2025-12-01T00:00:00.000Z",
    "priority": "high",
    "tags": ["bug", "auth"],
    "userId": "507f1f77bcf86cd799439010",
    "createdAt": "2025-11-22T10:00:00.000Z",
    "updatedAt": "2025-11-22T10:00:00.000Z"
  }
}
```

#### 2. Get All Tasks
**GET** `/api/tasks`

**Authentication:** Required

**Query Parameters:**
- `status` (optional): 'pending', 'in-progress', or 'completed'
- `priority` (optional): 'low', 'medium', or 'high'
- `sortBy` (optional): 'dueDate' or 'priority' (default: 'createdAt')

**Example:**
```
GET /api/tasks?status=pending&priority=high&sortBy=dueDate
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Fix login bug",
      "status": "pending",
      "priority": "high",
      ...
    }
  ]
}
```

#### 3. Get Single Task
**GET** `/api/tasks/:id`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "task": { ... }
}
```

#### 4. Update Task
**PUT** `/api/tasks/:id`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Fix critical login bug",
  "status": "in-progress",
  "priority": "high"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": { ... }
}
```

**Note:** Updating status to 'completed' automatically sets `completedAt` timestamp.

#### 5. Delete Task
**DELETE** `/api/tasks/:id`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Note:** Also deletes all related notifications.

#### 6. Get Task Statistics
**GET** `/api/tasks/stats/summary`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "pending": 4,
    "inProgress": 3,
    "completed": 3
  }
}
```

---

## Notification API

### Models

**Notification Schema:**
```javascript
{
  message: String (required, max 250 chars),
  type: String enum ('task', 'reminder', 'info', 'warning', 'success'),
  read: Boolean (default: false),
  userId: ObjectId (reference to User),
  relatedTaskId: ObjectId (reference to Task, optional),
  actionUrl: String (optional),
  timestamps: { createdAt, updatedAt }
}
```

**Features:**
- Read notifications are automatically deleted after 30 days via TTL index
- Notifications are user-specific (indexed by userId)

### Endpoints

#### 1. Get All Notifications
**GET** `/api/notifications`

**Authentication:** Required

**Query Parameters:**
- `read` (optional): 'true' or 'false'
- `type` (optional): 'task', 'reminder', 'info', 'warning', 'success'
- `limit` (optional, default: 20): Number of results per page
- `page` (optional, default: 1): Page number for pagination

**Example:**
```
GET /api/notifications?read=false&limit=10&page=1
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "page": 1,
  "pages": 1,
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "message": "New task created: Fix login bug",
      "type": "task",
      "read": false,
      "userId": "507f1f77bcf86cd799439010",
      "relatedTaskId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Fix login bug",
        "status": "pending"
      },
      "actionUrl": null,
      "createdAt": "2025-11-22T10:00:00.000Z",
      "updatedAt": "2025-11-22T10:00:00.000Z"
    }
  ]
}
```

#### 2. Get Unread Count
**GET** `/api/notifications/unread/count`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "unreadCount": 3
}
```

#### 3. Mark Notification as Read
**PUT** `/api/notifications/:id/read`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": { ... }
}
```

#### 4. Mark All Notifications as Read
**PUT** `/api/notifications/mark-all/read`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "updatedCount": 5
}
```

#### 5. Delete Notification
**DELETE** `/api/notifications/:id`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

#### 6. Delete All Read Notifications
**DELETE** `/api/notifications/read/all`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "All read notifications deleted",
  "deletedCount": 5
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Task/Notification not found"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Task title is required"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to create task"
}
```

---

## Usage Examples

### Create a Task and Get Notifications

```javascript
// Create task
const taskResponse = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'Complete project review',
    description: 'Review all recent commits',
    dueDate: '2025-12-01',
    priority: 'high'
  })
});

// Get unread notifications
const notifResponse = await fetch('/api/notifications?read=false', {
  credentials: 'include'
});

// Mark all as read
const markResponse = await fetch('/api/notifications/mark-all/read', {
  method: 'PUT',
  credentials: 'include'
});
```

---

## Implementation Notes

1. **Authentication:** All endpoints require a valid access token (passed via httpOnly cookie).
2. **Ownership:** Users can only access/modify their own tasks and notifications.
3. **Timestamps:** All dates use ISO 8601 format.
4. **Pagination:** Notifications support pagination for better performance.
5. **TTL:** Read notifications are automatically deleted after 30 days.
6. **Notifications:** Created automatically when tasks are created or status changes.

