# Gardening Server - Backend Documentation

Comprehensive developer documentation and technical guide for the Cosmos Gardening Platform backend service (`gardening-server`).

---

## 📋 Table of Contents

- [1. 🚀 Project Overview](#1--project-overview)
- [2. 🏗️ Architecture & Project Structure](#2-️-architecture--project-structure)
- [3. 🔑 Authentication Mechanism](#3--authentication-mechanism)
  - [3.1 Email & Password Registration (`POST /auth/signup`)](#31-email--password-registration-post-authsignup)
  - [3.2 Email & Password Login (`POST /auth/login`)](#32-email--password-login-post-authlogin)
  - [3.3 Google OAuth 2.0 Single Sign-On (`POST /auth/google-login`)](#33-google-oauth-20-single-sign-on-post-authgoogle-login)
  - [3.4 Token Refresh Mechanism (`POST /auth/refresh-token`)](#34-token-refresh-mechanism-post-authrefresh-token)
- [4. 👤 User Management Mechanism](#4--user-management-mechanism)
  - [4.1 Fetch User Profile (`GET /users/:id`)](#41-fetch-user-profile-get-usersid)
  - [4.2 Update User Profile (`PATCH /users/:id`)](#42-update-user-profile-patch-usersid)
- [5. 📝 Post Management Mechanism](#5--post-management-mechanism)
  - [5.1 Create Post (`POST /posts/create`)](#51-create-post-post-postscreate)
  - [5.2 List All Posts (`GET /posts`)](#52-list-all-posts-get-posts)
  - [5.3 Fetch Single Post & User Posts](#53-fetch-single-post--user-posts)
  - [5.4 Update & Soft Delete Post](#54-update--soft-delete-post)
- [6. 🎥 Video Tips Mechanism](#6--video-tips-mechanism)
- [7. 💬 Commenting System Mechanism](#7--commenting-system-mechanism)
- [8. 🎯 Voting System Mechanism](#8--voting-system-mechanism)
- [9. 🤝 Follow & Social System Mechanism](#9--follow--social-system-mechanism)
- [10. ⭐ Favourites & Saved Posts Mechanism](#10--favourites--saved-posts-mechanism)
- [11. 👥 Gardening Groups Mechanism](#11--gardening-groups-mechanism)
- [12. 💳 Payment & Premium System Mechanism](#12--payment--premium-system-mechanism)
- [13. 🛡️ Core Middlewares & Utility Layer](#13-️-core-middlewares--utility-layer)
- [14. 🌐 Environment Variables](#14--environment-variables)
- [15. 🛠️ Local Development & Deployment](#15-️-local-development--deployment)

---

## 1. 🚀 Project Overview

The **Gardening Server** API is built with Node.js, Express, TypeScript, and MongoDB (via Mongoose). It powers the Cosmos gardening social platform by handling authentication, user profiles, rich post creation with Cloudinary image uploads, commenting, upvoting/downvoting, user follow relationships, gardening group management, video tips, and premium payments.

- **Base API Path**: `/api/v1`
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB via Mongoose ORM
- **Auth Strategy**: JWT Access Tokens + HTTP-only Refresh Cookies + NextAuth Google OAuth 2.0 integration
- **File Uploads**: `multer` + Cloudinary
- **Request Validation**: Zod Schemas

---

## 2. 🏗️ Architecture & Project Structure

The project follows a modular, feature-driven architecture where each functional entity has its own folder inside `src/modules/`:

```text
src/
├── app.ts                  # Express application setup, CORS, body parsers, cookie parsers
├── server.ts               # Entry point bootstrapping MongoDB connection & HTTP server
├── config/                 # Environment variables configuration, Cloudinary, Multer
├── routes/
│   └── index.ts            # Central API Router mounting all module routes under `/api/v1`
├── middlewares/            # Auth, Zod request validation, and global error handlers
│   ├── auth.ts             # JWT authorization & role-checking middleware
│   ├── validateRequest.ts  # Zod schema validation middleware wrapper
│   ├── globalErrorHandler.ts# Global Express error handler translator
│   └── notFound.ts         # 404 Route Not Found handler
├── modules/
│   ├── auth/               # Authentication module (Signup, Login, Google Login, Refresh Token)
│   ├── user/               # User management module (Profiles, Roles, Premium status)
│   ├── posts/              # Posts creation, listing, updating, soft deletion
│   ├── video/              # Gardening video tips module
│   ├── comment/            # Commenting on posts module
│   ├── vote/               # Upvoting/downvoting posts module
│   ├── following/          # User follow/unfollow social graph
│   ├── favourite/          # Saved favourite posts module
│   ├── group/              # Gardening groups & membership module
│   └── payment/            # Premium payment gateway integration module
└── utils/                  # Reusable helper utilities (catchAsync, sendResponse)
```

---

## 3. 🔑 Authentication Mechanism

All authentication routes are mounted under `/api/v1/auth`.

### 3.1 Email & Password Registration (`POST /auth/signup`)

* **Route**: `src/modules/auth/auth.route.ts`
* **Validation Schema**: `AuthValidation.signupValidationSchema` in `src/modules/auth/auth.validation.ts`
* **Controller**: `AuthControllers.signUpUser` in `src/modules/auth/auth.controller.ts`
* **Service**: `AuthServices.signUpUser` in `src/modules/auth/auth.service.ts`
* **Model**: `User` in `src/modules/user/user.model.ts`

**Mechanism:**
1. Validates request body containing `name`, `email`, `password`, and optional `profilePicture`.
2. Checks if email exists via `User.isUserExistsByEmail(email)`. Throws 404 if email exists.
3. Assigns default `role: "user"` and fallback avatar if missing.
4. Saves document to MongoDB. Mongoose `pre('save')` hook automatically hashes `password` via `bcrypt.hash()`.
5. Calls `createToken()` in `src/modules/auth/auth.utils.ts` to sign JWT `accessToken` and `refreshToken`.
6. Attaches `refreshToken` as an HTTP-only cookie and returns JSON containing both tokens.

---

### 3.2 Email & Password Login (`POST /auth/login`)

* **Route**: `src/modules/auth/auth.route.ts`
* **Validation Schema**: `AuthValidation.loginValidationSchema` in `src/modules/auth/auth.validation.ts`
* **Controller**: `AuthControllers.loginUser` in `src/modules/auth/auth.controller.ts`
* **Service**: `AuthServices.loginUser` in `src/modules/auth/auth.service.ts`

**Mechanism:**
1. Validates `email` and `password`.
2. Queries database using `User.isUserExistsByEmail(email)`. Throws 404 if user does not exist.
3. Compares plain text password against hashed password using `User.isPasswordMatched(password, hashed)`. Throws 403 if invalid.
4. Generates JWT `accessToken` and `refreshToken`.
5. Sets `refreshToken` HTTP-only cookie (`refreshCookieOptions`) and returns 200 OK JSON with tokens.

---

### 3.3 Google OAuth 2.0 Single Sign-On (`POST /auth/google-login`)

* **Route**: `src/modules/auth/auth.route.ts`
* **Validation Schema**: `googleLoginValidationSchema` in `src/modules/auth/auth.validation.ts`
* **Controller**: `AuthControllers.googleLogin` in `src/modules/auth/auth.controller.ts`
* **Service**: `AuthServices.googleLogin` in `src/modules/auth/auth.service.ts`
* **Interface**: `TGoogleLoginUser` in `src/modules/auth/auth.interface.ts`
* **Client Integration**: NextAuth `signIn` callback in `gardening-tips-platform-client/src/config/nextAuth.config.ts`

**Mechanism & Execution Flow:**

```text
[ Client: Google Button ] 
  └─► NextAuth Google OAuth 2.0 
        └─► NextAuth Callback (`signIn({ profile })`)
              └─► POST fetch `${BASE_API}/auth/google-login` { name, email, profilePicture }
                    └─► Express Route -> Zod Validation -> Controller (`googleLogin`)
                          └─► Service (`AuthServices.googleLogin`)
                                ├─► Check `User.isUserExistsByEmail(email)`
                                │     ├── NOT FOUND: Auto-create User (role: "user", passwordless)
                                │     └── FOUND: Retrieve existing User
                                ├─► Issue JWT `accessToken` & `refreshToken`
                                └─► Return response & set HTTP-only cookie
```

**Passwordless Model Guard:**
* In `src/modules/user/user.model.ts`, Mongoose `pre('save')` hook checks `if (user.password && user.isModified('password'))` before hashing, allowing passwordless Google OAuth accounts to be created cleanly without runtime errors.

---

### 3.4 Token Refresh Mechanism (`POST /auth/refresh-token`)

* **Route**: `src/modules/auth/auth.route.ts`
* **Validation Schema**: `AuthValidation.refreshTokenValidationSchema` in `src/modules/auth/auth.validation.ts`
* **Controller**: `AuthControllers.refreshToken` in `src/modules/auth/auth.controller.ts`
* **Service**: `AuthServices.refreshToken` in `src/modules/auth/auth.service.ts`

**Mechanism:**
1. Reads `refreshToken` cookie from incoming HTTP request cookies.
2. Decodes token using `verifyToken(token, JWT_REFRESH_SECRET)` in `src/modules/auth/auth.utils.ts`.
3. Verifies user exists in MongoDB.
4. Generates and returns a fresh JWT `accessToken`.

---

## 4. 👤 User Management Mechanism

Mounted under `/api/v1/users`.

### 4.1 Fetch User Profile (`GET /users/:id`)

* **Route**: `src/modules/user/user.route.ts`
* **Controller**: `UserControllers.getSingleUser` in `src/modules/user/user.controller.ts`
* **Service**: `UserServices.getSingleUserFromDB` in `src/modules/user/user.service.ts`

**Mechanism:** Queries MongoDB `User.findById(id)` and populates follower/following references.

---

### 4.2 Update User Profile (`PATCH /users/:id`)

* **Route**: `src/modules/user/user.route.ts`
* **Middleware**: `multerUpload.single('profilePicture')` in `src/config/multer.config.ts`
* **Controller**: `UserControllers.updateUser` in `src/modules/user/user.controller.ts`
* **Service**: `UserServices.updateUserIntoDB` in `src/modules/user/user.service.ts`

**Mechanism:**
1. Accepts profile text fields and optional image upload.
2. If image is provided, uploads file to Cloudinary and obtains secure image URL.
3. Updates fields in Mongoose `User` document.

---

## 5. 📝 Post Management Mechanism

Mounted under `/api/v1/posts`.

### 5.1 Create Post (`POST /posts/create`)

* **Route**: `src/modules/posts/posts.route.ts`
* **Middleware**: `multerUpload.array('itemImages', 5)`
* **Controller**: `PostControllers.createPost` in `src/modules/posts/posts.controller.ts`
* **Service**: `PostServices.createPostIntoDB` in `src/modules/posts/posts.service.ts`
* **Model**: `Post` in `src/modules/posts/posts.model.ts`

**Mechanism:**
1. Accepts multipart payload: `title`, `content`, `category`, `isPremium`, `author`.
2. Uploads `itemImages` array to Cloudinary and saves secure image URLs.
3. Creates new `Post` document in MongoDB.

---

### 5.2 List All Posts (`GET /posts`)

* **Route**: `src/modules/posts/posts.route.ts`
* **Controller**: `PostControllers.getAllPosts` in `src/modules/posts/posts.controller.ts`
* **Service**: `PostServices.getAllPostsFromDB` in `src/modules/posts/posts.service.ts`

**Mechanism:** Supports query parameter pagination (`?page=1&limit=10`) and category filtering (`?category=GardeningTips`). Excludes posts marked as `isDeleted: true`.

---

### 5.3 Fetch Single Post & User Posts

* **`GET /posts/:id`**: `PostControllers.getSinglePost` -> `PostServices.getSinglePostFromDB`. Fetches post by MongoDB ID.
* **`GET /posts/user-posts/:id`**: `PostControllers.getUserPosts` -> `PostServices.getUserPostsFromDB`. Retrieves all non-deleted posts created by a specific user.

---

### 5.4 Update & Soft Delete Post

* **`PUT /posts/update/:id`**: `PostControllers.updatePost` -> `PostServices.updatePostIntoDB`. Updates post content and images.
* **`DELETE /posts/delete/:id`**: `PostControllers.deletePost` -> `PostServices.deletePostFromDB`. Sets `isDeleted: true` on the `Post` document.

---

## 6. 🎥 Video Tips Mechanism

Mounted under `/api/v1/videos`.

* **Files**: `src/modules/video/video.route.ts`, `video.controller.ts`, `video.service.ts`, `video.model.ts`
* **Endpoints**:
  * `POST /videos`: `createVideo` - Adds new video tutorial record.
  * `GET /videos`: `getAllVideos` - Returns video library with pagination.
  * `GET /videos/:id`: `getVideoById` - Returns video details.
  * `POST /videos/:id/view`: `incrementViewCount` - Increments view count counter.
  * `PUT /videos/:id`: `updateVideo` - Updates video metadata.
  * `DELETE /videos/:id`: `deleteVideo` - Removes video record.

---

## 7. 💬 Commenting System Mechanism

Mounted under `/api/v1/comment`.

* **Files**: `src/modules/comment/comment.route.ts`, `comment.controller.ts`, `comment.service.ts`, `comment.model.ts`
* **Endpoints**:
  * `POST /comment`: `createComment` - Creates a new comment linked to `postId` and `userId`.
  * `GET /comment/:postId`: `getCommentsByPostId` - Fetches all comments for a post sorted by creation date.
  * `PUT /comment/:commentId`: `updateComment` - Edits comment text.
  * `DELETE /comment/:commentId`: `deleteComment` - Deletes a comment.

---

## 8. 🎯 Voting System Mechanism

Mounted under `/api/v1/votes`.

* **Files**: `src/modules/vote/vote.route.ts`, `vote.controller.ts`, `vote.service.ts`, `vote.model.ts`
* **Endpoints**:
  * `POST /votes`: `castVote` - Protected by `auth()` middleware. Users upvote or downvote posts. Prevents duplicate votes by updating existing vote record.
  * `GET /votes/:postId`: `getVoteTotals` - Calculates net vote score (upvotes minus downvotes) for a post.

---

## 9. 🤝 Follow & Social System Mechanism

Mounted under `/api/v1/follow`.

* **Files**: `src/modules/following/following.route.ts`, `following.controller.ts`, `following.service.ts`, `following.model.ts`
* **Endpoints**:
  * `POST /follow`: `followUser` - Adds `followerId` to `followers` array of target user and `followingId` to `following` array of source user.
  * `DELETE /follow/unfollow`: `unfollowUser` - Removes IDs from respective arrays.
  * `GET /follow/:userId`: `getFollowers` - Lists followers of a user.
  * `GET /follow/following/:userId`: `getFollowing` - Lists accounts followed by a user.
  * `GET /follow/status/:followerId/:followingId`: `getFollowStatus` - Returns boolean check if follower relationship exists.

---

## 10. ⭐ Favourites & Saved Posts Mechanism

Mounted under `/api/v1/fav`.

* **Files**: `src/modules/favourite/favourite.route.ts`, `favourite.controller.ts`, `favourite.service.ts`, `favourite.model.ts`
* **Endpoints**:
  * `POST /fav`: `addFavourite` - Saves post to user's bookmark list.
  * `DELETE /fav/:postId`: `removeFavourite` - Removes saved post bookmark.
  * `GET /fav/userfav/:userId`: `getUserFavourites` - Fetches user's saved post list.
  * `GET /fav/:postId/count`: `getFavouriteCount` - Returns count of total users who saved a post.

---

## 11. 👥 Gardening Groups Mechanism

Mounted under `/api/v1/groups`.

* **Files**: `src/modules/group/group.route.ts`, `group.controller.ts`, `group.service.ts`, `group.model.ts`
* **Endpoints**:
  * `POST /groups/create`: `createGroup` - Creates a community gardening group.
  * `GET /groups`: `getAllGroups` - Lists all community groups.
  * `GET /groups/:id`: `getGroupById` - Gets group details and member roster.
  * `POST /groups/:id/join`: `joinGroup` - Adds user to group members array.
  * `POST /groups/:id/leave`: `leaveGroup` - Removes user from group members array.
  * `DELETE /groups/:id`: `deleteGroup` - Removes group.

---

## 12. 💳 Payment & Premium System Mechanism

Mounted under `/api/v1/payment`.

* **Files**: `src/modules/payment/payment.route.ts`, `payment.controller.ts`, `payment.service.ts`
* **Endpoints**:
  * `GET /payment/:id`: `initiatePayment` - Generates payment URL via external gateway config.
  * `POST /payment/confirmation/:id`: `paymentConfirmation` - Callback handler. Validates gateway response, sets `isPremium: true` on user document in MongoDB, and redirects user back to frontend.
  * `POST /payment/fail`: `paymentFail` - Payment failure callback handler.

---

## 13. 🛡️ Core Middlewares & Utility Layer

1. **Auth Middleware (`src/middlewares/auth.ts`)**:
   * Intercepts requests, validates `Authorization: Bearer <token>`, decodes payload using `JWT_ACCESS_SECRET`, attaches decoded user to `req.user`, and verifies role permissions (`USER_ROLE.user`, `USER_ROLE.admin`).

2. **Validation Middleware (`src/middlewares/validateRequest.ts`)**:
   * Higher-order function taking a Zod schema and validating `req.body`, `req.params`, or `req.cookies`.

3. **Global Error Handler (`src/middlewares/globalErrorHandler.ts`)**:
   * Catches all unhandled exceptions, translating Zod validation errors, Mongoose CastErrors, duplicate key errors, and custom `AppError` instances into a standard HTTP response format.

4. **Async Wrapper (`src/utils/catchAsync.ts`)**:
   * Wraps Express controller functions in `Promise.resolve().catch(next)` to eliminate manual try-catch boilerplate.

5. **Response Helper (`src/utils/sendResponse.ts`)**:
   * Standardizes JSON API responses (`{ statusCode, success, message, data }`).

---

## 14. 🌐 Environment Variables

Create a `.env` file in `gardening-server` containing:

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Server port (default `5000`). |
| `NODE_ENV` | No | Environment mode (`development` or `production`). |
| `DB_URL` | Yes | MongoDB connection URI. |
| `BCRYPT_SALT_ROUNDS` | Yes | Salt rounds for password hashing. |
| `JWT_ACCESS_SECRET` | Yes | Secret string for signing access tokens. |
| `JWT_REFRESH_SECRET` | Yes | Secret string for signing refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | Yes | Access token expiration (e.g. `1d`). |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token expiration (e.g. `365d`). |
| `CLOUDINARY_NAME` | Yes | Cloudinary account name. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret. |
| `FRONTEND_BASE_URL` | Yes | Frontend origin URL for CORS and payment redirects. |

---

## 15. 🛠️ Local Development & Deployment

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run start:dev
```

### Build TypeScript

```bash
npm run build
```

The compiled output is saved to `dist/server.js`. Run production build using `npm start`.
