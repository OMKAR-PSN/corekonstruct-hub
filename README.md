# Core Konstruct

**Smart Construction Monitoring System** - A premium full-stack web application for managing construction projects, monitoring sites, and keeping all stakeholders in sync.

## Project Structure

```
construction-project/
|-- index.html              <- Landing page
|-- login.html              <- Role-based login
|-- dashboard-admin.html    <- Contractor/Admin dashboard
|-- dashboard-supervisor.html <- Supervisor dashboard
|-- dashboard-client.html   <- Client dashboard
|-- blog.html               <- Blog / Knowledge Hub
|-- server.js               <- Node.js HTTP server
|-- css/
|   |-- main.css            <- Global design system
|   |-- landing.css         <- Landing page styles
|   |-- auth.css            <- Login styles
|   |-- dashboard.css       <- Dashboard styles
|   |-- blog.css            <- Blog styles
|-- js/
    |-- main.js             <- Landing page logic
    |-- auth.js             <- Authentication & session
    |-- admin.js            <- Admin dashboard logic
    |-- supervisor.js       <- Supervisor dashboard logic
    |-- client.js           <- Client dashboard logic
```

## Running Locally

```bash
node server.js
# Open: http://localhost:3000
```

## Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@corekonstruct.com | admin123 |
| Supervisor | supervisor@corekonstruct.com | super123 |
| Client | client@corekonstruct.com | client123 |

## Team
Built by the Core Konstruct team.
