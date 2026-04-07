# CoreKonstruct Firebase Schema (Collections & Documents)

Since we switched to Firebase Firestore, we don't use SQL tables. Instead, we use a document-based NoSQL structure.

Here is how data will be mapped out moving forward:

## Collection: `tenants`
Stores construction companies (contractors).
```json
{
  "name": "CoreKonstruct Demo",
  "slug": "corekonstruct-demo-123",
  "plan": "starter",
  "is_active": true,
  "created_at": "ISO_STRING"
}
```

## Collection: `users`
Stores all Admins, Supervisors, and Clients. Link them to a tenant via `tenant_id`.
```json
{
  "tenant_id": "TENANT_DOC_ID",
  "name": "Arjun Singh",
  "email": "arjun@example.com",
  "password_hash": "...",
  "role": "supervisor", // 'admin', 'supervisor', 'client'
  "is_active": true,
  "created_at": "ISO_STRING",
  "last_login_at": "ISO_STRING"
}
```

## Collection: `customers`
Stores client details. Link to specific projects.
```json
{
  "tenant_id": "TENANT_DOC_ID",
  "user_id": "USER_DOC_ID_IF_LINKED",
  "company_name": "Patil Build Corp",
  "contact_person": "Smita Patil",
  "email": "smita@patil.com",
  "phone": "+91 9876543210",
  "billing_address": "...",
  "tax_id": "GSTIN...",
  "created_at": "ISO_STRING"
}
```

## Collection: `supervisor_profiles`
Expanded information for staff.
```json
{
  "user_id": "USER_DOC_ID",
  "phone": "...",
  "specialization": "Civil",
  "hire_date": "YYYY-MM-DD",
  "emergency_contact": "...",
  "status": "active"
}
```

## Collection: `projects`
```json
{
  "tenant_id": "TENANT_DOC_ID",
  "customer_id": "CUSTOMER_DOC_ID",
  "supervisor_id": "USER_DOC_ID",
  "name": "City Center Complex",
  "type": "building", // 'building', 'road', 'bridge'
  "location": "Mumbai, MH",
  "budget": 5000000.00,
  "status": "active",
  "progress": 68,
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "created_at": "ISO_STRING"
}
```

### Subcollections under `projects` Document
Instead of top-level collections with `project_id`, we can organize these directly under a project doc: `projects/{projectId}/...`

*   **`stages`**: `{ name: "Foundation", order_index: 0, progress: 100 }`
*   **`daily_reports`**: `{ supervisor_id, date, weather, work_done, issues }`
*   **`attendance`**: `{ supervisor_id, worker_name, date, status }`
*   **`inventory`**: `{ material_id: "DOC_ID", quantity: 50.0 }`
*   **`expenses`**: `{ category: "labour", amount: 15000, date: "..." }`
*   **`issues`**: `{ reported_by, assigned_to, title, severity, status }`
*   **`invoices`**: `{ invoice_no, amount, due_date, status: 'unpaid' }`

## Collection: `material_catalog`
The master list of materials the company purchases.
```json
{
  "tenant_id": "TENANT_DOC_ID",
  "name": "Ambuja Cement",
  "unit_of_measure": "Bags",
  "default_rate": 350.00
}
```

## Collection: `material_logs` (Root Level or inside project)
Tracks inward/outward movement. Better at root level to query globally.
```json
{
  "project_id": "PROJECT_DOC_ID",
  "material_id": "MATERIAL_DOC_ID",
  "supervisor_id": "USER_DOC_ID",
  "type": "inward", // or "outward"
  "quantity": 100,
  "reference_no": "INV-1234",
  "log_date": "YYYY-MM-DD",
  "notes": "Delivered by Tata trucks."
}
```
