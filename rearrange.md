

---

## 📝 **Instruction Document for Copilot Agent: Convert CommonJS to ES Modules**

### 🎯 **Objective**

Convert the entire Node.js project from **CommonJS (`require` / `module.exports`)** to **ES Modules (`import` / `export`)**, while preserving existing functionality.
After each change, validate that the application is still working and fix any errors immediately.

---

## 🔧 **Conversion Process**

### **1️⃣ Project-Wide Setup**

1. **Open `package.json`** and add:

   ```json
   {
     "type": "module",
     ...
   }
   ```

   This enables ES Module support in Node.js.

2. Ensure Node.js version **>= 14**, preferably **>= 18**, since older versions have limited ESM support.

---

### **2️⃣ Convert Codebase File-by-File**

Perform conversion in **small batches** or **module-by-module** (e.g., routes, controllers, models) to avoid breaking the whole project.

#### For each file:

✅ **Step 1: Convert `require` → `import`**

* Default imports:

  ```javascript
  const express = require('express');
  ```

  ➝

  ```javascript
  import express from 'express';
  ```

* Relative imports:

  ```javascript
  const userController = require('../controllers/userController');
  ```

  ➝

  ```javascript
  import userController from '../controllers/userController.js';
  ```

  (**Add `.js` extension** for relative imports!)

* Named imports (if module exports multiple functions):

  ```javascript
  const { getUser, updateUser } = require('../controllers/userController');
  ```

  ➝

  ```javascript
  import { getUser, updateUser } from '../controllers/userController.js';
  ```

---

✅ **Step 2: Convert `module.exports` → `export`**

* Single export:

  ```javascript
  module.exports = router;
  ```

  ➝

  ```javascript
  export default router;
  ```

* Multiple exports:

  ```javascript
  module.exports = { func1, func2 };
  ```

  ➝

  ```javascript
  export { func1, func2 };
  ```

---

✅ **Step 3: Update dependent files**

* Update every file that imports this module to use `import/export` with `.js` extension.
* Ensure **import type (default/named) matches** the updated export.

---

### **3️⃣ Verification After Each Conversion**

After converting each file/module:

1. ✅ **Run the project** (`npm start` or `node server.js`).
2. ✅ **Check for runtime errors in terminal**.
3. ✅ **Manually test routes/APIs** (use Postman, browser, or frontend integration).
4. ✅ **If an error occurs**, read stack trace:

   * Check incorrect import type (`default` vs `named`).
   * Check missing `.js` extension in relative imports.
   * Check circular dependencies (convert carefully if present).

---

### **4️⃣ Migrate in Logical Order**

Convert in this order for safety:

1. **Utility/helper functions** (smallest impact).
2. **Middleware files.**
3. **Controllers.**
4. **Models.**
5. **Routes.**
6. **App entry file (e.g., `server.js` or `app.js`).**
7. **Configuration files (if any).**

---

### **5️⃣ Final Cleanup**

* Remove all remaining `require`/`module.exports`.

* Search project for:

  ```
  require(
  module.exports
  ```

  and replace if found.

* Confirm **no mixed CommonJS/ESM syntax remains**.

---

### **6️⃣ Final Testing**

* Run a **full regression test**:

  * Launch server.
  * Verify all API endpoints.
  * Ensure middleware/auth still works.
  * Check error-handling, logging, and any CLI scripts.

---

## 🚨 **Critical Rules**

* ❌ **Do NOT change logic or variable names.**
* ❌ **Do NOT modify API routes or signatures.**
* ✅ **After every small batch change, test the server.**
* ✅ **Stop if there’s an error, fix it before continuing.**
* ✅ **Maintain original folder structure and imports.**

---

