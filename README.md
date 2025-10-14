# 📦 My Indoor Cycling Blog
vite-indoorcyclingblog
School project

## 🌟Highlights of this Project
- The Front-end will allow users to perform CRUD operations (Create, Read, Update, and Delete) on their own posts.
- Features such as following/unfollow users, commenting on posts, and reacting to a post with an emoji.

## ℹ️Overview
This is a Front-end for a social media application, it is a single-page application (SPA) with Vite and vanilla TypeScript.
A separate Project Plan includes details about the steps of this project.
### The pages included are:

- Login page.
- Register page.
- Post/feed page.
- Individual post page.
- User's own profile page.

### Out of Scope:
The importance of this assignment is to demonstrate JavaScript. Therefore, there will not be an amazing design for the project, just some basic styling in place.

## System Architecture:
### Backend Context
The backend server is hosted externally and is not part of this repository. All API requests are from the client directed to the base Url defined in `src/constants.ts`.
The application follows a Three-Tier Monolithic architecture by connecting to a remote, unified Node.js/Express API backend by PostgreSQL. This repository contains only the client-side code.

<img width="439" height="170" alt="image" src="https://github.com/user-attachments/assets/3a50e262-c7a9-4f97-8a10-043241172906" />

### Component Breakdown:
#### Browser(Client): 
The Single-Page Application (SPA) built with Vite and TypeScript. It communicates with the server via API calls.
#### Server(Monolith): 
A single external Node.js/Express application that hosts all business logic (Auth, Posts, Routing) and serves the API endpoints.
#### Database(PostgreSQL): 
The external persistent data store used by Server.

## 💻 Technologies
#### Language: 
- TypeScript
#### Frameworks & Libraries:
- Vite
- Jest

## 📂 File Structure
The project follows a standard file structure for Vite Application.

* `src/api/`: Contains service files for handling API requests.
* `src/api/Client.ts`: Central file for API wrapper.
* `src/components/`: Houses UI components.
* `src/pages/`: Contains the main pages of the application (e.g., `PostFeed.ts`, `Login.ts`, `UserProfile.ts`).
* `src/utils/`: Stores reusable utility functions, like data transformers.
* `src/utils/constants.ts`: Holds the API URL.
* `src/utils/store.ts`: Contains functions and logic for managing application state, including authentication status(`login`, `logout`) and user data.
* `src/router.ts`: Router logic.
* `src/main.ts`: The main application entry file, router initialize.
* `src/style.css`: The main styles.
* `index.html`: The entry point of the application.
* `package.json`: Manages project dependencies and scripts.
* `jest.config.js`: Configuration file for unit tests.
* `tsconfig.json`: TypeScript configuration.

### ✍️ Author
I'm a Front End Developer Student [@Anne-Zwift](https://github.com/Anne-Zwift/) and this is my [project](https://github.com/Anne-Zwift/vite-indoorcyclingblog/) building a Social Media Application.

## 🚀 Usage
This application is designed to be used in a web browser. Once you have it running, you will be able to navigate through the different pages to log in, register, view post feed, and interact with user profiles and posts.

## ⬇️ Installation
#### Getting Started
### Prerequisites
You need to have [Node.js](https://nodejs.org) and npm installed on your computer.
### Steps
#### 1. Clone the repository:
`git clone [your-repo-url]`
#### 2. Navigate to the project directory:
`cd vite-indoorcyclingblog`
#### 3. Install the dependencies:
`npm install`

### Running the Project
To start the development server and view the application in your browser, run the following command:
`npm run dev`
The application will be available at a local URL, typically `http://localhost:5173`.

## 💭 Feedback and Contributing
#### 🎓 This is a project for my education purpose only.

