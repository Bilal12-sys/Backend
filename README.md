# E-commerce Backend

A simple Express API for user authentication and product management. It uses MongoDB for data, Cloudinary for product images, and Joi for request validation.

## Getting started

1. Install dependencies: `npm install`
2. Create a `.env` file in the project root:

   ```env
   PORT=2000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   Google_Email=your_email
   Google_App_Password=your_email_app_password
   ```

   Email settings are used for registration and login notifications.

3. Start the server with `npm run dev` or `npm start`. The default base URL is `http://localhost:2000`.
4. Run tests with `npm test`.

## API

All responses are JSON. User routes start with `/api/auth`; product routes start with `/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Check that the server is running |
| `POST` | `/api/auth/Register` | Register with `name`, `email`, `password`, and optional `phone` |
| `POST` | `/api/auth/Login` | Log in with `email` and `password`; returns a JWT |
| `GET` | `/api/auth/Profile` | Get the authenticated user's profile |
| `GET` | `/api/auth/users` | List users |
| `GET` | `/api/products` | List products |
| `GET` | `/api/products/:id` | Get a product by MongoDB ID |
| `POST` | `/api/createproduct` | Create a product with an image |
| `PUT` | `/api/products/:id` | Update product fields and optionally replace its image |
| `DELETE` | `/api/products/:id` | Delete a product and its Cloudinary image |

Send `Authorization: Bearer <token>` with the profile request. Product create and update requests use `multipart/form-data`; attach the image using the field name `image`. Create requires `title`, `price`, `stock`, and `category`. Images must be JPEG, PNG, GIF, WebP, or AVIF and no larger than 5 MB. Other product fields are optional.

Uploaded images are temporarily saved under `assets/`, sent to Cloudinary, and removed from disk. The Cloudinary image URL is saved with the product in MongoDB and returned in the response.

## Project structure

```text
config/                 MongoDB and Cloudinary setup
contraller/product/     Product request handlers
contraller/user/        User request handlers
middleware/             Authentication and image upload
models/                 MongoDB schemas
routes/                 API route definitions
service/product/        Product database and image operations
service/user/           User database operations
test/                   Automated tests
utils/                  Product/user helpers and Cloudinary upload
```
