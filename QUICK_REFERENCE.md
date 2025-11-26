# Quick Reference - Marketing Agents & Accountants Feature

## What Was Added

### 🎯 Feature Overview
Admin dashboard now supports managing 3 user types (previously just Commercials):
1. **Commercials** - Existing feature (updated to use new password modal)
2. **Marketing Agents** - NEW
3. **Accountants** - NEW

### 📊 Data Flow for Each Operation

#### Add New User
```
User clicks "Add [Type] +" button
↓
Modal opens with empty form
↓
User fills name, surname, phone, address
↓
Form submits to POST /[type]s/
↓
Backend generates password and returns it
↓
Password displayed in modal with phone number
↓
User copies credentials and distributes to new employee
↓
Modal closes, list refreshes showing new user
```

#### Edit Existing User
```
User clicks Edit button on table row
↓
Modal opens with form pre-populated from selected user data
↓
User modifies any fields
↓
Form submits to PUT /[type]s/{id}
↓
Modal closes, list refreshes
↓
No password generated for updates (only for new users)
```

#### Delete User
```
User clicks Delete button
↓
Browser confirm() dialog appears
↓
If confirmed: DELETE /[type]s/{id}
↓
If not confirmed: operation cancelled
↓
List refreshes automatically
```

### 🔑 Key Code Locations

| Feature | Location | Line Range |
|---------|----------|-----------|
| State variables | Admin.jsx | ~250-280 |
| Marketer fetch | Admin.jsx | ~460-475 |
| Accountant fetch | Admin.jsx | ~476-490 |
| Marketer submit handler | Admin.jsx | ~821-860 |
| Accountant submit handler | Admin.jsx | ~877-915 |
| Delete handlers | Admin.jsx | ~920-945 |
| Sidebar tabs definition | Admin.jsx | ~857 |
| Marketer tab UI | Admin.jsx | 1602-1643 |
| Accountant tab UI | Admin.jsx | 1645-1686 |
| Marketer modal | Admin.jsx | 1705-1723 |
| Accountant modal | Admin.jsx | 1725-1743 |
| Password modal | Admin.jsx | 1797-1847 |

### 🎨 UI Navigation

**Sidebar has these tabs:**
- Dashboard (existing)
- Fournisseurs (existing)
- Commercials (existing)
- **Marketers** (new)
- **Accountants** (new)

Each tab shows a table with all users of that type plus Edit/Delete buttons.

### 🔐 Authentication

All API calls use:
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch(`${API_BASE_URL}/marketers/`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

The `apiFetch` utility function handles this automatically.

### 📱 Form Fields

All three user types (Commercials, Marketers, Accountants) use identical fields:
- **name** - First name
- **surname** - Last name
- **phone_number** - Contact phone
- **address** - Physical address

### ⚡ State Management

Each user type has parallel state:

**Marketers:**
- `marketers` - array of all marketers
- `marketerForm` - current form data
- `showAddMarketer` - modal visibility
- `marketerLoading` - async operation in progress
- `marketerMessage` - success/error message

**Accountants:**
- `accountants` - array of all accountants
- `accountantForm` - current form data
- `showAddAccountant` - modal visibility
- `accountantLoading` - async operation in progress
- `accountantMessage` - success/error message

**Shared:**
- `passwordModalType` - "commercial", "marketer", or "accountant"
- `userPhoneForPassword` - phone to display in password modal
- `tempPassword` - password to display in modal
- `showPasswordModal` - modal visibility

### 🔄 Update Pattern

To submit a form:
```javascript
const formData = new FormData(event.target);
const response = await apiFetch(
  marketerForm.marketer_id 
    ? `/marketers/${marketerForm.marketer_id}`
    : '/marketers/',
  {
    method: marketerForm.marketer_id ? 'PUT' : 'POST',
    body: JSON.stringify(marketerForm)
  }
);
```

### 🎁 Password Modal

**When it displays:**
- After successfully creating a new user (POST)
- Shows the temporary password from backend response
- Shows the phone number used to login
- NOT shown after edits (PUT) - only for new users

**What user sees:**
```
Identifiants du [Commercial/Marketer/Accountant]

Le [commercial/marketer/accountant] peut se connecter avec ces identifiants :

Téléphone: [phone number]
Mot de passe temporaire: [generated password] [Copy button]

⚠️ Ce mot de passe ne sera plus affiché après fermeture.

[J'ai copié le mot de passe] (Close button)
```

### ✅ Validation

- All form fields are required
- Submit button disabled during API call
- Loading text shows "Saving..." while waiting
- Success messages show in green with ✅
- Error messages show in red
- List auto-refreshes on success

### 🚀 To Test the Feature

1. **Create new marketer:**
   - Click "Marketers" tab
   - Click "Add Marketer +"
   - Fill form with: Name, Surname, Phone (10-15 digits), Address
   - Click "Add Marketer"
   - Copy password from modal
   - Marketer should appear in table

2. **Edit marketer:**
   - Click Edit button on any marketer row
   - Change any field
   - Click "Update Marketer"
   - Table updates with new data
   - No password modal appears

3. **Delete marketer:**
   - Click Delete button
   - Confirm in dialog
   - Marketer removed from table

4. **Same for Accountants** - identical workflow

5. **Password modal:**
   - Verify header says correct user type
   - Verify phone matches the account's phone
   - Try copy button
   - Close and reopen modal - password no longer shows (by design)

### 📞 API Endpoints Reference

```
GET    /marketers/        - Get all marketers
POST   /marketers/        - Create marketer (returns password)
PUT    /marketers/{id}    - Update marketer
DELETE /marketers/{id}    - Delete marketer

GET    /accountants/       - Get all accountants
POST   /accountants/       - Create accountant (returns password)
PUT    /accountants/{id}   - Update accountant
DELETE /accountants/{id}   - Delete accountant
```

### ⚙️ Configuration

**API Base URL:** `https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com`

**Language:** French (all labels and messages in French)

**Icons:** Uses lucide-react `Users` icon for Marketers and Accountants tabs

**Styling:** Tailwind CSS with neutral/emerald/blue color scheme (matches existing)
