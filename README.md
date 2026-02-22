# 📦 My Indoor Cycling Blog

vite-indoorcyclingblog
School project

## 🌟Highlights of this Project

- The Front-end will allow users to perform **CRUD** operations (Create, Read, Update, and Delete) on their own posts.
- Features such as **following/unfollow users**, **commenting on posts**, and **reacting** to a post with an emoji.

### 🌓 Smart Dark Mode Implementation

A robust theme-switching system that prioritizes user experience and performance.

- **System Synchronization**: Automatically detects and applies the user's OS color preference (Light/Dark) on first load.
- **Persistence**: Remembers user manual overrides across sessions using `localStorage`.
- **Anti-FOUC Logic**: Utilizes an inline blocking script in the `<head>` to prevent the "Flash of Unstyled Content", ensuring a smooth visual experience from the first paint.
- **Granular UI Control**: Built with a custom Tailwind variant (`@custom-variant dark`) to manage complex CSS specificity, allowing for detailed elevation and contrast adjustments across all components.

## ℹ️Overview

This is a **Front-end for a social media application**, implemented as a **single-page application (SPA)** using **Vite** and **vanilla TypeScript**.
A separate Project Plan includes details about the steps of this project.

Note: An enhanced version of this project featuring Tailwind CSS and modern styling can be found on the tailwind-styling branch 'css-frameworks'.

### The pages included are:

- Login page.
- Register page.
- Post/feed page.
- Individual post page.
- User's own profile page.
- PostCreate page.
- PostEdit page.
- Search page.

### Out of Scope:

The importance of this assignment is to demonstrate JavaScript and TypeScript, modern styling is also implemented using Tailwind CSS. This includes responsive layouts and minor examples of state-driven transitions.
Note: **No front-end frameworks** like React, Vue or Angular are used in this project.

## 📐 System Architecture:

### Backend Context

The application utilizes a **Two-Tier (Client-API)** architecture, connecting directly to the external Noroff API, which functions as the backend. The API Base URL is defined in `src/utils/constants.ts`.

<img width="449" height="412" alt="image" src="https://github.com/user-attachments/assets/118660d8-07b3-4f33-999d-843cd134b24c" />

### Component Breakdown:

#### Browser(Client):

The Single-Page Application (SPA) built with Vite and TypeScript. It communicates with the external API via standard `fetch` calls. **Authentication(Access Token) is managed client-side in `localStorage`**, and the API Key is sent via the `X-Noroff-API-Key` header.

#### Server(Noroff API):

The external, Noroff API is a unified service that handles all persistence and business logic (Auth, Posts, Profiles), and data storage.

## 💻 Technologies

#### Language:

- TypeScript

#### Frameworks & Libraries:

- Vite
- Tailwind CSS (Utility-first-styling)
- Jest (Testing)

## 📂 File Structure

The project follows a standard file structure for Vite Application.

- `src/api/`: Contains service files for handling API requests.
- `src/api/Client.ts`: Central API wrapper responsible for adding authentication headers (Bearer token, API Key).
- `src/components/`: Houses UI components.
- `src/pages/`: Contains the main pages of the application (e.g., `PostFeed.ts`, `Login.ts`, `UserProfile.ts`).
- `src/utils/`: Stores reusable utility functions, like data transformers.
- `src/utils/constants.ts`: Holds the API URL.
- `src/utils/authUtils.ts`: Manages the client-side storage (localStorage) for the Access Token and the API Key.
- `src/utils/store.ts`: Contains functions and logic for managing application state, including authentication status(`login`, `logout`) and user data.
- `src/router.ts`: Router logic.
- `src/main.ts`: The main application entry file, router initialize.
- `src/style.css`: The main styles. Containing Tailwind CSS directives and custom CSS variables.
- `index.html`: The entry point of the application.
- `package.json`: Manages project dependencies and scripts.
- `jest.config.js`: Configuration file for unit tests.
- `tsconfig.json`: TypeScript configuration.

### ✍️ Author

I'm a Front End Developer Student [@Anne-Zwift](https://github.com/Anne-Zwift/) and this is my [project](https://github.com/Anne-Zwift/vite-indoorcyclingblog/) building a Social Media Application.

## 🚀 Usage

### Authentication

To use the application, you must **Register** or **Log in**. The application connects to the Noroff Social Media API.
[Netlify Live Link](https://vite-indoorcyclingblog.netlify.app/)

- **Registration/Login:** Requires a valid Noroff student email (`@stud.noroff.no`).

### Features

Once logged in, you can:

- View the main feed or a specialized **Following Feed**.
- Search for **Profiles and Posts**,
- Follow and Unfollow users,
- Create, Edit, and Delete your own posts.

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
