# API Integration Documentation

## Base URL
```
https://speedrun.koyot.digital/api/v1
```

## Endpoints

### Public Endpoints

#### Get Leaderboard Entries
```
GET /submissions
```
Fetches all approved leaderboard entries.

**Response:**
```json
[
  {
    "id": "string",
    "userID": number,
    "category": "string",
    "score": "string",
    "avatarURI": "string",
    "submissionDate": "ISO 8601 date string",
    "username": "string",
    "avatarColor": "string",
    "avatarLetter": "string"
  }
]
```

#### Submit Entry
```
POST /submissions
```
Submit a new speedrun entry for admin review.

**Request Body:**
```json
{
  "username": "string",
  "category": "string",
  "score": "string",
  "proofUrl": "string (optional)",
  "submissionDate": "ISO 8601 date string"
}
```

### Admin Endpoints (Require Authentication)

#### Login
```
POST /auth/login
```
Authenticate as admin.

**Request Body:**
```json
{
  whatever the discord auth is lol
}
```

**Response:**
```json
{
  "token": "string",
  "success": true
}
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Get Pending Submissions
```
GET /submissions
```
Fetch all pending submissions awaiting admin review.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "int",
    "userID": "int",
    "category": "string",
    "score": "string",
    "proofUrl": "url",
    "submissionDate": "ISO 8601 date string",
    "avatarURI": "URI"
  }
]
```
ISO 8601:
https://www.iso.org/iso-8601-date-and-time-format.html
#### Approve Submission
```
POST /submissions/approve
```
Approve a pending submission and add it to the leaderboard.

**Headers:**
```
Authorization: Bearer <token>
```
""
**Body:**
```json
{
  "id": "int"
}
```

#### Reject Submission
```
POST /submissions/:id/reject
```
Reject and remove a pending submission.

**Headers:**
```
Authorization: Bearer <token>
```
""
**Body:**
```json
{
  "id": "int"
}
```


## Authentication

The application uses Bearer token authentication. After successful login:
1. Token is stored in `localStorage` as `authToken`
2. Token is sent in the `Authorization` header for all admin endpoints
3. Token is automatically removed on logout

## Error Handling

The application includes fallback to localStorage when API calls fail:
- Leaderboard entries fall back to cached data
- Submissions can be stored locally if API is unavailable
- Toast notifications inform users of errors

## Implementation Files

- `/services/api.ts` - All API calls and token management
- `/App.tsx` - Data fetching and state management
- `/components/Login.tsx` - Authentication UI
- `/components/Admin.tsx` - Admin panel UI
- `/components/SubmitForm.tsx` - Submission form
- `/components/Leaderboard.tsx` - Leaderboard display
