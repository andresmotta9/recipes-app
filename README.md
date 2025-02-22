# Recipe App

A Progressive Web Application (PWA) to manage and organize your favorite recipes. This app features dynamic user interactions (adding, editing, deleting recipes), persistent data storage using Firebase, offline capabilities via a service worker, and responsive design with SCSS and Bootstrap.

## Live Site

Check out the live site here:  
[https://andresmotta9.github.io/recipes-app/](https://andresmotta9.github.io/recipes-app/)

## Features

- **Dynamic Recipe Management:**  
  Add, edit, and delete recipes.
- **Persistent Data Storage:**  
  Uses Firebase Firestore to store and retrieve recipe data.
- **Offline Support:**  
  Service Worker caches assets for offline usage.
- **Responsive Design:**  
  Built with Bootstrap and SCSS for a mobile-friendly experience.
- **Accessibility:**  
  Includes keyboard navigability and aims to meet WCAG guidelines.
- **Automated Deployment:**  
  Deployed to GitHub Pages via GitHub Actions.

## Technologies Used

- HTML5, CSS3 (SCSS)
- Vanilla JavaScript
- Webpack for bundling
- Firebase for backend data storage
- GitHub Actions for CI/CD
- SweetAlert2 for confirmation dialogs

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later is recommended)
- npm (comes with Node.js)
- A Firebase project (configure your Firestore and any other required services)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/andresmotta9/recipes-app.git
   cd recipes-app
   ```

2. **Install dependenices**

   ```bash
   npm install
   ```

3. **Configure Database**

   - Open the file src/js/firebase/firebase.js.

   - Replace the Firebase configuration object with your Firebase project's configuration.

### Running the App Locally

#### Start the development server:

```bash
npm run start
```

This command starts the Webpack development server (configured in webpack.dev.js). Your app should now be available at http://localhost:9000 (or the configured port).

#### Build the production bundle:

```bash
npm run build
```

This creates an optimized production build in the dist folder.

#### Run Linting:

```bash
npm run lint
```

#### Deployment:

This project uses GitHub Actions to automate linting, testing, and deployment. On each push to the main branch, the workflow will build the production bundle and deploy it to the gh-pages branch, making it available via GitHub Pages.
