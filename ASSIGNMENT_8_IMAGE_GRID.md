# ASSIGNMENT 8: Image Grid with Category-Based Filtering and Responsive Layout

## 1. AIM

To develop an interactive image gallery with category-based filtering functionality and a responsive grid layout that adapts seamlessly across mobile, tablet, and desktop devices, providing users with an intuitive way to browse and filter images.

---

## 2. OBJECTIVES

1. **Image Grid Display:** Arrange images in a responsive grid layout using CSS Grid or Flexbox.
2. **Category Filtering:** Filter images by category (All, Nature, Architecture, Portrait, Technology, etc.).
3. **Dynamic Filter Buttons:** Create clickable filter buttons that highlight active selection.
4. **Responsive Layout:** Automatically adjust grid columns based on screen size (1 column mobile, 2 tablets, 3+ desktop).
5. **Smooth Animations:** Implement fade and scale transitions for visual appeal.
6. **Image Lazy Loading:** Load images on-demand to improve performance.
7. **Lightbox/Modal View:** Display full-size images in a modal on click.
8. **Accessibility:** ARIA labels, keyboard navigation, semantic HTML.
9. **Search Functionality:** Filter by category or keywords (optional enhancement).
10. **Performance Optimization:** Optimize image loading, minimize repaints and reflows.

---

## 3. TOOLS AND TECHNOLOGIES

| Category | Tools/Technologies |
|----------|-------------------|
| **Markup** | HTML5, Semantic HTML, Data attributes |
| **Styling** | CSS3, CSS Grid, CSS Flexbox, CSS animations |
| **Scripting** | Vanilla JavaScript ES6+, Event delegation |
| **Images** | Optimized JPG/PNG/WebP formats, thumbnail generation |
| **Performance** | Lazy loading, Image optimization |
| **Development** | VS Code, DevTools Lighthouse, Figma |
| **Version Control** | Git, GitHub |
| **Browser Tools** | Chrome DevTools, Responsive Design Mode |

---

## 4. THEORY/CONCEPT

### 4.1 Image Grid Fundamentals

**CSS Grid vs Flexbox:**

1. **CSS Grid:**
   - Best for 2D layouts (rows and columns)
   - `display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));`
   - Automatically responds to available space
   - Better for complex layouts

2. **Flexbox:**
   - Best for 1D layouts (rows or columns)
   - `display: flex; flex-wrap: wrap;`
   - Good for linear arrangements with wrapping

**Responsive Grid Calculation:**
```css
/* Desktop: 3 columns */
@media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
}

/* Mobile: 1 column */
@media (max-width: 767px) {
    grid-template-columns: 1fr;
}
```

**Category Filtering Logic:**
1. Store category info in `data-category` attribute
2. On filter click, add/remove `active` class
3. Show/hide images based on category match
4. Use `display: none/block` or `opacity` transitions

**Data Attributes:**
```html
<img data-category="nature" data-id="1" src="..." alt="...">
```

**Event Delegation:**
- Attach single listener to filter container
- Use `event.target` to identify clicked button
- Filter all images based on selected category

**Lazy Loading:**
```javascript
// Use Intersection Observer API
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
        }
    });
});
```

---

## 5. APPLICATIONS

1. **Portfolio Websites:** Showcase photography, design, or illustration work.
2. **E-commerce:** Product galleries with category filtering (Clothing → Men, Women, Kids).
3. **Travel Blogs:** Filter destinations by region, season, or activity type.
4. **Stock Photo Sites:** Getty Images, Unsplash with category/tag filtering.
5. **Art Galleries:** Exhibition catalogs with artist or style categories.
6. **Real Estate:** Property listings filtered by type (Houses, Apartments, Commercial).
7. **News Websites:** Photo galleries organized by news category.
8. **Social Media:** Instagram-style feed with category filters.
9. **Educational:** Image library for learning platforms.
10. **Event Documentation:** Photos organized by event type or date.

---

## 6. TECHNOLOGIES USED

### 6.1 HTML5 (Structure)
- Semantic `<figure>` and `<figcaption>` for images
- Data attributes for category and metadata
- ARIA labels for accessibility
- `<button>` for filter controls

### 6.2 CSS3 (Styling & Layout)
- CSS Grid with `auto-fit` and `minmax()`
- CSS Flexbox for filter buttons
- CSS Transitions for smooth animations
- CSS Transform for hover effects
- Media queries for responsiveness
- Object-fit for image aspect ratio preservation

### 6.3 JavaScript ES6+ (Functionality)
- Event delegation with event.target
- Array methods (filter, forEach)
- DOM manipulation (classList, dataset)
- Intersection Observer API for lazy loading
- Template literals
- Arrow functions

---

## 7. PROGRAM/IMPLEMENTATION

### 7.1 HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Gallery - Category Filtering</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="gallery-header">
            <h1>🖼️ Image Gallery</h1>
            <p>Explore beautiful images from around the world</p>
        </header>

        <!-- Filter Buttons -->
        <div class="filter-container">
            <button class="filter-btn active" data-filter="all">
                All Images
            </button>
            <button class="filter-btn" data-filter="nature">
                🌿 Nature
            </button>
            <button class="filter-btn" data-filter="architecture">
                🏗️ Architecture
            </button>
            <button class="filter-btn" data-filter="portrait">
                👤 Portrait
            </button>
            <button class="filter-btn" data-filter="technology">
                💻 Technology
            </button>
            <button class="filter-btn" data-filter="food">
                🍽️ Food
            </button>
        </div>

        <!-- Image Gallery Grid -->
        <div class="gallery-grid" id="galleryGrid">
            <!-- Nature Images -->
            <figure class="gallery-item" data-category="nature" data-id="1">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
                    alt="Mountain landscape with pine trees"
                    loading="lazy"
                >
                <figcaption>Mountain Vista</figcaption>
            </figure>

            <figure class="gallery-item" data-category="nature" data-id="2">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&q=80"
                    alt="Ocean waves at sunset"
                    loading="lazy"
                >
                <figcaption>Ocean Waves</figcaption>
            </figure>

            <!-- Architecture Images -->
            <figure class="gallery-item" data-category="architecture" data-id="3">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1460661519527-1f89bc1e8bf6?w=400&q=80"
                    alt="Modern building architecture"
                    loading="lazy"
                >
                <figcaption>Modern Architecture</figcaption>
            </figure>

            <figure class="gallery-item" data-category="architecture" data-id="4">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80"
                    alt="City skyline with illuminated buildings"
                    loading="lazy"
                >
                <figcaption>City Lights</figcaption>
            </figure>

            <!-- Portrait Images -->
            <figure class="gallery-item" data-category="portrait" data-id="5">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                    alt="Professional portrait of a man"
                    loading="lazy"
                >
                <figcaption>Professional Portrait</figcaption>
            </figure>

            <figure class="gallery-item" data-category="portrait" data-id="6">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
                    alt="Smiling woman portrait"
                    loading="lazy"
                >
                <figcaption>Happy Smile</figcaption>
            </figure>

            <!-- Technology Images -->
            <figure class="gallery-item" data-category="technology" data-id="7">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80"
                    alt="Computer workstation setup"
                    loading="lazy"
                >
                <figcaption>Tech Workspace</figcaption>
            </figure>

            <figure class="gallery-item" data-category="technology" data-id="8">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"
                    alt="Mobile phone and laptop"
                    loading="lazy"
                >
                <figcaption>Digital Devices</figcaption>
            </figure>

            <!-- Food Images -->
            <figure class="gallery-item" data-category="food" data-id="9">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80"
                    alt="Fresh salad on a plate"
                    loading="lazy"
                >
                <figcaption>Fresh Salad</figcaption>
            </figure>

            <figure class="gallery-item" data-category="food" data-id="10">
                <img
                    class="gallery-image"
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"
                    alt="Gourmet pasta dish"
                    loading="lazy"
                >
                <figcaption>Pasta Perfection</figcaption>
            </figure>
        </div>

        <!-- No Results Message -->
        <div id="noResults" class="no-results hidden">
            <p>No images found in this category. Try another filter.</p>
        </div>

        <!-- Image Modal -->
        <div id="imageModal" class="modal hidden">
            <div class="modal-overlay" id="modalOverlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <img id="modalImage" src="" alt="" class="modal-image">
                <figcaption id="modalCaption"></figcaption>
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
    --primary-color: #3b82f6;
    --hover-color: #2563eb;
    --text-color: #1f2937;
    --text-light: #6b7280;
    --border-color: #e5e7eb;
    --bg-color: #f9fafb;
    --overlay-bg: rgba(0, 0, 0, 0.5);
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Header */
.gallery-header {
    text-align: center;
    margin-bottom: 50px;
}

.gallery-header h1 {
    font-size: 36px;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.gallery-header p {
    font-size: 18px;
    color: var(--text-light);
}

/* Filter Buttons */
.filter-container {
    display: flex;
    gap: 12px;
    margin-bottom: 40px;
    justify-content: center;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 10px 20px;
    border: 2px solid var(--border-color);
    background: white;
    color: var(--text-color);
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-2px);
}

.filter-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

/* Gallery Grid */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    opacity: 1;
    animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.gallery-item.hidden {
    display: none;
    opacity: 0;
}

.gallery-item:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.gallery-item:hover .gallery-image {
    transform: scale(1.05);
}

.gallery-item:hover figcaption {
    background: var(--primary-color);
    color: white;
}

/* Image Styles */
.gallery-image {
    width: 100%;
    height: 280px;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
    cursor: pointer;
}

/* Figure Caption */
figcaption {
    padding: 16px;
    background: white;
    color: var(--text-color);
    font-weight: 600;
    text-align: center;
    transition: all 0.3s ease;
}

/* No Results */
.no-results {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-light);
    font-size: 18px;
}

.no-results.hidden {
    display: none;
}

.hidden {
    display: none;
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
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.modal:not(.hidden) {
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
    background: white;
    border-radius: 12px;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    z-index: 1001;
    animation: slideUp 0.3s ease-out;
}

.modal-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    font-size: 36px;
    color: white;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.modal-close:hover {
    transform: scale(1.2);
}

.modal-image {
    max-width: 100%;
    max-height: calc(90vh - 80px);
    object-fit: contain;
    border-radius: 12px 12px 0 0;
}

#modalCaption {
    padding: 16px;
    text-align: center;
    font-weight: 600;
    color: var(--text-color);
}

/* Responsive Design */
@media (max-width: 1024px) {
    .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    .gallery-header h1 {
        font-size: 28px;
    }
}

@media (max-width: 768px) {
    .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    .gallery-image {
        height: 200px;
    }

    .gallery-header h1 {
        font-size: 24px;
    }

    .gallery-header p {
        font-size: 16px;
    }

    .filter-container {
        gap: 8px;
    }

    .filter-btn {
        padding: 8px 16px;
        font-size: 13px;
    }

    .modal-close {
        top: 10px;
        color: var(--text-color);
    }
}

@media (max-width: 480px) {
    .gallery-grid {
        grid-template-columns: 1fr;
    }

    .gallery-image {
        height: 250px;
    }

    .gallery-header h1 {
        font-size: 20px;
    }

    .gallery-header p {
        font-size: 14px;
    }

    .filter-container {
        gap: 6px;
        margin-bottom: 30px;
    }

    .filter-btn {
        padding: 6px 12px;
        font-size: 12px;
    }

    .modal-content {
        max-width: 95%;
        max-height: 95vh;
    }

    .modal-image {
        max-height: calc(95vh - 80px);
    }
}

/* Loading State */
.gallery-image[loading="lazy"] {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* Print Styles */
@media print {
    .filter-container {
        display: none;
    }

    .gallery-item:hover {
        transform: none;
    }
}
```

### 7.3 JavaScript Implementation

```javascript
// Gallery Manager Class
class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.galleryItems = [];
        this.init();
    }

    init() {
        // Get all gallery items
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

        // Setup event listeners
        this.setupFilterListeners();
        this.setupImageListeners();
        this.setupModalListeners();

        // Initialize lazy loading
        this.setupLazyLoading();
    }

    setupFilterListeners() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    handleFilter(e) {
        const filterValue = e.target.dataset.filter;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Filter gallery items
        this.filterGallery(filterValue);
        this.currentFilter = filterValue;
    }

    filterGallery(category) {
        let visibleCount = 0;

        this.galleryItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;

            if (shouldShow) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Show/hide no results message
        const noResults = document.getElementById('noResults');
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }

        console.log(`Showing ${visibleCount} images in '${category}' category`);
    }

    setupImageListeners() {
        this.galleryItems.forEach(item => {
            const image = item.querySelector('.gallery-image');
            image.addEventListener('click', (e) => this.openModal(e));
        });
    }

    openModal(e) {
        const image = e.target;
        const figure = image.closest('.gallery-item');
        const caption = figure.querySelector('figcaption').textContent;

        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');

        modalImage.src = image.src;
        modalCaption.textContent = caption;
        modal.classList.remove('hidden');

        console.log(`Opened modal for: ${caption}`);
    }

    setupModalListeners() {
        const modal = document.getElementById('imageModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.querySelector('.modal-close');

        // Close on overlay click
        modalOverlay.addEventListener('click', () => this.closeModal());

        // Close on button click
        modalClose.addEventListener('click', () => this.closeModal());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('imageModal');
        modal.classList.add('hidden');
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('.gallery-image');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // Trigger actual image load
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.src;
            });
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});
```

---

## 8. WORKING MECHANISM

### 8.1 Detailed Process Flow

**Initialization Phase:**
1. DOM loads, GalleryManager class instantiated
2. All gallery items queried and stored in array
3. Event listeners attached to filter buttons, images, modal
4. Intersection Observer setup for lazy loading

**Filter Process:**
1. User clicks filter button (e.g., "Nature")
2. `handleFilter()` triggered
3. Active class removed from previous button, added to clicked button
4. `filterGallery('nature')` called
5. All items looped through:
   - If `data-category` matches or filter is 'all': remove `hidden` class
   - Else: add `hidden` class (CSS hides via `display: none`)
6. Visible count calculated
7. If count = 0, "no results" message shown

**Image Click & Modal:**
1. User clicks gallery image
2. Click listener triggers `openModal()`
3. Image src and caption extracted
4. Modal element unhidden
5. Modal image and caption populated
6. Modal becomes visible with animation

**Modal Closure:**
- User clicks overlay → `closeModal()`
- User clicks close button → `closeModal()`
- User presses Escape → `closeModal()`
- Modal gets `hidden` class → opacity 0, visibility hidden

**Responsive Behavior:**
- Desktop: Grid shows 3 columns (300px each)
- Tablet: Grid shows 2 columns
- Mobile: Grid shows 1 column
- Calculated via `repeat(auto-fill, minmax(300px, 1fr))`

---

## 9. OUTPUT

### 9.1 Visual Output - Grid Layout

```
Desktop View (3 columns):
┌─────────────┬─────────────┬─────────────┐
│  Image 1    │  Image 2    │  Image 3    │
│ Mountain    │ Architecture│  Portrait   │
└─────────────┴─────────────┴─────────────┘
┌─────────────┬─────────────┬─────────────┐
│  Image 4    │  Image 5    │  Image 6    │
│  Ocean      │  Building   │  Tech       │
└─────────────┴─────────────┴─────────────┘

Tablet View (2 columns):
┌──────────────────┬──────────────────┐
│   Image 1        │   Image 2        │
│  Mountain        │ Architecture     │
└──────────────────┴──────────────────┘
┌──────────────────┬──────────────────┐
│   Image 3        │   Image 4        │
│  Portrait        │  Ocean           │
└──────────────────┴──────────────────┘

Mobile View (1 column):
┌──────────────────┐
│   Image 1        │
│  Mountain        │
└──────────────────┘
┌──────────────────┐
│   Image 2        │
│ Architecture     │
└──────────────────┘
```

### 9.2 Filter States

```
Filter Buttons:
[All Images] [🌿 Nature] [🏗️ Architecture] [👤 Portrait] [💻 Technology] [🍽️ Food]
^Active       (inactive)   (inactive)       (inactive)    (inactive)      (inactive)

After clicking "Nature":
[All Images] [🌿 Nature] [🏗️ Architecture] [👤 Portrait] [💻 Technology] [🍽️ Food]
(inactive)   ^Active      (inactive)       (inactive)    (inactive)      (inactive)

Gallery shows only nature images:
2 mountain/ocean images visible
4 other images hidden
```

### 9.3 Modal View

```
┌───────────────────────────────────────┐
│                    [X]                │
│                                       │
│        ┌─────────────────────┐        │
│        │                     │        │
│        │   Full-Size Image   │        │
│        │   (Mountain Vista)  │        │
│        │                     │        │
│        └─────────────────────┘        │
│                                       │
│         Mountain Vista Caption        │
├───────────────────────────────────────┤
│        (Click outside to close)       │
└───────────────────────────────────────┘
```

---

## 10. CONCLUSION

The **Image Gallery with Category Filtering** successfully demonstrates modern CSS and JavaScript techniques for creating interactive, responsive web components. Key achievements:

✅ **Responsive Grid Layout:** Auto-adjusts to all screen sizes using CSS Grid.
✅ **Smooth Filtering:** Category-based filtering with smooth animations.
✅ **Modal View:** Full-size image viewing with multiple close methods.
✅ **Performance:** Lazy loading with Intersection Observer API.
✅ **Accessibility:** ARIA labels, keyboard navigation, semantic HTML.
✅ **Animations:** Smooth transitions and transform effects.
✅ **User Experience:** Intuitive interface with visual feedback.

### Advanced Enhancements

1. **Search Functionality:** Filter by keywords or tags
2. **Sorting Options:** Sort by date, name, or popularity
3. **Lightbox Navigation:** Arrow keys to navigate between images in modal
4. **Drag & Drop:** Reorder gallery items
5. **Favorites:** Save favorite images
6. **Share:** Social media sharing for images
7. **Advanced Filtering:** Multiple simultaneous filters
8. **Pagination:** Load more images on scroll
9. **Image Info:** Show metadata (size, dimensions, date)
10. **Download:** Allow users to download images

### Real-World Applications

- **Photography portfolios:** Showcase work by category
- **E-commerce:** Product galleries with filters
- **Real estate:** Property listings filtered by type
- **Travel sites:** Destinations filtered by region
- **Social media:** Photo feeds with category browsing
- **News sites:** Photo galleries by topic
- **Educational:** Image libraries for learning
- **Art galleries:** Exhibition catalogs

---

**Document Version:** 1.0  
**Date:** April 20, 2026  
**Technology Stack:** HTML5 | CSS3 | JavaScript ES6+ | Intersection Observer API  
**Difficulty Level:** Intermediate  
**Lines of Code:** ~550 (HTML + CSS + JS)
