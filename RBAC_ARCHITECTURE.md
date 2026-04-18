# Role-Based Access Control (RBAC) Architecture & Feature Documentation

## Executive Summary

**CoreKonstruct Hub** implements a **three-tier RBAC system** with distinct user personas, data models, and UI/UX flows:

1. **Admin** – Global oversight, project orchestration, document management, resource planning
2. **Supervisor/Contractor** – Site execution, progress tracking, material & labor requisitioning
3. **Client** – Read-only transparency, real-time project status, secure document access

A separate **Prospective Client** flow (unauthenticated) drives lead generation via public portfolio and contact form.

---

## Data Model (Core Entities)

All mock data is served through async API stubs in `src/lib/api/projects.ts` with 500ms artificial delay for realistic UX.

### 1. **Project** (Core)
```typescript
type Project = {
  id: number;
  clientID: number;                    // RBAC: Clients filter by this
  name: string;
  type: string;                        // 'Building', 'Road', 'Bridge', etc.
  location: string;
  supervisor: string;
  progress: number;                    // 0-100 %
  currentStage: "Foundation" | "Slab" | "Brickwork" | "Plastering" | 
                "Finishing" | "Railings" | "Sub-base" | "Handover";
  status: "on-track" | "delayed";
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
};
```

**RBAC Application:**
- `Admin` sees **all projects** with full financial & timeline metadata
- `Supervisor` sees **assigned projects only** (hard-coded for MVP)
- `Client` sees **projects matching their clientID only**
- `Prospective Client` sees **no projects** (marketing channel only)

---

### 2. **Document** (Compliance & Transparency)
```typescript
type Document = {
  id: number;
  projectID: number;
  type: "Sanction Plan" | "Brochure" | "Invoice" | "Permit";
  name: string;
  url: string;
  uploadDate: string;
};
```

**RBAC Application:**
- `Admin` can **upload/delete/manage** all documents; see all types including financial
- `Supervisor` has **no access** (documents managed centrally)
- `Client` can **view/download** only documents linked to their project
- `Prospective Client` can **view limited brochures** on marketing site

---

### 3. **MaterialLog** (Supply Chain Tracking)
```typescript
type MaterialLog = {
  id: number;
  projectID: number;
  materialName: string;
  quantity: number;
  unit: string;
  status: "Requested" | "Approved" | "Delivered";
  requestedBy: string;
  requestedDate: string;
};
```

**RBAC Application:**
- `Admin` **approves requests**, audits delivery, sees all projects' materials
- `Supervisor` **creates requests** for their assigned project only; cannot approve
- `Client` has **no access** (internal supply chain)
- `Prospective Client` has **no access**

---

### 4. **LaborLog** (Workforce Tracking)
```typescript
type LaborLog = {
  id: number;
  projectID: number;
  contractorName: string;
  headcount: number;
  date: string;
  stage: string;
};
```

**RBAC Application:**
- `Admin` **audits labor** across all projects; tracks cost implications
- `Supervisor` **logs daily entries** for their project (contractor names, headcount)
- `Client` has **no access**
- `Prospective Client` has **no access**

---

## Access Control Matrix

| Entity | Admin | Supervisor | Client | Prospect |
|--------|-------|-----------|--------|----------|
| Project (all) | Read ✓ Write ✓ | Read ✓ (assigned) | Read ✓ (their clientID only) | None |
| Project.ClientID | Visible | Hidden | Own only | N/A |
| Project.currentStage | Edit ✓ | Suggest via Form | Read ✓ | N/A |
| Document (all) | CRUD ✓✓✓ | None | Read ✓ (project-specific) | Brochures only |
| Document.Invoice/Financial | Read ✓ Write ✓ | None | None | None |
| MaterialLog | Approve ✓ Audit ✓ | Create ✓ Read ✓ | None | None |
| LaborLog | Audit ✓ | Log ✓ | None | None |
| ResourceOverview | View ✓ | None | None | None |
| CompletedProjects | View ✓ | View ✓ | View ✓ | **View ✓** (PUBLIC) |

---

## UI Components Architecture

### Admin Dashboard (`/admin`)

#### 1. **ProjectMasterTable**
- **File:** `src/components/admin/ProjectMasterTable.tsx`
- **Purpose:** View all projects, completion %, current stage, and override stage status
- **Features:**
  - Interactive progress bar with % display
  - CurrentStage dropdown for admin override (simulates API call on change)
  - Status badge (On Track / Delayed)
  - Budget vs. Spent summary
  - Expandable rows for detail drill-down
- **Exports Function:** None (UI-only); ready for integration with `getAdminProjects()`

#### 2. **DocumentVault**
- **File:** `src/components/admin/DocumentVault.tsx`
- **Purpose:** Upload, organize, and manage project documents (Sanction Plans, Brochures, Invoices, Permits)
- **Features:**
  - Project selector dropdown
  - Upload form with document type classification
  - Document listing by type
  - Download buttons (mocked)
  - Delete action for orphaned/obsolete docs
- **Integration Ready:** `getProjectDocuments(projectID)` function available

#### 3. **ResourceOverview**
- **File:** `src/components/admin/ResourceOverview.tsx`
- **Purpose:** Real-time labor and material pipeline across all sites
- **Features:**
  - Summary KPIs: Active Projects, Total Contractors, Active Headcount, Materials Tracked
  - Material Pipeline status (Requested → Approved → Delivered)
  - Labor Distribution by project with headcount bar charts
  - Alerts for delayed projects
  - Top pending material requests
- **Integration Ready:** Uses `getLaborLogs()` + `getMaterialLogs()` aggregate functions

---

### Supervisor Dashboard (`/supervisor`)

#### 1. **StageUpdater**
- **File:** `src/components/supervisor/StageUpdater.tsx`
- **Purpose:** Manage project progression through defined stages
- **Features:**
  - Current stage display with timeline visualization
  - Progress bar (0-100%) with synchronized updates
  - Stage progression buttons (Foundation → Slab → Brickwork → ... → Handover)
  - Manual stage override dropdown (for exceptions)
  - Quick "Advance to Next Stage" button (+15% progress auto-increment)
  - Disabled state when project reaches Handover
- **Design Philosophy:** Encourages structured progression while allowing flexibility for delays/accelerations

#### 2. **MaterialRequestForm**
- **File:** `src/components/supervisor/MaterialRequestForm.tsx`
- **Purpose:** Requisition materials for assigned project
- **Features:**
  - Material name input + quick-select buttons (common materials pre-configured)
  - Quantity + unit selection (bags, cu.m, MT, nos, sq.m, liters, meter)
  - Auto-status set to "Requested"
  - Recent requests list with status badges (Requested, Approved, Delivered)
  - Success confirmation message
  - Form reset after submission
- **Integration Ready:** `getMaterialLogs(projectID)` for history display

#### 3. **LaborTracker**
- **File:** `src/components/supervisor/LaborTracker.tsx`
- **Purpose:** Log daily contractor and headcount data
- **Features:**
  - Contractor/Team Lead input field
  - Headcount numeric input
  - Stage field (auto-filled from project current stage, editable)
  - Summary KPIs: Active Contractors count, Total Workers (latest entry)
  - Today's entries highlighting
  - Historical entries with date scrolling
  - Empty state guidance
- **Integration Ready:** `getLaborLogs(projectID)` for history display

---

### Client Dashboard (`/client`)

#### 1. **ProjectStatusBoard**
- **File:** `src/components/client/ProjectStatusBoard.tsx`
- **Purpose:** Real-time transparency into assigned projects
- **Features:**
  - Portfolio overview: Total Projects, Completed count, Average Progress %
  - Project status cards showing:
    - Project name, location, type
    - Progress bar with % (color-coded: green=on-track, amber=warning, red=delayed, emerald=complete)
    - Current stage
    - Status badge (In Progress / Delayed / Completed)
  - Icons reflect project health (CheckCircle for completed, TrendingUp for on-track, AlertCircle for delayed)
- **RBAC Enforcement:** Only projects matching authenticated client's ClientID render

#### 2. **ClientDocumentCenter**
- **File:** `src/components/client/ClientDocumentCenter.tsx`
- **Purpose:** Secure access to project-specific documents
- **Features:**
  - Filter tabs by document type (Sanction Plan, Brochure, Invoice, Permit)
  - Document cards with emoji icons, type badges, upload dates
  - One-click download buttons
  - Grid layout (responsive: 1 col mobile, 2 col tablet, auto)
  - Empty state messaging
  - Confidentiality notice footer
- **RBAC Enforcement:** Only documents with matching projectID + client's projects render; **Invoices never visible** to clients

#### 3. **ImageGallery**
- **File:** `src/components/client/ImageGallery.tsx`
- **Purpose:** Visual project progress documentation (site photos)
- **Features:**
  - Responsive grid of site photos (thumbnail browsing)
  - Hover overlay with magnifying glass icon and "View" label
  - Lightbox modal with full-size image display
  - Previous/Next navigation (wraps around)
  - Photo counter (e.g., "2 / 5")
  - Caption display both in thumbnails and lightbox
  - Empty state for projects without photos
  - Uses Next.js Image component for automatic optimization
- **Integration Ready:** Fetches from `getClientProjectSnapshot().sitePhotos`

---

### Public Landing Page (Unauthenticated)

#### 1. **CompletedProjectsShowcase**
- **File:** `src/components/landing/CompletedProjectsShowcase.tsx`
- **Purpose:** High-fidelity portfolio display to drive lead generation
- **Features:**
  - Grid of completed projects (3-column desktop, responsive down)
  - Premium image display with hover zoom effect
  - Year badges (2023, 2024, etc.)
  - Project stats: units delivered, timeline achievements, location
  - Client testimonials per project
  - Strong CTA section: "Start Your Project" button
  - Trust badges: "500+ Projects", "98% Client Satisfaction", "Zero Safety Incidents"
  - "View More Projects" secondary CTA
- **Lead Gen Integration:** Primary trigger for `LeadCaptureForm` modal

#### 2. **LeadCaptureForm**
- **File:** `src/components/landing/LeadCaptureForm.tsx`
- **Purpose:** Capture prospective client inquiry data for sales pipeline
- **Features:**
  - Modal dialog (overlay with close button)
  - Form fields:
    - Name, Email, Phone (all required)
    - Project Type (dropdown: Residential, Commercial, Infrastructure, Industrial, Other)
    - Budget Range (dropdown: <50L, 50L-1Cr, 1Cr-5Cr, 5Cr-10Cr, 10Cr+)
    - Timeline (dropdown: Immediate, 1-3mo, 3-6mo, 6-12mo, 12+mo)
    - Location (city/state)
    - Brief Description (textarea)
  - Form validation (required fields enforcement)
  - Submit button with loading state
  - Success state: CheckCircle confirmation screen with 2s auto-close
  - Privacy notice footer
- **Integration Ready:** `onSubmit` callback for CRM/email integration

---

## API Functions (Mock Layer)

All functions in `src/lib/api/projects.ts` use `delay()` helper for realistic async simulation.

```typescript
// Projects
async function getAdminProjects(): Promise<Project[]>
async function getSupervisorProjects(): Promise<SupervisorProject[]>
async function getClientProjectSnapshot(): Promise<{...}>

// Documents
async function getProjectDocuments(projectID?: number): Promise<Document[]>

// Materials & Labor
async function getMaterialLogs(projectID?: number): Promise<MaterialLog[]>
async function getLaborLogs(projectID?: number): Promise<LaborLog[]>

// Legacy (for backward compat)
async function getAdminSanctions(): Promise<SanctionRecord[]>
async function getAdminMetrics(): Promise<AdminMetrics>
async function getSupervisorMetrics(): Promise<SupervisorMetrics>
async function getClientMetrics(): Promise<ClientMetrics>
```

---

## Middleware & Route Protection

**File:** `src/middleware.ts`

Current behavior (from previous implementation):
- Intercepts requests to `/admin/*`, `/supervisor/*`, `/client/*`
- Validates JWT token from NextAuth
- If missing token: redirects to `/login?callbackUrl=/requested-route`
- If token valid but role doesn't match route: redirects to user's designated dashboardRoute

**RBAC Enhancement (Next Phase):**
- Add project-level filtering: if supervisor accesses `/supervisor`, fetch only their assigned projects
- Add client filter: `ClientID` is stored in JWT, used to filter accessible projects at API level
- Implement document-level access control: prevent direct `/documents?projectID=X` leakage

---

## Implementation Roadmap

### **Phase 1: Complete (Current)** ✓
- [x] Data model definition (Project, Document, MaterialLog, LaborLog)
- [x] Mock data generators with realistic test data
- [x] All Admin, Supervisor, Client UI components
- [x] Public lead gen components (CompletedProjectsShowcase, LeadCaptureForm)
- [x] RBAC architecture documentation

### **Phase 2: Integration (Next)**
- [ ] Connect dashboard pages to new components (replace placeholder tables)
- [ ] Wire `onStageUpdate` callbacks to database layer (real Project.currentStage updates)
- [ ] Wire `onRequestSubmit` to MaterialLog creation API
- [ ] Wire `onEntryAdd` to LaborLog creation API
- [ ] Wire `LeadCaptureForm.onSubmit` to CRM/Salesforce/email service
- [ ] Implement project-level RBAC filtering in middleware
- [ ] Add ClientID-based filtering in API layer

### **Phase 3: Production Hardening**
- [ ] Add real authentication (replace demo credentials)
- [ ] Encrypt ClientID in JWT payload
- [ ] Implement database transactions for material approval workflows
- [ ] Add audit logging for all document downloads by clients
- [ ] Rate-limit lead capture form (spam prevention)
- [ ] Add email notifications (material approved, stage advanced, document uploaded)

---

## Testing Priorities

1. **RBAC Enforcement:**
   - Verify supervisor cannot access other projects
   - Verify client cannot see financial documents
   - Verify prospective client cannot access authenticated routes

2. **Data Integrity:**
   - Material status transitions (Requested → Approved → Delivered)
   - Project stage progression (no backward jumps without override)
   - ClientID filtering at query level

3. **UX Flow:**
   - Lead form submission → success → modal close
   - Stage advance increments progress correctly
   - Document download doesn't expose project-level metadata leaks

---

## Future Enhancements

- **Notifications:** Real-time alerts for material approvals, stage changes
- **Reporting:** PDF export of project status for clients
- **Timeline Gantt:** Visual project schedule with milestone tracking
- **Mobile App:** React Native version for supervisors logging from site
- **AI Insights:** Predict project delays based on labor trends
- **Multi-tenant:** Support multiple organizations with isolated data

---

## Conclusion

This RBAC architecture provides a **clear, scalable blueprint** for role-segmented access while maintaining data integrity. Each component is **purpose-built** for its persona (Admin oversight, Supervisor execution, Client transparency) and the public lead gen funnel captures prospects **without exposing internal systems.**

**Next Action:** Integrate these components into dashboard pages and connect callbacks to real data layer.
