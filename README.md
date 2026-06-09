# Gardening Server

Backend service for the Cosmos gardening platform. This API handles authentication, user profiles, posts, comments, voting, favourites, follow relationships, groups, and premium payment upgrades.

## Overview

- Runtime: Node.js + Express + TypeScript
- Database: MongoDB via Mongoose
- Auth: JWT access/refresh tokens with refresh token cookie support
- Uploads: `multer` + Cloudinary
- Validation: `zod`
- Payments: external payment gateway callback flow

The API is mounted under `"/api/v1"` and the root route `"/"` returns a simple health string.

## How The Backend Is Organized

```text
src/
  app.ts                  Express app, CORS, middleware, route mounting
  server.ts               Bootstraps DB connection and starts the server
  config/                 env loading, DB connection, Cloudinary, multer
  routes/                 top-level module route registration
  middlewares/            auth, validation, error handling, 404 handling
  modules/
    auth/                 signup, login, refresh-token
    user/                 profile read/update
    posts/                create/read/update/delete posts
    comment/              post comments
    vote/                 post voting
    favourite/            saved posts
    following/            follow/unfollow and follow status
    group/                gardening groups and membership
    payment/              premium upgrade/payment callbacks
  utils/                  async wrapper and API response helper
  error/                  normalized error translators
```

## Core Functional Areas

### Authentication

- Email/password signup and login
- JWT access token generation
- JWT refresh token generation
- Refresh token stored in an HTTP-only cookie
- Token refresh endpoint for issuing a new access token

### Users

- Fetch user profile by id
- Update user profile
- Profile image upload support through `multer`
- User roles: `user` and `admin`
- Premium flag stored at the user level

### Posts

- Rich content posts with title, content, category, image list, and premium flag
- Image upload field name: `itemImages`
- Post listing with pagination
- Post fetch by id
- Fetch posts by author
- Author-only update and delete flow
- Soft-delete flag on the model

### Social Features

- Follow/unfollow users
- Check follow status
- Comment create/edit/delete
- Vote on posts
- Save/unsave favourites
- Create and join gardening groups

### Payments

- Generates a payment URL from the configured payment provider
- Uses backend success/fail callbacks
- Marks a user as premium after successful confirmation
- Redirects users back to the frontend after completion

## Request Flow

1. `src/server.ts` opens the MongoDB connection and starts Express.
2. `src/app.ts` configures CORS, JSON parsing, cookies, and mounts the API.
3. `ensureDatabaseConnection` checks the DB connection before module routes run.
4. Each module controller returns responses through `sendResponse`.
5. Validation, auth, and error middleware normalize failures.

## Environment Variables

Create a `.env` file in `gardening-server` and define the values below.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Server port. Defaults to `5000`. |
| `NODE_ENV` | No | Environment mode. Affects cookie and CORS behavior. |
| `DB_URL` | Yes | MongoDB connection string. |
| `BCRYPT_SALT_ROUNDS` | Yes | Password hashing salt rounds. |
| `DEFAULT_PASS` | No | Default password placeholder, currently loaded but not central to startup. |
| `JWT_ACCESS_SECRET` | Yes | Secret for signing access tokens. |
| `JWT_REFRESH_SECRET` | Yes | Secret for signing refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | Yes | Access token lifetime. |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token lifetime. |
| `CLOUDINARY_NAME` | Yes if uploads are used | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Yes if uploads are used | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes if uploads are used | Cloudinary API secret. |
| `FRONTEND_BASE_URL` | Yes | Frontend URL used by CORS and payment redirects. |
| `BACKEND_BASE_URL` | Yes for payments | Public backend base URL used in payment callbacks. |
| `CLIENT_ORIGIN` | No | Single allowed frontend origin for CORS. |
| `CLIENT_ORIGINS` | No | Comma-separated list of extra allowed frontend origins. |
| `PAYMENT_URL` | Yes for premium payments | Payment gateway initiation URL. |
| `STORE_ID` | Yes for premium payments | Merchant/store id for the gateway. |
| `SIGNATURE_KEY` | Yes for premium payments | Payment signature key. |

## Local Development

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run start:dev
```

### Build TypeScript

```bash
npm run build
```

The compiled entry point is configured as `dist/server.js`.

## API Base URL

```text
/api/v1
```

## Route Summary

### Auth

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/signup` | Register a new user. |
| `POST` | `/auth/login` | Log in and return access/refresh tokens. |
| `POST` | `/auth/refresh-token` | Exchange refresh token cookie for a new access token. |

### Users

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/users/:id` | Fetch a user profile by id. |
| `PATCH` | `/users/:id` | Update profile fields and optional `profilePicture`. |

### Posts

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/posts/create` | Create a post. Supports multipart uploads with `itemImages`. |
| `GET` | `/posts` | List posts with `page` and `limit` query params. |
| `GET` | `/posts/:id` | Get a single post. |
| `GET` | `/posts/user-posts/:id` | Get posts created by a user. |
| `PUT` | `/posts/update/:id` | Update a post owned by the supplied user. |
| `DELETE` | `/posts/delete/:id` | Delete a post owned by the supplied user. |

### Comments

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/comment` | Create a comment for a post. |
| `GET` | `/comment/:postId` | Get comments for a post. |
| `PUT` | `/comment/:commentId` | Edit a comment. |
| `DELETE` | `/comment/:commentId` | Delete a comment. |

### Votes

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/votes` | Cast a vote. Requires `Authorization: Bearer <token>`. |
| `GET` | `/votes/:postId` | Get vote totals for a post. |

### Follow

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/follow` | Follow a user. |
| `DELETE` | `/follow/unfollow` | Unfollow a user. |
| `GET` | `/follow/:userId` | Get followers for a user. |
| `GET` | `/follow/following/:userId` | Get users followed by a user. |
| `GET` | `/follow/status/:followerId/:followingId` | Check whether one user follows another. |

### Favourites

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/fav` | Save a post as favourite. |
| `DELETE` | `/fav/:postId` | Remove a saved post. |
| `GET` | `/fav/:postId/count` | Get favourite count for a post. |
| `GET` | `/fav/:postId` | Get favourite record for a post. |
| `GET` | `/fav/userfav/:userId` | Get a user's saved posts. |

### Groups

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/groups/create` | Create a group. |
| `GET` | `/groups` | Get all groups. |
| `GET` | `/groups/:id` | Get one group with member data. |
| `POST` | `/groups/:id/join` | Join a group. |
| `POST` | `/groups/:id/leave` | Leave a group. |
| `DELETE` | `/groups/:id` | Delete a group. |

### Payments

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/payment/:id` | Start a payment and return the payment URL. |
| `POST` | `/payment/confirmation/:id` | Payment success callback. Marks the user premium. |
| `POST` | `/payment/fail` | Payment failure callback. |

## Authentication Notes

- Access tokens are returned in the JSON response body.
- Refresh tokens are also set as cookies in the auth controller.
- The reusable auth middleware expects `Authorization: Bearer <token>`.
- Some client code also sends raw cookies for route protection on the frontend.

## Upload Notes

- Post images use multipart upload with the field name `itemImages`.
- User profile update uses multipart upload with the field name `profilePicture`.
- Cloudinary credentials must be configured before upload routes work.

## CORS Notes

Allowed origins are built from:

- `FRONTEND_BASE_URL`
- `CLIENT_ORIGIN`
- `CLIENT_ORIGINS`
- local development URLs such as `http://localhost:3000`

Requests with credentials are enabled.

## Known Operational Notes

- There is no automated test suite configured yet.
- The `test` script is currently a placeholder.
- Payment flow depends on a real external gateway configuration.
- MongoDB connection is shared and reused through `connectDB()`.

## Deployment Checklist

Before deploying, verify:

1. MongoDB connection string is reachable from the deployment target.
2. JWT secrets and expiry values are defined.
3. Cloudinary credentials are valid if image uploads are required.
4. Frontend and backend public URLs are set correctly.
5. Payment callback URLs point to the deployed backend domain.
