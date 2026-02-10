# KYC Onboarding Middleware Implementation

## Overview
This implementation adds middleware protection to ensure users complete their KYC (Know Your Customer) onboarding before accessing protected pages in the application.

## Components Created/Modified

### 1. **Middleware** (`src/middleware.ts`)
- Handles authentication checks for protected routes
- Validates session cookies
- Redirects unauthenticated users to login
- Validates onboarding page access requires an ID parameter

**Protected Routes:**
- `/dashboard`
- `/account`
- `/billing`
- `/orders`
- `/onboarding`

### 2. **KYC Popup Component** (`src/app/components/dashboard/KYCPopup.tsx`)
A modal dialog that appears when users try to access protected pages without completing onboarding.

**Features:**
- Automatically shows when `showKycPopup=true` query parameter is present
- Displays warning message about KYC completion requirement
- Provides "Complete KYC Now" button that redirects to onboarding page
- "Later" button to dismiss the popup
- Cleans up URL parameters after showing

### 3. **Onboarding Guard Component** (`src/app/components/OnboardingGuard.tsx`)
A client-side wrapper component that checks onboarding status before rendering protected pages.

**Features:**
- Fetches user's onboarding status from API
- Redirects to dashboard with popup if onboarding incomplete
- Shows loading spinner during status check
- Fails open (allows access) if API call fails
- Automatically skips check for dashboard and onboarding pages

### 4. **API Endpoint** (`src/app/api/user/onboarding-status/route.ts`)
Returns the current user's onboarding status and UUID.

**Response Format:**
```json
{
  "status": "pending" | "completed" | null,
  "uuid": "onboarding-uuid" | null
}
```

### 5. **Dashboard Page** (`src/app/dashboard/page.tsx`)
Updated to:
- Fetch onboarding status on mount
- Display KYC popup when onboarding is incomplete
- Show KYC banner when validation is pending
- Disable quick actions when onboarding incomplete

### 6. **Profile Page** (`src/app/profile/page.tsx`)
Wrapped with `OnboardingGuard` to prevent access without completed onboarding.

## How It Works

### Flow for Users Without Completed Onboarding:

1. **User tries to access a protected page (e.g., `/profile`)**
   - Middleware checks if user is authenticated
   - If not authenticated → redirect to `/login`
   - If authenticated → allow request to proceed

2. **Page loads with OnboardingGuard**
   - Guard fetches onboarding status from `/api/user/onboarding-status`
   - If status is not "completed" → redirect to `/dashboard?showKycPopup=true`
   - Shows loading spinner during check

3. **Dashboard shows KYC popup**
   - `KYCPopup` component detects `showKycPopup` query parameter
   - Opens modal dialog with KYC completion message
   - User can click "Complete KYC Now" to go to onboarding
   - URL is cleaned up after popup shows

4. **Direct URL access attempts**
   - OnboardingGuard intercepts and redirects to dashboard
   - Popup appears automatically
   - User cannot bypass by typing URLs directly

### Flow for Users With Completed Onboarding:

1. User accesses any protected page
2. OnboardingGuard checks status
3. Status is "completed" → page renders normally
4. No popup or redirection occurs

## Database Schema

The implementation relies on the `Onboarding` model:

```prisma
model Onboarding {
  id            Int      @id @default(autoincrement())
  uuid          String   @unique
  userId        Int      @unique
  whmcsClientId Int?
  status        String   @default("pending") // pending | completed
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("onboarding")
}
```

## Usage

### To Protect a New Page:

1. Import the `OnboardingGuard` component:
```typescript
import { OnboardingGuard } from "@/app/components/OnboardingGuard";
```

2. Wrap your page content:
```typescript
export default function MyProtectedPage() {
  return (
    <OnboardingGuard>
      <YourPageContent />
    </OnboardingGuard>
  );
}
```

3. Add the route to middleware config if not already covered by wildcard:
```typescript
export const config = {
  matcher: [
    // ... existing routes
    "/your-new-route/:path*",
  ],
};
```

## Key Features

✅ **Prevents unauthorized access** - Users must complete KYC to access protected pages
✅ **User-friendly popup** - Clear message explaining why access is blocked
✅ **Direct URL protection** - Cannot bypass by typing URLs directly
✅ **Graceful error handling** - Fails open if API calls fail
✅ **Clean URL management** - Query parameters are cleaned up automatically
✅ **Loading states** - Shows spinner during status checks
✅ **Reusable components** - Easy to apply to new pages

## Testing Checklist

- [ ] User with incomplete onboarding cannot access `/profile`
- [ ] User with incomplete onboarding cannot access `/account`
- [ ] User with incomplete onboarding cannot access `/billing`
- [ ] User with incomplete onboarding cannot access `/orders`
- [ ] Popup appears when trying to access protected pages
- [ ] "Complete KYC Now" button redirects to onboarding page
- [ ] "Later" button dismisses popup
- [ ] Direct URL access redirects to dashboard with popup
- [ ] Users with completed onboarding can access all pages
- [ ] Dashboard shows popup on first load if onboarding incomplete
- [ ] Onboarding page is accessible regardless of status
