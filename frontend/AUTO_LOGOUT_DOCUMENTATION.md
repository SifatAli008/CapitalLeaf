# Auto-Logout Feature Documentation

## Overview

The auto-logout feature automatically logs out users when they:
1. **Close the browser/system** without manually logging out
2. **Remain inactive** for a specified period
3. **Exceed session timeout** limits
4. **Switch to another tab** and remain away for too long

## Features

### 🔒 **Security Features**
- **Automatic session cleanup** when browser/system closes
- **Inactivity detection** with configurable timeout
- **Session timeout** management
- **Sensitive data clearing** on logout
- **Warning system** before auto-logout

### ⚙️ **Configuration**
- **Inactivity Timeout**: 15 minutes (configurable)
- **Session Timeout**: 30 minutes (configurable)
- **Warning Time**: 2 minutes before logout
- **Hidden Page Timeout**: 5 minutes when tab is not visible

## Implementation

### 1. **AuthContext Updates** (`src/contexts/AuthContext.tsx`)
- Added auto-logout timers
- Integrated activity tracking
- Added beforeunload event handling
- Enhanced session management

### 2. **Auto-Logout Hook** (`src/hooks/useAutoLogout.ts`)
- Custom hook for auto-logout functionality
- Configurable timeouts
- Activity event listeners
- Warning callbacks

### 3. **Warning Component** (`src/components/AutoLogoutWarning.tsx`)
- User-friendly warning dialog
- Countdown timer display
- Extend session option
- Immediate logout option

### 4. **Auto-Logout Provider** (`src/components/AutoLogoutProvider.tsx`)
- Wraps the application
- Manages warning state
- Handles countdown logic

### 5. **Session Manager** (`src/utils/sessionManager.ts`)
- Centralized session management
- Timeout handling
- Data cleanup utilities
- Configuration management

## Usage

### Basic Implementation
The auto-logout is automatically enabled when you wrap your app with the `AutoLogoutProvider`:

```tsx
// In layout.tsx
<AuthProvider>
  <AutoLogoutProvider>
    {children}
  </AutoLogoutProvider>
</AuthProvider>
```

### Custom Configuration
You can customize the auto-logout behavior:

```tsx
const { resetInactivityTimer, getTimeUntilLogout } = useAutoLogout({
  inactivityTimeout: 20 * 60 * 1000, // 20 minutes
  sessionTimeout: 60 * 60 * 1000,    // 1 hour
  warningTime: 3 * 60 * 1000,        // 3 minutes warning
  onWarning: () => console.log('Warning!'),
  onLogout: () => console.log('Logging out!')
});
```

## Event Tracking

The system tracks the following user activities:
- `mousedown` - Mouse clicks
- `mousemove` - Mouse movement
- `keypress` - Keyboard input
- `keydown` - Key presses
- `scroll` - Page scrolling
- `touchstart` - Touch events
- `click` - Click events
- `focus` - Focus events

## Security Measures

### 1. **Data Cleanup**
When auto-logout occurs, the system:
- Removes all authentication cookies
- Clears sensitive data from storage
- Resets authentication state

### 2. **Before Unload Handler**
- Clears sensitive data when browser closes
- Shows confirmation dialog (optional)
- Prevents data leakage

### 3. **Visibility Change Detection**
- Shorter timeout when tab is hidden
- Automatic cleanup when page becomes visible again
- Prevents unauthorized access

## Configuration Options

### SessionManager Configuration
```typescript
interface SessionConfig {
  inactivityTimeout: number; // Inactivity timeout in milliseconds
  sessionTimeout: number;    // Maximum session duration
  warningTime: number;       // Warning time before logout
}
```

### Default Values
```typescript
const DEFAULT_SESSION_CONFIG = {
  inactivityTimeout: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 30 * 60 * 1000,    // 30 minutes
  warningTime: 2 * 60 * 1000,        // 2 minutes
};
```

## User Experience

### Warning Dialog
When the user is about to be logged out:
1. **Warning appears** 2 minutes before logout
2. **Countdown timer** shows remaining time
3. **Extend Session** button to continue working
4. **Logout Now** button for immediate logout

### Visual Feedback
- **Smooth animations** for warning dialog
- **Real-time countdown** display
- **Clear action buttons** with icons
- **Responsive design** for all devices

## Browser Compatibility

The auto-logout feature works with:
- ✅ Chrome/Chromium browsers
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Testing

### Manual Testing
1. **Login** to the application
2. **Wait** for inactivity timeout
3. **Verify** warning dialog appears
4. **Test** extend session functionality
5. **Test** immediate logout
6. **Test** browser close behavior

### Automated Testing
```typescript
// Test session timeout
const sessionManager = new SessionManager({
  sessionTimeout: 1000, // 1 second for testing
  inactivityTimeout: 500, // 0.5 seconds for testing
  warningTime: 200 // 0.2 seconds for testing
});
```

## Troubleshooting

### Common Issues

1. **Warning not appearing**
   - Check if `AutoLogoutProvider` is properly wrapped
   - Verify activity events are being tracked
   - Check console for errors

2. **Auto-logout not working**
   - Ensure `AuthContext` is properly configured
   - Check if timers are being cleared
   - Verify session data is valid

3. **Data not clearing**
   - Check cookie removal logic
   - Verify beforeunload handler
   - Test in different browsers

### Debug Mode
Enable debug logging by setting:
```typescript
localStorage.setItem('debug_auto_logout', 'true');
```

## Security Considerations

1. **Sensitive Data**: All authentication data is cleared on logout
2. **Session Validation**: Sessions are validated on each activity
3. **Timeout Management**: Multiple timeout mechanisms prevent bypass
4. **Event Tracking**: Comprehensive activity tracking prevents false timeouts

## Performance Impact

- **Minimal CPU usage** - Event listeners are lightweight
- **Memory efficient** - Timers are properly cleaned up
- **No network overhead** - All logic runs client-side
- **Responsive UI** - Non-blocking implementation

## Future Enhancements

1. **Server-side session validation**
2. **Advanced behavioral analysis**
3. **Custom warning messages**
4. **Integration with security monitoring**
5. **Multi-device session management**

---

## Quick Start

1. The auto-logout feature is already integrated into your app
2. No additional setup required
3. Users will see warnings before auto-logout
4. All sensitive data is automatically cleared

The feature works out of the box and provides comprehensive security for your application!
