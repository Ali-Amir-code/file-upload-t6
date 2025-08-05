

# File Upload API

A RESTful API for uploading, downloading, and managing files.

## Table of Contents

1. [Setup](#setup)
2. [Endpoints](#endpoints)
3. [Models](#models)
4. [Middleware](#middleware)
5. [Routes](#routes)
6. [Usage](#usage)

## Setup

To set up the project, follow these steps:

1. Clone the repository: `git clone https://github.com/ali-amir-code/file-upload-t6.git`
2. Install dependencies: `npm install`
3. Create a new file named `.env` in the root directory and add the following environment variables:
	* `MONGO_URI`: your MongoDB connection string
	* `JWT`: your JSON Web Token secret key
	* `PORT`: the port number to run the server on (default: 5000)
4. Start the server: `npm start`

## Endpoints

The API has the following endpoints:

### Authentication

* **POST /auth/register**: Register a new user
	+ Request Body: `{ name: string, email: string, password: string }`
	+ Response: `{ token: string }`
* **POST /auth/login**: Login an existing user
	+ Request Body: `{ email: string, password: string }`
	+ Response: `{ token: string }`

### File Management

* **POST /upload**: Upload a new file
	+ Request Body: `{ file: file }` (multipart/form-data)
	+ Response: `{ msg: string, fileId: string }`
* **GET /files**: Get a list of all files belonging to the authenticated user
	+ Response: `[ { name: string, size: number, type: string, uploadAt: date } ]`
* **GET /file**: Get metadata about a specific file
	+ Query Parameter: `filename=string`
	+ Response: `{ name: string, size: number, type: string, uploadAt: date }`
* **DELETE /delete**: Delete a file or all files belonging to the authenticated user
	+ Query Parameter: `filename=string` (optional)
	+ Response: `{ msg: string }`

### Download

* **GET /download/file**: Download a specific file
	+ Query Parameter: `filename=string`
	+ Response: `{ file: file }` (application/octet-stream)
* **GET /download/files**: Download all files belonging to the authenticated user as a zip archive
	+ Response: `{ file: file }` (application/zip)

## Models

The API uses the following models:

* **User**: `{ name: string, email: string, password: string }`
* **File**: `{ name: string, file: file, user: ObjectId, uploadAt: date }`

## Middleware

The API uses the following middleware:

* **auth**: authenticates incoming requests using JSON Web Tokens
* **errorHandler**: catches and handles errors thrown by the API

## Routes

The API has the following routes:

* **auth.js**: handles authentication-related endpoints
* **upload.js**: handles file upload-related endpoints
* **file.js**: handles file management-related endpoints
* **download.js**: handles file download-related endpoints
* **delete.js**: handles file deletion-related endpoints

## Usage

To use the API, follow these steps:

1. Register a new user: `POST /auth/register` with a JSON body containing `name`, `email`, and `password`
2. Login an existing user: `POST /auth/login` with a JSON body containing `email` and `password`
3. Upload a new file: `POST /upload` with a multipart/form-data body containing the file
4. Get a list of all files: `GET /files`
5. Get metadata about a specific file: `GET /file` with a query parameter `filename`
6. Delete a file or all files: `DELETE /delete` with a query parameter `filename` (optional)
7. Download a specific file: `GET /download/file` with a query parameter `filename`
8. Download all files as a zip archive: `GET /download/files`
