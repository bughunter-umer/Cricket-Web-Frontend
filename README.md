
````
# Cricket League Frontend

A modern **React.js** frontend for managing and viewing cricket league data. This application allows users and admins to interact with cricket league data including users, matches, trophies, revenue, investors, players, and teams. The frontend communicates with a backend API to fetch and store data securely.

---

## Features

### 1. **Role-Based Access Control**
- Users and admins have different access levels.
- Access is controlled via **JWT tokens** stored in **cookies/localStorage**.
- Admins can add, edit, and delete data, while regular users can view matches and related information.

### 2. **Modules**
The frontend supports the following modules:

- **Users** – Manage user accounts (admin only).
- **Matches** – View, add, edit, and delete matches (admin) / view only (user).
- **Trophies** – Track trophies, seasons, winners (admin only).
- **Revenue** – Manage revenue data (admin only).
- **Investors** – View and manage investor information (admin only).
- **Players** – Manage players and their details (admin only).
- **Teams** – Manage teams participating in the league (admin only).

### 3. **Authentication**
- **Login/Logout** functionality for users and admins.
- JWT tokens are used for authentication and stored in **localStorage**.
- Token is attached to all API requests using Axios interceptors.
- `/auth/me` endpoint used to fetch logged-in user details.

### 4. **Frontend Technologies**
- React.js with **functional components** and **hooks** (`useState`, `useEffect`, `useContext`).
- React Router v6 for **client-side routing**.
- Axios for **API calls**.
- React Toastify for **notifications**.
- Tailwind CSS for **responsive and modern UI**.
- Role-based protected routes using `ProtectedRoute` component.

### 5. **Pages**
- **Login Page** – Login for both users and admins.
- **Admin Dashboard** – Access to all management modules.
- **User Pages** – View matches and relevant data.

### 6. **Components**
- **Navbar** – Navigation bar with links depending on role.
- **Sidebar** – Admin panel sidebar with links to modules.
- **MatchComponent** – Admin: add/edit/delete matches; User: view matches only.
- **TrophyComponent** – Admin: manage trophies.
- **Reusable Forms and Tables** – For displaying and editing data.

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd cricket-league-frontend
````

2. **Install dependencies**

```bash
npm install
```

3. **Configure API endpoint**

* Update API base URLs in `src/api/*.js` to point to your backend server:

```javascript
// Example for matches
const API = axios.create({
  baseURL: "http://localhost:5000/api/matches",
});
```

4. **Run the development server**

```bash
npm run dev
```

5. **Build for production**

```bash
npm run build
```

---

## Role-Based Access

| Role  | Permissions                                                                                 |
| ----- | ------------------------------------------------------------------------------------------- |
| Admin | Full access: add, edit, delete users, matches, trophies, revenue, investors, players, teams |
| User  | View-only access: view matches and league information                                       |

---

## Authentication Flow

1. User logs in via `/login` page.
2. Backend returns **JWT token** and user data (`id`, `name`, `email`, `role`).
3. Token is stored in `localStorage` and sent in **Authorization headers** for all API requests.
4. Protected routes are rendered based on user role.
5. `/auth/me` endpoint verifies token and returns user details on page reload.

---

## Notifications

* Uses **React Toastify** to show success/error messages for actions like:

  * Login success/failure
  * Add/edit/delete operations
  * API fetch errors

---

## Folder Structure

```
src/
├─ api/               # Axios API instances for users, matches, teams, etc.
├─ components/        # Reusable components (Navbar, Sidebar, MatchComponent)
├─ context/           # AuthContext for authentication
├─ layout/            # Layout components for Admin and User
├─ pages/             # Pages for Admin and User
│   ├─ admin/
│   └─ user/
├─ App.jsx            # Main App with routes
└─ index.jsx          # Entry point
```

---

## Notes

* Make sure your backend has corresponding endpoints for all modules:

  * `/users`, `/matches`, `/teams`, `/players`, `/trophies`, `/revenues`, `/investors`
* JWT secret and expiration must match backend configuration.
* Admin routes are **protected** using `ProtectedRoute` with role checks.

---

## Author

**Umer Awan**
Cricket League Frontend && Backend Developer

---

