# Employee Management System

A full-featured CRUD (Create, Read, Update, Delete) web application for managing employee records using browser Local Storage.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
 
## Overview

The Employee Management System is a client-side web application that allows users to manage employee records without requiring a backend server. All data is stored persistently in the browser's Local Storage, making it ideal for demonstrations, prototyping, or small-scale personal use.

## Features

### Core CRUD Operations
- **Create** - Add new employees with photo upload
- **Read** - View all employees in a sortable, searchable table
- **Update** - Edit existing employee information and photos
- **Delete** - Remove individual employees or delete all records at once

### User Interface
- Responsive design that works on desktop and mobile devices
- Bootstrap 5 styled components
- Font Awesome icons throughout
- Toast notifications for user feedback
- Modal dialogs for add, edit, and photo viewing
- Interactive data table with sorting, searching, and pagination

### Data Management
- Persistent storage using browser Local Storage
- Image optimization (resize and compress uploaded photos)
- Unique ID generation for each employee
- Default user image fallback for employees without photos
- Timestamps for record creation and updates

### Validation
- Client-side form validation
- Real-time feedback on input fields
- Photo file type and size validation
- Name format validation (capitalized names)
- Email format validation
- Mobile number validation

### Sample Data
- Pre-loaded sample employee data on first run
- Demonstration of full CRUD functionality immediately

## Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Structure and markup |
| CSS3 | - | Custom styling |
| JavaScript (ES6+) | - | Application logic |
| Bootstrap 5 | 5.3.0 | UI framework and components |
| jQuery | 3.7.0 | DOM manipulation |
| DataTables | 1.13.6 | Table functionality |
| Font Awesome | 6.4.0 | Icons |
