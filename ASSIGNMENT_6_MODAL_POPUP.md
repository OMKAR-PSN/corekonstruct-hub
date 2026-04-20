# ASSIGNMENT 6: Modal Popup with Click-Outside and Close Icon

## 1. AIM

To develop an interactive modal dialog component that appears on button click and can be dismissed by clicking outside the modal, pressing the Escape key, or clicking a close icon, with smooth animations and accessibility features.

---

## 2. OBJECTIVES

1. **Modal Trigger:** Display modal window on button click event.
2. **Close Functionality:** Implement multiple close methods (close icon, outside click, Escape key).
3. **Event Handling:** Properly manage event propagation to prevent unintended closures.
4. **Smooth Animations:** Implement fade-in/fade-out effects for professional appearance.
5. **Overlay Backdrop:** Add semi-transparent overlay to dim background content.
6. **Focus Management:** Trap focus within modal for keyboard navigation accessibility.
7. **Responsive Design:** Ensure modal adapts to different screen sizes.
8. **Accessibility:** Implement ARIA roles, focus management, and semantic HTML.
9. **Performance:** Efficient DOM manipulation without memory leaks.
10. **Cross-Browser Support:** Work across all modern browsers with graceful fallbacks.

---

## 3. TOOLS AND TECHNOLOGIES

| Category | Tools/Technologies |
|----------|-------------------|
| **Markup** | HTML5, Semantic HTML, ARIA attributes |
| **Styling** | CSS3, CSS animations, CSS Grid/Flexbox |
| **Scripting** | Vanilla JavaScript ES6+, Event delegation |
| **Animation** | CSS transitions, CSS keyframes, transform properties |
| **Accessibility** | WCAG 2.1 guidelines, ARIA live regions |
| **Development** | VS Code, Chrome DevTools, Lighthouse |
| **Version Control** | Git, GitHub |
| **Testing** | Manual testing, keyboard navigation testing |

---

## 4. THEORY/CONCEPT

### 4.1 Modal Dialog Concepts

A **modal dialog** is a window that overlays the main content and requires user interaction before returning to the primary application flow. It is "modal" because it blocks interaction with the rest of the page until dismissed.

**Key Concepts:**

1. **Event Listeners:**
   - `click` event on trigger button
   - `click` event on close button
   - `click` event on backdrop overlay
   - `keydown` event for Escape key handling

2. **Event Delegation:** Use event.target to identify which element was clicked.

3. **Event Propagation:**
   - **Event Bubbling:** Events propagate from child to parent
   - **Event Capturing:** Events propagate from parent to child
   - **stopPropagation():** Prevents bubbling to parent elements

4. **DOM Classes Manipulation:**
   - `.classList.add()` to show modal
   - `.classList.remove()` to hide modal
   - `.classList.toggle()` for toggling states

5. **CSS Visibility vs Display:**
   - `display: none/block` affects layout flow
   - `opacity` and `visibility` only affect rendering

6. **Overlay (Backdrop):**
   - Semi-transparent layer behind modal
   - Prevents interaction with background content
   - Dismisses modal on click (in UX pattern)

7. **Focus Trap:**
   - Keyboard Tab key cycles only within modal
   - Prevents focus from reaching background elements

8. **Z-index Stacking:**
   - Modal positioned above overlay
   - Overlay positioned above main content

---

## 5. APPLICATIONS

1. **Confirmation Dialogs:** Delete confirmation, logout confirmation.
2. **Forms & Surveys:** Newsletter signup, contact forms in modal.
3. **Image Galleries:** Lightbox view for image enlargement.
4. **Alert/Notification System:** Important announcements and warnings.
5. **Authentication:** Login/signup forms in modal popups.
6. **Video Players:** Video embeds in modal overlay.
7. **Terms & Conditions:** Accept/decline terms in modal.
8. **Settings Panels:** Configuration options in modal dialog.
9. **E-commerce:** Product detail view, checkout steps.
10. **Information Display:** Help tooltips, instructional guides.

---

## 6. TECHNOLOGIES USED

### 6.1 HTML5 (Structure)
- Semantic `<dialog>` element (or `<div>` with role="dialog")
- ARIA attributes: `aria-modal`, `aria-labelledby`, `aria-hidden`
- Data attributes for configuration

### 6.2 CSS3 (Styling & Animation)
- `position: fixed` for overlay and modal positioning
- `z-index` for stacking context
- `opacity` and `visibility` for fade effects
- CSS transitions for smooth animations
- CSS Grid/Flexbox for layout
- Media queries for responsive behavior

### 6.3 JavaScript ES6+ (Functionality)
- Event listeners for click, keyboard, and window events
- DOM manipulation (createElement, appendChild, remove)
- Template literals for dynamic content
- Arrow functions and spread operators
- try-catch for error handling

---

## 7. PROGRAM/IMPLEMENTATION

### 7.1 HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modal Popup Example</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Main Content -->
    <div class="main-content">
        <div class="container">
            <h1>Modal Popup Demonstration</h1>
            <p>Click the buttons below to open different modal dialogs.</p>

            <div class="button-group">
                <button id="openModal1" class="btn btn-primary">
                    Open Simple Modal
                </button>
                <button id="openModal2" class="btn btn-success">
                    Open Confirmation Modal
                </button>
                <button id="openModal3" class="btn btn-info">
                    Open Form Modal
                </button>
            </div>
        </div>
    </div>

    <!-- Modal 1: Simple Modal -->
    <div id="modal1" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal1Title">
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal1Title">Welcome to Modal 1</h2>
                <button class="close-btn" aria-label="Close modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>This is a simple modal dialog. You can close it by:</p>
                <ul>
                    <li>Clicking the <strong>✕ close button</strong> in the top-right corner</li>
                    <li>Clicking <strong>outside the modal</strong> on the overlay</li>
                    <li>Pressing the <strong>Escape key</strong></li>
                </ul>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Close</button>
            </div>
        </div>
    </div>

    <!-- Modal 2: Confirmation Modal -->
    <div id="modal2" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal2Title">
        <div class="modal-overlay"></div>
        <div class="modal-content modal-confirmation">
            <div class="modal-header">
                <h2 id="modal2Title">⚠️ Confirmation</h2>
                <button class="close-btn" aria-label="Close modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this item?</p>
                <p style="color: #7f8c8d; font-size: 14px; margin-top: 10px;">
                    This action cannot be undone.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-danger" onclick="alert('Deleted!'); closeAllModals();">Delete</button>
            </div>
        </div>
    </div>

    <!-- Modal 3: Form Modal -->
    <div id="modal3" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal3Title">
        <div class="modal-overlay"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2 id="modal3Title">📝 Newsletter Signup</h2>
                <button class="close-btn" aria-label="Close modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="signupForm">
                    <div class="form-group">
                        <label for="fullName">Full Name:</label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="John Doe"
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="john@example.com"
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label for="frequency">Update Frequency:</label>
                        <select id="frequency" required>
                            <option value="">Select frequency</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>
                    </div>
                    <div class="form-group checkbox">
                        <input type="checkbox" id="agree" required>
                        <label for="agree">I agree to receive newsletters</label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary" onclick="submitForm();">Subscribe</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### 7.2 CSS Styling

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #3498db;
    --success-color: #2ecc71;
    --danger-color: #e74c3c;
    --info-color: #9b59b6;
    --secondary-color: #95a5a6;
    --text-color: #2c3e50;
    --border-color: #bdc3c7;
    --modal-bg: #ffffff;
    --overlay-bg: rgba(0, 0, 0, 0.5);
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: var(--text-color);
}

/* Main Content */
.main-content {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: white;
    border-radius: 12px;
    padding: 40px;
    max-width: 600px;
    width: 100%;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h1 {
    color: var(--primary-color);
    margin-bottom: 15px;
    font-size: 32px;
}

.container > p {
    color: #7f8c8d;
    margin-bottom: 30px;
    font-size: 16px;
}

/* Button Styles */
.button-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.btn-success {
    background: var(--success-color);
    color: white;
}

.btn-success:hover {
    background: #27ae60;
    transform: translateY(-2px);
}

.btn-info {
    background: var(--info-color);
    color: white;
}

.btn-info:hover {
    background: #8e44ad;
    transform: translateY(-2px);
}

.btn-secondary {
    background: var(--secondary-color);
    color: white;
}

.btn-secondary:hover {
    background: #7f8c8d;
}

.btn-danger {
    background: var(--danger-color);
    color: white;
}

.btn-danger:hover {
    background: #c0392b;
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1000;
}

.modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--overlay-bg);
    cursor: pointer;
}

.modal-content {
    position: relative;
    background: var(--modal-bg);
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
}

.modal-content.modal-large {
    max-width: 600px;
}

.modal-content.modal-confirmation {
    max-width: 400px;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
    margin: 0;
    color: var(--text-color);
    font-size: 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #7f8c8d;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: var(--text-color);
}

.modal-body {
    padding: 20px;
    max-height: calc(85vh - 120px);
    overflow-y: auto;
}

.modal-body p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 10px;
}

.modal-body ul {
    margin-left: 20px;
    color: #555;
}

.modal-body li {
    margin-bottom: 8px;
    line-height: 1.6;
}

/* Form Styles */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-color);
    font-size: 14px;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="email"]:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group.checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.form-group.checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.form-group.checkbox label {
    margin-bottom: 0;
}

.modal-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 20px;
    border-top: 1px solid var(--border-color);
    background: #f8f9fa;
    border-radius: 0 0 12px 12px;
}

.modal-footer .btn {
    padding: 10px 20px;
    font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 30px 20px;
    }

    h1 {
        font-size: 24px;
    }

    .button-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }

    .modal-content {
        max-width: 95%;
    }

    .modal-footer {
        flex-direction: column-reverse;
    }

    .modal-footer .btn {
        width: 100%;
    }
}

/* Scrollbar Styling */
.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #bdc3c7;
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #95a5a6;
}
```

### 7.3 JavaScript Implementation

```javascript
// Modal Manager Class
class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.activeModal = null;
        this.init();
    }

    init() {
        // Initialize modal triggers
        document.getElementById('openModal1').addEventListener('click', () => this.openModal('modal1'));
        document.getElementById('openModal2').addEventListener('click', () => this.openModal('modal2'));
        document.getElementById('openModal3').addEventListener('click', () => this.openModal('modal3'));

        // Initialize close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.closest('.modal')));
        });

        // Initialize close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.closest('.modal')));
        });

        // Initialize overlay clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Prevent modal content clicks from closing modal
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => e.stopPropagation());
        });

        // Initialize keyboard events
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Close other modals
        this.closeAllModals();

        // Add active class
        modal.classList.add('active');
        this.activeModal = modal;

        // Disable body scroll
        document.body.style.overflow = 'hidden';

        // Set focus to modal
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        console.log(`Modal ${modalId} opened`);
    }

    closeModal(modal) {
        if (!modal || !modal.classList.contains('modal')) return;

        modal.classList.remove('active');
        this.activeModal = null;

        // Re-enable body scroll
        document.body.style.overflow = 'auto';

        console.log(`Modal closed`);
    }

    closeAllModals() {
        this.modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
        this.activeModal = null;
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.activeModal) {
            this.closeModal(this.activeModal);
        }
    }
}

// Global functions for form handling
function submitForm() {
    const form = document.getElementById('signupForm');
    if (form.checkValidity()) {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        alert(`Thank you ${fullName}! Subscribed with ${email}`);
        form.reset();
        closeAllModals();
    } else {
        alert('Please fill in all required fields');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ModalManager();
});
```

---

## 8. WORKING MECHANISM

### 8.1 Detailed Process Flow

**Phase 1: Initialization**
1. ModalManager class instantiated on DOM content loaded
2. All modals, buttons, and event listeners registered
3. Modal elements hidden by default (opacity: 0, visibility: hidden)

**Phase 2: Opening Modal**
1. User clicks trigger button (e.g., "Open Simple Modal")
2. Event listener detects click, calls `openModal(modalId)`
3. Modal element assigned `active` class
4. CSS transitions apply: opacity → 1, visibility → visible
5. Background scroll disabled: `document.body.overflow = 'hidden'`
6. Focus moves to first focusable element in modal

**Phase 3: User Interaction Inside Modal**
- User reads content or interacts with form
- Event propagation stops at modal-content (stopPropagation)
- Overlay clicks don't close modal due to event stopping

**Phase 4: Closing Modal - Multiple Methods**

**Method A: Close Button Click**
- User clicks ✕ close button
- Click event bubbles to close-btn listener
- `closeModal()` called with modal reference
- `active` class removed

**Method B: Overlay Click**
- User clicks semi-transparent overlay
- Modal overlay click listener triggers
- Event target identified as overlay
- `closeModal()` called

**Method C: Escape Key**
- User presses Escape key
- Keyboard event listener detects keydown
- If `activeModal` exists, `closeModal()` called
- Modal dismissed

**Method D: Action Buttons**
- User clicks Delete/Subscribe/Cancel button
- Button click handler closes modal via `closeAllModals()`
- Form data processed or discarded

**Phase 5: Closing Modal - Cleanup**
1. Modal element loses `active` class
2. CSS transitions apply: opacity → 0, visibility → hidden
3. Modal removed from view with animation
4. Body scroll re-enabled: `document.body.overflow = 'auto'`
5. Focus returns to trigger button (optional enhancement)

---

## 9. OUTPUT

### 9.1 Visual Output - Modal Stages

**Stage 1: Initial State (Modal Closed)**
```
┌────────────────────────────────┐
│   Modal Popup Demonstration    │
│                                │
│   [Open Simple Modal]          │
│   [Open Confirmation Modal]    │
│   [Open Form Modal]            │
└────────────────────────────────┘
```

**Stage 2: Simple Modal Open**
```
┌─────────────────────────────────────────────┐
│ ██████████████████████████████████░░░░░░░░░ │  ← Overlay (semi-transparent)
│ │  ╔═════════════════════════════════╗    │ │
│ │  ║ Welcome to Modal 1          ✕  ║    │ │
│ │  ║────────────────────────────────║    │ │
│ │  ║ This is a simple modal dialog. ║    │ │
│ │  ║ You can close it by:           ║    │ │
│ │  ║                                ║    │ │
│ │  ║ • Clicking the ✕ close button ║    │ │
│ │  ║ • Clicking outside the modal  ║    │ │
│ │  ║ • Pressing the Escape key     ║    │ │
│ │  ║────────────────────────────────║    │ │
│ │  ║              [Close]           ║    │ │
│ │  ╚═════════════════════════════════╝    │ │
│ └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Stage 3: Confirmation Modal Open**
```
┌──────────────────────────────┐
│ │  ╔════════════════════╗  │ │
│ │  ║ ⚠️ Confirmation ✕ ║  │ │
│ │  ║══════════════════║  │ │
│ │  ║ Are you sure you ║  │ │
│ │  ║ want to delete   ║  │ │
│ │  ║ this item?       ║  │ │
│ │  ║══════════════════║  │ │
│ │  ║ [Cancel] [Delete]║  │ │
│ │  ╚════════════════════╝  │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Stage 4: Form Modal Open**
```
┌─────────────────────────────────┐
│ │  ╔═══════════════════════╗   │ │
│ │  ║ 📝 Newsletter ✕      ║   │ │
│ │  ║═══════════════════════║   │ │
│ │  ║ Full Name:          ║   │ │
│ │  ║ [_______________]   ║   │ │
│ │  ║                     ║   │ │
│ │  ║ Email:              ║   │ │
│ │  ║ [_______________]   ║   │ │
│ │  ║                     ║   │ │
│ │  ║ Frequency:          ║   │ │
│ │  ║ [Select ▼]          ║   │ │
│ │  ║                     ║   │ │
│ │  ║ ☐ I agree to...    ║   │ │
│ │  ║═══════════════════════║   │ │
│ │  ║ [Cancel] [Subscribe] ║   │ │
│ │  ╚═══════════════════════╝   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 9.2 Console Output

```
Modal modal1 opened
Modal closed
Modal modal2 opened
Modal closed
Modal modal3 opened
Thank you John Doe! Subscribed with john@example.com
Modal closed
```

---

## 10. CONCLUSION

The **Modal Popup Component** successfully demonstrates advanced event handling, DOM manipulation, and user interface design. Key achievements:

✅ **Multiple Close Methods:** Users can close via button, overlay, or Escape key.
✅ **Smooth Animations:** CSS transitions provide professional appearance.
✅ **Accessibility:** ARIA roles, focus management, keyboard support.
✅ **Event Handling:** Proper event propagation control prevents bugs.
✅ **Responsive Design:** Adapts to mobile, tablet, and desktop screens.
✅ **Reusable Component:** ModalManager class can manage multiple modals.
✅ **User Experience:** Intuitive interface with clear close options.

### Advanced Features to Implement

1. **Focus Trap:** Cycle Tab key within modal only
2. **Nested Modals:** Stack multiple modals with independent close functionality
3. **Animations:** Different animation styles (slide, zoom, fade)
4. **Drag & Drop:** Allow users to reposition modal
5. **Callback Functions:** Execute code on modal open/close
6. **Confirmation Alerts:** Warn user before closing unsaved changes
7. **Size Variants:** Small, medium, large, fullscreen modals
8. **Content Loading:** Dynamic content via AJAX or fetch API
9. **Modal History:** Stack navigation for back button support
10. **Accessibility Enhancements:** Screen reader announcements, ARIA live regions

### Real-World Applications

- **SaaS Platforms:** Login/signup modals, account settings
- **E-commerce:** Product previews, checkout processes
- **Project Management:** Task creation, team collaboration dialogs
- **Analytics Dashboards:** Configuration dialogs, data drill-down
- **CMS Platforms:** Media library, content preview
- **Social Media:** Post creation, comment threads
- **Healthcare:** Patient information, appointment scheduling

---

**Document Version:** 1.0  
**Date:** April 20, 2026  
**Technology Stack:** HTML5 | CSS3 | JavaScript ES6+  
**Difficulty Level:** Intermediate  
**Lines of Code:** ~450 (HTML + CSS + JS)
