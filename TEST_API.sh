#!/bin/bash

# API Testing Script for Tasks & Notifications
# Note: Replace AUTH_TOKEN with your actual access token
# Set API_URL to your backend URL (default: http://localhost:5000/api)

API_URL="http://localhost:5000/api"
AUTH_TOKEN="your-access-token-here"

echo "=========================================="
echo "Tasks & Notifications API Testing"
echo "=========================================="

# ========== TASK TESTS ==========
echo ""
echo "--- TASK OPERATIONS ---"
echo ""

# 1. Create a new task
echo "1️⃣ Creating a new task..."
curl -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" \
  -d '{
    "title": "Fix login bug",
    "description": "Resolve 401 error on refresh token",
    "dueDate": "2025-12-01T00:00:00Z",
    "priority": "high",
    "tags": ["bug", "auth"]
  }' | jq .
echo ""

# Store the task ID from the response above
TASK_ID="507f1f77bcf86cd799439011"  # Replace with actual ID

# 2. Get all tasks
echo "2️⃣ Fetching all tasks..."
curl -X GET "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 3. Get tasks with filters
echo "3️⃣ Fetching pending tasks with high priority..."
curl -X GET "$API_URL/tasks?status=pending&priority=high&sortBy=dueDate" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 4. Get single task
echo "4️⃣ Fetching single task by ID..."
curl -X GET "$API_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 5. Update task
echo "5️⃣ Updating task status to in-progress..."
curl -X PUT "$API_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" \
  -d '{
    "status": "in-progress",
    "priority": "high"
  }' | jq .
echo ""

# 6. Complete task
echo "6️⃣ Marking task as completed..."
curl -X PUT "$API_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" \
  -d '{
    "status": "completed"
  }' | jq .
echo ""

# 7. Get task statistics
echo "7️⃣ Fetching task statistics..."
curl -X GET "$API_URL/tasks/stats/summary" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# ========== NOTIFICATION TESTS ==========
echo ""
echo "--- NOTIFICATION OPERATIONS ---"
echo ""

# 8. Get all notifications
echo "8️⃣ Fetching all notifications..."
curl -X GET "$API_URL/notifications" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 9. Get unread notifications only
echo "9️⃣ Fetching unread notifications..."
curl -X GET "$API_URL/notifications?read=false&limit=5&page=1" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# Store the notification ID from the response above
NOTIFICATION_ID="507f1f77bcf86cd799439020"  # Replace with actual ID

# 10. Get unread count
echo "🔟 Getting unread notification count..."
curl -X GET "$API_URL/notifications/unread/count" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 11. Mark notification as read
echo "1️⃣1️⃣ Marking notification as read..."
curl -X PUT "$API_URL/notifications/$NOTIFICATION_ID/read" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 12. Mark all as read
echo "1️⃣2️⃣ Marking all notifications as read..."
curl -X PUT "$API_URL/notifications/mark-all/read" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# ========== CLEANUP TESTS ==========
echo ""
echo "--- CLEANUP OPERATIONS ---"
echo ""

# 13. Delete notification
echo "1️⃣3️⃣ Deleting a notification..."
curl -X DELETE "$API_URL/notifications/$NOTIFICATION_ID" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 14. Delete all read notifications
echo "1️⃣4️⃣ Deleting all read notifications..."
curl -X DELETE "$API_URL/notifications/read/all" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

# 15. Delete task
echo "1️⃣5️⃣ Deleting a task (cascades to notifications)..."
curl -X DELETE "$API_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -b "accessToken=$AUTH_TOKEN" | jq .
echo ""

echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
