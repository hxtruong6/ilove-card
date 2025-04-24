# User Authentication

**Feature Name**: User Authentication

**Description**: This feature enables users to sign up (via email/password or Google OAuth), log in, and manage basic profiles (name, avatar). It provides the foundation for user management and personalization, ensuring users can securely access the platform and customize their identity.

**User Goals**:

- Sign up easily using email/password or Google OAuth to start creating trees.
- Log in securely to access their trees and contributions.
- Manage their profile (name, avatar) to personalize their experience.

**Business Goals**:

- Achieve high user acquisition through a seamless signup process (target signup conversion rate > 90%).
- Ensure secure access to support user trust and retention (target login success rate > 95%).
- Enable personalization to enhance engagement (target: > 50% of users update their profile within the first week).

**Dependencies**:

- External Services:
  - Google OAuth for social login (requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
  - SendGrid for email verification (`SENDGRID_API_KEY`).
- Database:
  - `User` model in Prisma schema (fields: `id`, `email`, `password`, `name`, `avatar`, `lastActiveTreeId`).
- Infrastructure:
  - Secure storage for JWT tokens (e.g., localStorage on the frontend, server-side validation).
  - Google Cloud Storage for avatar uploads.

**Acceptance Criteria**:

- User can sign up with a valid email and password, receive a verification email, and verify their account to log in.
- User can sign up and log in using Google OAuth without additional verification.
- User can log in with correct credentials and be redirected to their last active tree (or default tree selection if none exist).
- User can update their name and avatar in the profile settings, and changes are reflected across the platform.
- User can request a password reset, receive a reset email, and reset their password successfully.
- Error messages are displayed for invalid inputs (e.g., incorrect password, invalid email format).

**User Scenarios**:

- **Happy Path**:
  - User navigates to `/signup`, enters a valid email ("[user@example.com](mailto:user@example.com)") and password ("Password123!"), submits the form, receives a verification email, clicks the link, logs in at `/login`, and is redirected to their last active tree (or `/default-trees` if none exist).
  - User signs up with Google OAuth at `/signup`, authorizes the app, logs in automatically, and is redirected to their last active tree.
  - User navigates to `/profile`, updates their name to "Aidan" and uploads a new avatar, sees the changes on the dashboard.
- **Alternative Paths**:
  - User forgets their password, navigates to `/forgot-password`, requests a reset, receives a reset email, visits `/reset-password`, sets a new password, and logs in successfully.
  - User logs in with Google OAuth but has an existing account with the same email; the system merges the accounts and logs them in.
  - User cancels the signup process midway (e.g., closes the browser) and returns later to complete it by revisiting `/signup`.
- **Edge Cases**:
  - User enters an email longer than 255 characters—form validation rejects with an error ("Email must be less than 255 characters").
  - User enters a password shorter than 8 characters—form validation rejects with an error ("Password must be at least 8 characters").
  - User tries to sign up with an email already in use—system shows an error ("Email already exists").
  - User uploads an avatar file larger than 10MB—system rejects with an error ("File size exceeds 10MB limit").
  - User’s browser blocks third-party cookies, breaking Google OAuth—system shows an error ("Please enable cookies to use Google login").
- **Error Cases**:
  - Server is down during signup—system shows a fallback message ("Service unavailable, please try again later").
  - SendGrid fails to send a verification email—system retries 3 times, then shows an error ("Unable to send verification email, please try again").
  - Google OAuth token is invalid or expired—system shows an error ("Google login failed, please try again").
  - User enters incorrect login credentials 5 times—system temporarily locks the account for 10 minutes and shows an error ("Too many failed attempts, try again in 10 minutes").

**Design Requirements**:

- **UI/UX**:
  - **Signup/Login Forms** (`/signup`, `/login`):
    - Watercolor-style input fields with soft edges and textured borders (e.g., `border: 2px solid #BCD1DD` with a subtle wash effect).
    - Buttons (e.g., "Sign Up," "Log In," "Sign in with Google") with a watercolor gradient (e.g., `background: linear-gradient(#2E5EAA, #A3BFFA)`).
    - Error messages in red with a watercolor wash background (e.g., `background: rgba(255, 0, 0, 0.1)`).
  - **Forgot Password/Reset Password** (`/forgot-password`, `/reset-password`):
    - Simple form with email input (for forgot password) or new password input (for reset), watercolor styling.
    - Success message after reset request (e.g., "Check your email for a reset link").
  - **Profile Page** (`/profile`):
    - Avatar upload with drag-and-drop functionality, displayed in a circular frame with a watercolor border.
    - Name input field with a placeholder (e.g., "Enter your name").
    - Save button with watercolor styling, showing a loading spinner while saving.
  - **Feedback**:
    - Loading spinner during signup/login (watercolor-style circular animation).
    - Success toast after signup/verification (e.g., "Welcome! Please verify your email").
- **Accessibility**:
  - Form fields have ARIA labels (e.g., `aria-label="Email address"`).
  - Buttons have `aria-label` for screen readers (e.g., `aria-label="Sign in with Google"`).
  - Error messages are announced by screen readers (e.g., `role="alert"`).
  - Ensure text contrast meets WCAG AA standards (e.g., 4.5:1 ratio for normal text).
  - Support keyboard navigation (e.g., tab to fields, enter to submit).

**Technical Requirements**:

- **Backend**:

  - **Database**:
    - Use the `User` model in Prisma with fields: `id`, `email`, `password`, `name`, `avatar`, `lastActiveTreeId`.
  - **API Endpoints** (following RESTful best practices with input/output details):

    - **POST /api/v1/auth/signup**

      - **Description**: Registers a new user with email and password, sends a verification email.
      - **Input**:

        - Request Body (JSON):

                    ```json
                    {
                      "email": "string", // Required, valid email format
                      "password": "string" // Required, min 8 characters
                    }

                    ```

        - Example:

                    ```json
                    {
                      "email": "user@example.com",
                      "password": "Password123!"
                    }

                    ```

      - **Output**:

        - **201 Created**:

          - Response Body:

                        ```json
                        {
                          "message": "User created. Please verify your email.",
                          "userId": "string"
                        }

                        ```

          - Example:

                        ```json
                        {
                          "message": "User created. Please verify your email.",
                          "userId": "507f1f77bcf86cd799439011"
                        }

                        ```

        - **400 Bad Request**:

          - Response Body:

                        ```json
                        {
                          "error": "Invalid email format"
                        }

                        ```

        - **409 Conflict**:

          - Response Body:

                        ```json
                        {
                          "error": "Email already exists"
                        }

                        ```

    - **GET /api/v1/auth/verify-email**

      - **Description**: Verifies the user’s email using a token sent in the verification email.
      - **Input**:
        - Query Parameters:
          - `token`: string (required, verification token)
        - Example URL: `/api/v1/auth/verify-email?token=abc123`
      - **Output**:

        - **200 OK**:

          - Response Body:

                        ```json
                        {
                          "message": "Email verified successfully"
                        }

                        ```

        - **400 Bad Request**:

          - Response Body:

                        ```json
                        {
                          "error": "Invalid or expired token"
                        }

                        ```

    - **POST /api/v1/auth/login**

      - **Description**: Authenticates a user and returns a JWT token.
      - **Input**:

        - Request Body (JSON):

                    ```json
                    {
                      "email": "string", // Required
                      "password": "string" // Required
                    }

                    ```

        - Example:

                    ```json
                    {
                      "email": "user@example.com",
                      "password": "Password123!"
                    }

                    ```

      - **Output**:

        - **200 OK**:

          - Response Body:

                        ```json
                        {
                          "token": "string", // JWT token
                          "user": {
                            "id": "string",
                            "email": "string",
                            "name": "string",
                            "avatar": "string",
                            "lastActiveTreeId": "string|null"
                          }
                        }

                        ```

          - Example:

                        ```json
                        {
                          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          "user": {
                            "id": "507f1f77bcf86cd799439011",
                            "email": "user@example.com",
                            "name": "Aidan",
                            "avatar": "<https://storage.googleapis.com/>...",
                            "lastActiveTreeId": null
                          }
                        }

                        ```

        - **401 Unauthorized**:

          - Response Body:

                        ```json
                        {
                          "error": "Invalid credentials"
                        }

                        ```

        - **403 Forbidden**:

          - Response Body:

                        ```json
                        {
                          "error": "Account locked due to too many failed attempts"
                        }

                        ```

    - **POST /api/v1/auth/google**

      - **Description**: Authenticates a user via Google OAuth, creates/merges account, returns JWT.
      - **Input**:

        - Request Body (JSON):

                    ```json
                    {
                      "code": "string" // Required, Google OAuth authorization code
                    }

                    ```

        - Example:

                    ```json
                    {
                      "code": "4/0AX4XfW..."
                    }

                    ```

      - **Output**:

        - **200 OK**:

          - Response Body:

                        ```json
                        {
                          "token": "string",
                          "user": {
                            "id": "string",
                            "email": "string",
                            "name": "string",
                            "avatar": "string",
                            "lastActiveTreeId": "string|null"
                          }
                        }

                        ```

        - **400 Bad Request**:

          - Response Body:

                        ```json
                        {
                          "error": "Invalid Google OAuth code"
                        }

                        ```

    - **POST /api/v1/auth/forgot-password**

      - **Description**: Sends a password reset email with a token.
      - **Input**:

        - Request Body (JSON):

                    ```json
                    {
                      "email": "string" // Required
                    }

                    ```

        - Example:

                    ```json
                    {
                      "email": "user@example.com"
                    }

                    ```

      - **Output**:

        - **200 OK**:

          - Response Body:

                        ```json
                        {
                          "message": "Password reset email sent"
                        }

                        ```

        - **404 Not Found**:

          - Response Body:

                        ```json
                        {
                          "error": "Email not found"
                        }

                        ```

    - **POST /api/v1/auth/reset-password**

      - **Description**: Resets the user’s password using a reset token.
      - **Input**:

        - Request Body (JSON):

                    ```json
                    {
                      "token": "string", // Required
                      "newPassword": "string" // Required, min 8 characters
                    }

                    ```

        - Example:

                    ```json
                    {
                      "token": "xyz789",
                      "newPassword": "NewPassword123!"
                    }

                    ```

      - **Output**:

        - **200 OK**:

          - Response Body:

                        ```json
                        {
                          "message": "Password reset successfully"
                        }

                        ```

        - **400 Bad Request**:

          - Response Body:

                        ```json
                        {
                          "error": "Invalid or expired token"
                        }

                        ```

    - **PATCH /api/v1/users/profile**

      - **Description**: Updates the user’s profile (name, avatar).
      - **Headers**:
        - `Authorization: Bearer <token>` (required)
      - **Input**:

        - Request Body (multipart/form-data):
          - `name`: string (optional)
          - `avatar`: file (optional, max 5MB, image formats: JPEG, PNG)
        - Example (simplified):

                    ```
                    name=Aidan
                    avatar=<file>

                    ```

      - **Output**:

        - **200 OK**:

          - Response Body:

                        ```json
                        {
                          "user": {
                            "id": "string",
                            "email": "string",
                            "name": "string",
                            "avatar": "string"
                          }
                        }

                        ```

          - Example:

                        ```json
                        {
                          "user": {
                            "id": "507f1f77bcf86cd799439011",
                            "email": "user@example.com",
                            "name": "Aidan",
                            "avatar": "<https://storage.googleapis.com/>..."
                          }
                        }

                        ```

        - **400 Bad Request**:

          - Response Body:

                        ```json
                        {
                          "error": "File size exceeds 5MB limit"
                        }

                        ```

        - **401 Unauthorized**:

          - Response Body:

                        ```json
                        {
                          "error": "Invalid token"
                        }

                        ```

  - **Security**:
    - Hash passwords with bcrypt.
    - Use JWT for authentication, validate tokens on protected routes.
    - Sanitize inputs to prevent SQL injection and XSS.

- **Frontend**:
  - **Framework**: React with Chakra UI for styling.
  - **Route URLs**:
    - `/signup`: Displays the signup form (email/password, Google OAuth).
    - `/login`: Displays the login form (email/password, Google OAuth).
    - `/verify-email`: Handles email verification (redirects from email link).
    - `/forgot-password`: Displays the forgot password form.
    - `/reset-password`: Displays the reset password form (accessed via email link).
    - `/profile`: Displays the user’s profile with name and avatar editing.
  - **Components**:
    - `SignupForm`: Email/password fields, submit button, Google OAuth button.
    - `LoginForm`: Email/password fields, forgot password link, Google OAuth button.
    - `VerifyEmailPage`: Shows verification status (success/error).
    - `ForgotPasswordForm`: Email field, submit button.
    - `ResetPasswordForm`: New password field, submit button.
    - `ProfilePage`: Avatar upload (drag-and-drop), name input, save button.
  - **State Management**:
    - Store JWT in localStorage, use context for auth state.
  - **API Integration**:
    - POST to `/api/v1/auth/signup`, `/api/v1/auth/login`, `/api/v1/auth/google`, `/api/v1/auth/forgot-password`, `/api/v1/auth/reset-password`.
    - PATCH to `/api/v1/users/profile`.
    - Handle errors with toast notifications (e.g., "Invalid credentials").
- **Infrastructure**:
  - Configure Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
  - Set up SendGrid API for email verification (`SENDGRID_API_KEY`).
  - Use Google Cloud Storage for avatar uploads, store URLs in the `avatar` field.

**Risks and Mitigations**:

- **Risk**: High signup failure rate due to email service downtime.
  - **Mitigation**: Implement a retry mechanism (3 attempts) for SendGrid, fallback to in-app notification ("Verification email failed, please try again").
- **Risk**: Security vulnerability in password storage.
  - **Mitigation**: Use bcrypt for hashing, ensure JWTs are securely managed (e.g., short expiration, refresh tokens).
- **Risk**: Google OAuth fails due to misconfiguration.
  - **Mitigation**: Test OAuth flow thoroughly in staging, provide clear error messages for users.
- **Risk**: Users upload malicious files as avatars.
  - **Mitigation**: Validate file types (JPEG, PNG only), scan uploads for malware using a service like ClamAV.

**Success Metrics**:

- Signup conversion rate > 90% (percentage of users who complete signup).
- Login success rate > 95% (percentage of successful logins).
- User satisfaction score (via survey) > 4/5 for signup/login experience.
- Average time to complete signup < 1 minute.
- Percentage of users updating their profile (name/avatar) within the first week > 50%.
- Error rate for authentication endpoints < 1%.

**Development Tasks**:

- **Backend**:
  - [ ] Update `User` model in Prisma with required fields.
  - [ ] Implement `POST /api/v1/auth/signup` with email verification.
  - [ ] Implement `GET /api/v1/auth/verify-email`.
  - [ ] Implement `POST /api/v1/auth/login` with JWT generation.
  - [ ] Implement `POST /api/v1/auth/google` for OAuth login.
  - [ ] Implement `POST /api/v1/auth/forgot-password` and `POST /api/v1/auth/reset-password`.
  - [ ] Implement `PATCH /api/v1/users/profile` for name/avatar updates.
- **Frontend**:
  - [ ] Build `SignupForm` at `/signup` with watercolor styling.
  - [ ] Build `LoginForm` at `/login` with Google OAuth button.
  - [ ] Build `VerifyEmailPage` at `/verify-email`.
  - [ ] Build `ForgotPasswordForm` at `/forgot-password`.
  - [ ] Build `ResetPasswordForm` at `/reset-password`.
  - [ ] Build `ProfilePage` at `/profile` with avatar upload and name input.
  - [ ] Add form validation (email format, password length).
  - [ ] Integrate with backend APIs, handle JWT storage.
- **Infrastructure**:
  - [ ] Configure Google OAuth credentials.
  - [ ] Set up SendGrid API for email verification.
  - [ ] Configure Google Cloud Storage for avatar uploads.

**Testing Plan**:

- **Unit Tests**:
  - Test password hashing function (`hashPassword`).
  - Test email validation logic (`isValidEmail`).
  - Test JWT generation and validation.
- **Integration Tests**:
  - Test `POST /api/v1/auth/signup`: 201 with valid data, 400 with invalid email, 409 with existing email.
  - Test `POST /api/v1/auth/login`: 200 with correct credentials, 401 with incorrect password.
  - Test `PATCH /api/v1/users/profile`: 200 with valid avatar file, 400 with oversized file.
- **E2E Tests**:
  - Sign up with email at `/signup`, verify email at `/verify-email`, log in at `/login`, redirect to last active tree.
  - Sign up with Google OAuth at `/signup`, log in, redirect to last active tree.
  - Update profile at `/profile` (name, avatar), verify changes on dashboard.
  - Request password reset at `/forgot-password`, reset at `/reset-password`, log in with new password.
  - Edge case: Enter invalid email, see error message.
  - Error case: Simulate server downtime, see fallback message.
- **Manual Tests**:
  - Verify watercolor styling on signup/login forms (buttons, error messages).
  - Test on mobile devices (iOS Safari, Android Chrome).
  - Test edge case: Long email (> 255 characters), oversized avatar file.
- **Accessibility Tests**:
  - Test with VoiceOver: Ensure form fields are announced correctly.
  - Test keyboard navigation: Tab through fields, submit form with Enter.
  - Verify error messages are announced (e.g., `role="alert"`).

**Performance and Security**:

- **Performance**:
  - Ensure `POST /api/v1/auth/signup` responds in < 500ms under load (100 concurrent users).
  - Ensure `POST /api/v1/auth/login` responds in < 300ms under load.
- **Security**:
  - Test for SQL injection on `POST /api/v1/auth/signup` (e.g., email field).
  - Test for XSS on `PATCH /api/v1/users/profile` (e.g., name field).
  - Ensure passwords are hashed, JWTs are securely stored.
  - Scan avatar uploads for malware using ClamAV.

**UAT Feedback**:

- [Placeholder: Users found the signup button hard to see—adjust color contrast.]

**Post-Release Monitoring**:

- **Metrics**:
  - Monitor signup conversion rate (target: > 90%).
  - Track email delivery success rate (target: > 98%).
  - Monitor login success rate (target: > 95%).
  - Track profile update rate within the first week (target: > 50%).
  - Monitor error rate for authentication endpoints (target: < 1%).
- **Feedback**:
  - Collect user feedback on signup/login process via in-app survey.
  - Track support tickets related to authentication issues (target: < 2% of users).
