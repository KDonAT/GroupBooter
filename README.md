# 👢 GroupBooter — One-Click Member Remover

GroupBooter is a lightweight browser-console helper for **Facebook-style group clones**
It injects a floating button that lets you remove members **one by one** with a single click or the **R** hotkey.  

 GroupBooter gives you **control and safety**:  
- Skips the header/toolbar menus.  
- Skips your own account ID (configurable).  
- Highlights the target row before removal.  
- Updates a live counter so you always know how many removals you’ve done.  

---

## ✨ Features
- Floating button: **“👢 GroupBooter — Removed: X”**  
- Hotkey support: press **R** to trigger removal.  
- Works on the **Members/People** tab.  
- No auto-scrolling — the UI naturally shifts names up.  
- Configurable ID exclusion to protect yourself.  

---

## 🚀 Usage
1. Open your group’s **Members** page.  
2. Open the browser **Developer Console** (`F12` → Console tab).  
3. Paste the [GroupBooter script](./GroupBooter.js) into the console and hit Enter.  
4. A floating button will appear in the bottom-right corner.  
5. Click the button or press **R** to remove the top-most visible member.  

---

## ⚙️ Configuration
Inside the script you can adjust:

```js
// Replace with your own account ID to ensure you are never removed
const YOUR_ID = 'YOUR_FACEBOOK_ID_HERE';

// Exact text label used in your clone’s menu
const REMOVE_LABEL = 'Remove member';

// Possible confirmation button labels
const CONFIRM_MATCH = [/^Remove member$/i, /confirm/i, /yes/i, /ok/i];

// Skip anything above this Y position (prevents clicking header menus)
const MIN_ROW_TOP_PX = 300;

