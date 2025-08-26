Product Management System
A full-stack MERN application for managing products with inventory history tracking, CSV import/export functionality, and real-time updates.

Features

Frontend
Product search and filtering with category dropdown

Products table with color-coded stock status

Import/Export CSV functionality

Inline editing with immediate updates

Inventory history sidebar

Responsive design for mobile and desktop

Backend
RESTful APIs for product management

CSV import with duplicate handling

Inventory history tracking

Data validation and error handling

MongoDB integration

Technologies Used
Frontend
Vite (React framework)

Axios for API calls

CSS3 with responsive design

Backend
Node.js

Express.js

MongoDB with Mongoose

Multer for file uploads

CSV-parser for CSV processing

Installation and Setup
Prerequisites
Node.js (v14 or higher)

MongoDB (local or Atlas cluster)

npm

Backend Setup
Navigate to the backend directory:

bash
cd backend
Install dependencies:

bash
npm install
Create a .env file in the backend directory:

env
MONGODB_URI=mongodb://localhost:27017/productdb
PORT=5000
Start the backend server:

bash
npm run dev

Frontend Setup
Navigate to the frontend directory:

bash
cd frontend
Install dependencies:

bash
npm install
