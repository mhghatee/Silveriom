# Master Plan for Silveriom Ad-Tech Integration

## 1. Tool 1: Admin Excel Importer & Mapper
- **Location:** `panel/admin.html` and `panel/admin.js`
- **Functionality:** 
  - Drag & drop `.xlsx` file using `SheetJS`.
  - Preview parsed data in a table.
  - Dropdown columns for "Venue/Location", "Media Type", and "Display Pages".
  - Save to `silveriom_db.json` via `api.php`.

## 2. Tool 2: Page Placement Manager
- **Location:** `panel/admin.html`
- **Functionality:**
  - View all assigned media per page.
  - Bulk edit which pages media are assigned to.

## 3. Global Media Card Component
- **Location:** `shared_components/global_css.html` (Styles) and `shared_components/scripts.html` (Logic).
- **Functionality:**
  - `renderMediaCard(mediaData)` JS function that outputs the exact HTML for the card based on the screenshot provided.
  - This ensures DRY (Don't Repeat Yourself) principle. Update once, it updates across all pages.
