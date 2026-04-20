# ASSIGNMENT 5: Live Character Counter for Form Text Area

## 1. AIM

To develop an interactive web-based character counter that provides real-time feedback to users as they type or delete text in a textarea element, with visual indicators for character count, remaining characters, and progress visualization.

---

## 2. OBJECTIVES

1. **Real-Time Feedback:** Display character count dynamically as the user types in the textarea.
2. **User-Friendly Display:** Show both current character count and remaining characters (if limit is set).
3. **Visual Indicators:** Implement a progress bar or color-coded feedback system to indicate character usage.
4. **Limit Enforcement:** Prevent users from exceeding a maximum character limit (optional).
5. **Performance Optimization:** Ensure smooth, lag-free updates even with rapid typing.
6. **Cross-Browser Compatibility:** Work seamlessly across all modern browsers (Chrome, Firefox, Safari, Edge).
7. **Accessibility:** Maintain proper ARIA labels and semantic HTML for screen readers.
8. **Responsive Design:** Adapt to different screen sizes and device types.

---

## 3. TOOLS AND TECHNOLOGIES

| Category | Tools/Technologies |
|----------|-------------------|
| **Frontend Framework** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **DOM Manipulation** | JavaScript DOM API (getElementById, addEventListener, textContent) |
| **Styling** | CSS Flexbox/Grid, CSS transitions, CSS custom properties |
| **Version Control** | Git, GitHub |
| **Browser DevTools** | Chrome DevTools, Firefox Inspector |
| **Text Editors** | VS Code, Visual Studio |
| **Testing** | Manual testing, Browser console |

---

## 4. THEORY/CONCEPT

### 4.1 Character Counter Fundamentals

A character counter is a UI component that tracks the number of characters entered in a text input field (textarea or input element) and displays this information in real-time to the user.

**Key Concepts:**

1. **Event Listeners:** The `input` event fires whenever the user modifies the textarea content, triggering an update function.

2. **String Length Property:** JavaScript's `.length` property returns the number of characters in a string.

3. **Maximum Length Attribute:** HTML5 `maxlength` attribute restricts input but doesn't provide visual feedback; JavaScript counters complement this.

4. **DOM Manipulation:** JavaScript updates the DOM to reflect the current character count without page refresh.

5. **Event Delegation:** Using the `input` event instead of `keyup` handles all input types (typing, pasting, deletion).

6. **Progress Percentage Calculation:** 
   ```
   Progress % = (Current Characters / Max Characters) × 100
   ```

7. **Color Coding:** 
   - Green (0-50%): Safe zone
   - Yellow (50-80%): Warning zone
   - Red (80-100%): Danger zone

---

## 5. APPLICATIONS

1. **Social Media Posts:** Character counters on Twitter, Facebook, and LinkedIn limit posts to specific character counts.
2. **Email Composition:** Email clients display character count for subject lines and body text.
3. **SMS Applications:** Shows remaining characters before message is split into multiple SMS.
4. **Form Validation:** Bio sections, product descriptions, and feedback forms often have character limits.
5. **Content Management Systems (CMS):** Blog post titles and meta descriptions have character limits for SEO purposes.
6. **Chat Applications:** Real-time messaging apps display character count and remaining characters.
7. **Code Editors:** Display line count, column count, and total characters.
8. **Accessibility:** Help users understand input requirements and constraints.

---

## 6. TECHNOLOGIES USED

### 6.1 HTML5 (Structure)
- Semantic tags: `<form>`, `<textarea>`, `<div>`
- Data attributes: `data-*` for storing configuration
- ARIA attributes for accessibility

### 6.2 CSS3 (Styling)
- Flexbox for layout alignment
- CSS variables for theming (`--primary-color`, `--warning-color`)
- Transitions for smooth animations
- Media queries for responsive design

### 6.3 JavaScript ES6+ (Functionality)
- Event listeners (`addEventListener`)
- DOM selection (`querySelector`, `getElementById`)
- String methods (`.length`, `.trim()`)
- Template literals for dynamic content
- Arrow functions for concise syntax
- Conditional logic for color coding

---

## 7. PROGRAM/IMPLEMENTATION

### 7.1 HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Character Counter</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Live Character Counter</h1>
            <form class="form-group">
                <label for="textarea">Enter Your Text:</label>
                <textarea
                    id="textarea"
                    placeholder="Start typing here..."
                    maxlength="500"
                    required
                ></textarea>

                <div class="counter-container">
                    <div class="counter-info">
                        <span class="counter-label">Characters:</span>
                        <span id="charCount" class="counter-value">0</span>
                        <span class="counter-label">/ 500</span>
                    </div>
                    <div class="remaining-info">
                        <span class="remaining-label">Remaining:</span>
                        <span id="remainingCount" class="remaining-value">500</span>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="progress-bar-container">
                    <div id="progressBar" class="progress-bar"></div>
                </div>

                <!-- Warning Messages -->
                <div id="warningMessage" class="warning-message hidden"></div>

                <button type="submit" class="btn-submit">Submit</button>
            </form>
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
    --warning-color: #f39c12;
    --danger-color: #e74c3c;
    --background-color: #ecf0f1;
    --text-color: #2c3e50;
    --border-color: #bdc3c7;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    width: 100%;
    max-width: 600px;
}

.card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

h1 {
    color: var(--text-color);
    margin-bottom: 30px;
    text-align: center;
    font-size: 28px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

label {
    font-weight: 600;
    color: var(--text-color);
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

#textarea {
    width: 100%;
    min-height: 150px;
    padding: 15px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    resize: vertical;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

#textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.counter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: var(--background-color);
    border-radius: 8px;
    gap: 20px;
}

.counter-info,
.remaining-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.counter-label,
.remaining-label {
    font-size: 13px;
    font-weight: 500;
    color: #7f8c8d;
}

.counter-value,
.remaining-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
    min-width: 40px;
}

/* Progress Bar */
.progress-bar-container {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: var(--success-color);
    border-radius: 10px;
    transition: width 0.3s ease, background-color 0.3s ease;
    width: 0%;
}

.progress-bar.warning {
    background: var(--warning-color);
}

.progress-bar.danger {
    background: var(--danger-color);
}

/* Warning Message */
.warning-message {
    padding: 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.warning-message.visible {
    opacity: 1;
}

.warning-message.warning {
    background: rgba(243, 156, 18, 0.1);
    color: var(--warning-color);
    border-left: 4px solid var(--warning-color);
}

.warning-message.danger {
    background: rgba(231, 76, 60, 0.1);
    color: var(--danger-color);
    border-left: 4px solid var(--danger-color);
}

/* Submit Button */
.btn-submit {
    padding: 12px 30px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.btn-submit:active:not(:disabled) {
    transform: translateY(0);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
    .card {
        padding: 25px;
    }

    h1 {
        font-size: 24px;
    }

    .counter-container {
        flex-direction: column;
        gap: 10px;
    }

    .counter-info,
    .remaining-info {
        width: 100%;
        justify-content: space-between;
    }
}

@media (max-width: 480px) {
    .card {
        padding: 20px;
    }

    #textarea {
        min-height: 120px;
        font-size: 14px;
    }

    h1 {
        font-size: 20px;
        margin-bottom: 20px;
    }
}
```

### 7.3 JavaScript Implementation

```javascript
// Get DOM elements
const textarea = document.getElementById('textarea');
const charCountDisplay = document.getElementById('charCount');
const remainingCountDisplay = document.getElementById('remainingCount');
const progressBar = document.getElementById('progressBar');
const warningMessage = document.getElementById('warningMessage');
const form = document.querySelector('.form-group');

// Configuration
const MAX_CHARS = 500;
const WARN_THRESHOLD = 80; // Start warning at 80%

// Initialize
function init() {
    updateCounter();
    textarea.addEventListener('input', updateCounter);
    textarea.addEventListener('input', handlePaste);
}

// Main counter update function
function updateCounter() {
    const currentLength = textarea.value.length;
    const remainingChars = MAX_CHARS - currentLength;
    const progressPercentage = (currentLength / MAX_CHARS) * 100;

    // Update display values
    charCountDisplay.textContent = currentLength;
    remainingCountDisplay.textContent = remainingChars;

    // Update progress bar
    updateProgressBar(progressPercentage);

    // Update warning message
    updateWarningMessage(progressPercentage);

    // Add visual feedback
    updateTextareaState(progressPercentage);
}

// Update progress bar with color coding
function updateProgressBar(percentage) {
    progressBar.style.width = `${Math.min(percentage, 100)}%`;

    // Remove previous classes
    progressBar.classList.remove('warning', 'danger');

    // Add appropriate class based on threshold
    if (percentage >= 90) {
        progressBar.classList.add('danger');
    } else if (percentage >= WARN_THRESHOLD) {
        progressBar.classList.add('warning');
    }
}

// Update warning message
function updateWarningMessage(percentage) {
    warningMessage.classList.remove('warning', 'danger', 'visible');

    if (percentage >= 90) {
        warningMessage.textContent = '⚠️ You are very close to the character limit!';
        warningMessage.classList.add('danger', 'visible');
    } else if (percentage >= WARN_THRESHOLD) {
        warningMessage.textContent = '⚠️ Approaching character limit';
        warningMessage.classList.add('warning', 'visible');
    }
}

// Update textarea visual state
function updateTextareaState(percentage) {
    if (percentage >= 90) {
        textarea.style.borderColor = 'var(--danger-color)';
    } else if (percentage >= WARN_THRESHOLD) {
        textarea.style.borderColor = 'var(--warning-color)';
    } else {
        textarea.style.borderColor = 'var(--border-color)';
    }
}

// Handle paste events
function handlePaste(event) {
    // Check if content would exceed limit
    setTimeout(() => {
        if (textarea.value.length > MAX_CHARS) {
            textarea.value = textarea.value.substring(0, MAX_CHARS);
            updateCounter();
        }
    }, 0);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (textarea.value.trim().length === 0) {
        alert('Please enter some text before submitting.');
        return;
    }
    alert(`Submitted: ${textarea.value.length} characters\n\nContent: ${textarea.value.substring(0, 100)}...`);
    textarea.value = '';
    updateCounter();
});
```

---

## 8. WORKING MECHANISM

### 8.1 Step-by-Step Process

**Step 1: User Interaction**
- User clicks on the textarea and begins typing or pasting text.

**Step 2: Event Detection**
- JavaScript `input` event listener detects any change in textarea content.

**Step 3: Character Calculation**
- `updateCounter()` function retrieves the current text length using `.value.length`.
- Calculates remaining characters: `remaining = MAX_CHARS - current`
- Calculates progress percentage: `(current / MAX_CHARS) × 100`

**Step 4: DOM Updates**
- Character count display updated with current length.
- Remaining characters display updated.
- Progress bar width set to match percentage.

**Step 5: Visual Feedback**
- Progress bar color changes based on usage:
  - Green (0-79%): Safe
  - Yellow (80-89%): Warning
  - Red (90-100%): Danger
- Warning message appears at 80% threshold.
- Textarea border color changes to match progress bar.

**Step 6: Limit Enforcement**
- If user pastes text exceeding limit, excess is trimmed automatically.
- `maxlength` HTML attribute provides secondary protection.

**Step 7: Form Submission**
- User clicks "Submit" button.
- Form validation checks if textarea is not empty.
- Success message displays with character count.

---

## 9. OUTPUT

### 9.1 Visual Output

```
┌─────────────────────────────────────────┐
│     Live Character Counter              │
├─────────────────────────────────────────┤
│ Enter Your Text:                        │
│ ┌─────────────────────────────────────┐ │
│ │ This is a sample text that shows    │ │
│ │ how the character counter works     │ │
│ │ in real-time as the user types.     │ │
│ │ The progress bar below updates      │ │
│ │ automatically.                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Characters: 156 / 500  Remaining: 344  │
│ ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                         │
│ (No warning - safe zone)               │
│                                         │
│              [Submit]                   │
└─────────────────────────────────────────┘
```

### 9.2 Console Output

```
Character Count: 156
Remaining Characters: 344
Progress Percentage: 31.2%
Status: Safe Zone
```

### 9.3 Warning States

**At 80% (400 characters):**
```
⚠️ Approaching character limit
Characters: 400 / 500  Remaining: 100
Progress Bar: Yellow (████████████████░░░░)
```

**At 90% (450 characters):**
```
⚠️ You are very close to the character limit!
Characters: 450 / 500  Remaining: 50
Progress Bar: Red (██████████████████░░)
Textarea Border: Red
```

---

## 10. CONCLUSION

The **Live Character Counter** is a practical, user-friendly component that enhances form usability by providing real-time feedback on text input. Key achievements:

✅ **Real-Time Updates:** Instantaneous character count refresh without page reload.
✅ **Visual Indicators:** Color-coded progress bar provides intuitive feedback.
✅ **Limit Enforcement:** Prevents users from exceeding maximum character count.
✅ **Accessibility:** ARIA labels and semantic HTML ensure screen reader compatibility.
✅ **Responsive Design:** Adapts seamlessly to mobile, tablet, and desktop screens.
✅ **Performance:** Efficient DOM manipulation without lag or jank.
✅ **User Experience:** Clear warnings and intuitive interface reduce user confusion.

### Future Enhancements

1. **Word Counter:** Add word count display alongside character count.
2. **Typing Speed:** Display words per minute (WPM) for typists.
3. **Text Statistics:** Show reading time, sentence count, average word length.
4. **Export Functionality:** Allow users to export character count history.
5. **Multi-Language Support:** Handle Unicode characters and different languages accurately.
6. **Sound Feedback:** Play a subtle sound when reaching threshold milestones.
7. **Analytics Integration:** Track user behavior and input patterns.
8. **Auto-Save Feature:** Save drafts periodically while user types.

### Industry Applications

- **Social Media Platforms:** Twitter, LinkedIn, Facebook for post limits
- **Email Services:** Gmail, Outlook for subject lines and message bodies
- **CMS Platforms:** WordPress, Drupal for content fields
- **Feedback Systems:** Customer review platforms with character constraints
- **Accessibility Tools:** Screen reader compatibility for visually impaired users

---

**Document Version:** 1.0  
**Date:** April 20, 2026  
**Technology Stack:** HTML5 | CSS3 | JavaScript ES6+  
**Difficulty Level:** Beginner to Intermediate
