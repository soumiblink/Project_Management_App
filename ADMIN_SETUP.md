# 👑 Admin User Setup Guide

## Quick Method (Recommended)

### Step 1: Register Your Account
1. Start the application: `npm run dev`
2. Go to http://localhost:3000/register
3. Create your account with your email

### Step 2: Set as Admin
Run the automated script:

```bash
# Set specific email as admin
ADMIN_EMAIL=your-email@example.com npm run set-admin

# Or use default (admin@example.com)
npm run set-admin
```

**Done!** Your account is now an admin. Refresh the page to see admin features.

---

## Alternative Methods

### Method 1: Using MongoDB Shell (mongosh)

1. **Open MongoDB Shell:**
```bash
mongosh
```

2. **Switch to your database:**
```bash
use project-management-saas
```

3. **Set user as admin:**
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

4. **Verify the change:**
```javascript
db.users.findOne({ email: "your-email@example.com" }, { role: 1, email: 1 })
```

You should see:
```javascript
{
  _id: ObjectId("..."),
  email: "your-email@example.com",
  role: "admin"
}
```

### Method 2: Using MongoDB Compass (GUI)

1. **Open MongoDB Compass**
2. **Connect to:** `mongodb://localhost:27017`
3. **Select database:** `project-management-saas`
4. **Select collection:** `users`
5. **Find your user** by email
6. **Click Edit** (pencil icon)
7. **Add/Update field:**
   - Field: `role`
   - Value: `"admin"`
8. **Click Update**

### Method 3: Using MongoDB Atlas (Cloud)

1. **Go to** https://cloud.mongodb.com
2. **Navigate to** your cluster
3. **Click** "Browse Collections"
4. **Select** `project-management-saas` database
5. **Select** `users` collection
6. **Find your user** and click edit
7. **Add/Update** `role: "admin"`
8. **Save**

---

## Verification

After setting admin role, verify it works:

### 1. Check in Application
- Login to your account
- You should see admin-only features:
  - Delete projects button
  - Invite members option
  - Activity logs access
  - Analytics dashboard

### 2. Check in Database
```bash
mongosh
use project-management-saas
db.users.find({ role: "admin" })
```

### 3. Check via API
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: accessToken=YOUR_TOKEN"
```

Response should include:
```json
{
  "user": {
    "email": "your-email@example.com",
    "role": "admin"
  }
}
```

---

## Setting Multiple Admins

### Using the Script
```bash
# Set first admin
ADMIN_EMAIL=admin1@example.com npm run set-admin

# Set second admin
ADMIN_EMAIL=admin2@example.com npm run set-admin
```

### Using MongoDB Shell
```javascript
// Set multiple users as admin at once
db.users.updateMany(
  { 
    email: { 
      $in: [
        "admin1@example.com",
        "admin2@example.com",
        "admin3@example.com"
      ]
    }
  },
  { $set: { role: "admin" } }
)
```

---

## Troubleshooting

### Issue: "No user found"
**Solution:** Make sure you've registered the account first
```bash
# Check if user exists
mongosh
use project-management-saas
db.users.find({ email: "your-email@example.com" })
```

### Issue: Script doesn't work
**Solution:** Check your .env file has correct MONGODB_URI
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/project-management-saas"
```

### Issue: Changes don't reflect in app
**Solution:** 
1. Logout from the application
2. Clear browser cookies
3. Login again
4. Refresh the page

### Issue: MongoDB not running
**Solution:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

## Admin Permissions

Once set as admin, you can:

✅ **Projects:**
- Create any project
- Delete any project
- Archive any project
- View all projects

✅ **Members:**
- Invite members to any project
- Remove members from projects
- Assign roles (admin/member)
- View all users

✅ **Tasks:**
- Create tasks in any project
- Update any task
- Delete any task
- Assign tasks to anyone

✅ **System:**
- View activity logs
- Access analytics dashboard
- View all notifications
- Search all content

---

## Security Notes

⚠️ **Important:**
- Only set trusted users as admin
- Admin role has full system access
- Cannot be revoked from UI (must use database)
- First user should always be admin

🔒 **Best Practices:**
- Limit number of admins (2-3 max)
- Use strong passwords for admin accounts
- Enable 2FA if available
- Regularly audit admin actions in activity logs

---

## Removing Admin Role

If you need to demote an admin to member:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "member" } }
)
```

Or using the script:
```bash
# Modify scripts/set-admin.js to set role to "member"
# Then run:
ADMIN_EMAIL=user@example.com npm run set-admin
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Set admin | `ADMIN_EMAIL=email@example.com npm run set-admin` |
| Check admins | `mongosh` → `use project-management-saas` → `db.users.find({role:"admin"})` |
| Remove admin | Update `role` to `"member"` in database |
| Verify | Login and check for admin features |

---

**Need Help?** Check the logs or open an issue on GitHub.
