# Kanban Board

A simple Kanban board application built with React, similar to Trello. This project allows users to organize tasks using a visual board with drag-and-drop functionality.

## Features

- Create and manage lists (columns) like "To Do", "In Progress", "Done"
- Add cards (tasks) to any list
- Drag and drop cards between lists to update their status
- Drag and drop lists to reorder them
- Edit card and list titles
- Mark cards as complete or incomplete
- Delete cards and lists
- Data persistence using localStorage (your data is saved between sessions)

## Technologies Used

- React with TypeScript
- TailwindCSS for styling
- Hello-Pangea DnD for drag-and-drop functionality
- React Hot Toast for notifications
- UUID for generating unique IDs
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone this repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```
npm install
```

### Running the Application

To start the development server:

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Building for Production

To create a production build:

```
npm run build
```

This creates an optimized build in the `build` folder that you can deploy.

## Usage Instructions

1. **Create a List**: Click the "Add New List" button to create a new column
2. **Add a Card**: Click the "Add a card" button within any list to add a new task
3. **Move Cards**: Drag and drop cards between lists to change their status
4. **Reorder**: Drag and drop to reorder cards within a list or reorder the lists themselves
5. **Edit**: Click the edit icon on any card or list to modify its text
6. **Mark Complete**: Click the circle icon on a card to mark it as complete
7. **Delete**: Click the trash icon to delete a card or list (lists can only be deleted when empty)

## License

MIT
