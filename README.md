# React Authentication Module

A complete, reusable React authentication module built with Clean Architecture principles. Supports Firebase Auth with email/password, Google OAuth, and SMS authentication.

## Features

- 🔐 **Multiple Authentication Methods**: Email/password, Google OAuth, SMS
- 🏗️ **Clean Architecture**: Separation of concerns with clear boundaries
- ⚛️ **React Integration**: Context providers, hooks, and components
- 🔒 **Route Protection**: AuthGuard components for protected routes
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Customizable**: Configurable UI, themes, and behavior
- 🔧 **TypeScript**: Full type safety and IntelliSense support
- 🧪 **Testable**: Dependency injection for easy testing
- 📦 **Reusable**: Independent module for multiple projects

## Quick Start

### Installation

```bash
npm install @your-org/react-auth-module
# or
yarn add @your-org/react-auth-module
```

### Basic Setup

1. **Configure the module**:

```typescript
import { AuthConfig } from '@your-org/react-auth-module'

const authConfig: AuthConfig = {
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id"
  },
  providers: {
    emailPassword: { enabled: true },
    google: { enabled: true },
    sms: { enabled: true }
  },
  storage: {
    tokenKey: 'auth_token',
    userKey: 'auth_user',
    prefix: 'myapp_'
  },
  redirectUrls: {
    afterLogin: '/',
    afterLogout: '/login',
    afterRegister: '/welcome'
  }
}
```

2. **Wrap your app with AuthProvider**:

```tsx
import { AuthProvider } from '@your-org/react-auth-module'
import { authConfig } from './auth-config'

function App() {
  return (
    <AuthProvider config={authConfig}>
      <YourApp />
    </AuthProvider>
  )
}
```

3. **Use authentication in components**:

```tsx
import { useAuth, LoginForm, ProtectedRoute } from '@your-org/react-auth-module'

function LoginPage() {
  const { login } = useAuth()
  
  return (
    <LoginForm 
      onSuccess={() => navigate('/')}
      showGoogleLogin={true}
    />
  )
}

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <YourProtectedContent />
    </ProtectedRoute>
  )
}
```

## API Reference

### Hooks

#### `useAuth()`
Main authentication hook providing complete auth API.

```tsx
const {
  user,
  isLoading,
  isAuthenticated,
  login,
  loginWithGoogle,
  register,
  logout
} = useAuth()
```

#### `useAuthState()`
Hook for authentication state only (no actions).

```tsx
const { user, isLoading, isAuthenticated, error } = useAuthState()
```

#### `useAuthActions()`
Hook for authentication actions only (no state).

```tsx
const { login, register, logout } = useAuthActions()
```

### Components

#### `<AuthProvider>`
Root provider component that initializes the authentication module.

```tsx
<AuthProvider 
  config={authConfig}
  onAuthStateChange={(state) => console.log(state)}
  onError={(error) => console.error(error)}
>
  {children}
</AuthProvider>
```

#### `<LoginForm>`
Complete login form with validation and multiple auth methods.

```tsx
<LoginForm
  onSuccess={() => navigate('/')}
  onError={(error) => showError(error)}
  showRememberMe={true}
  showGoogleLogin={true}
  className="custom-styles"
/>
```

#### `<RegisterForm>`
Complete registration form with validation.

```tsx
<RegisterForm
  onSuccess={() => navigate('/welcome')}
  showDisplayName={true}
  requireTermsAcceptance={true}
/>
```

#### `<AuthGuard>`
Flexible route protection component.

```tsx
<AuthGuard 
  requireAuth={true}
  requireEmailVerification={true}
  requiredPermissions={['admin']}
  fallback={<LoginPage />}
>
  {children}
</AuthGuard>
```

#### Convenience Components

```tsx
// Simple protected route
<ProtectedRoute fallback={<LoginPage />}>
  {children}
</ProtectedRoute>

// Email verified route
<VerifiedRoute>
  {children}
</VerifiedRoute>

// Public only route (redirect if authenticated)
<PublicRoute>
  {children}
</PublicRoute>
```

## Configuration

### Firebase Setup

```typescript
const authConfig: AuthConfig = {
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    // ... other Firebase config
  }
}
```

### Provider Configuration

```typescript
providers: {
  emailPassword: {
    enabled: true,
    requireEmailVerification: true,
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true
    }
  },
  google: {
    enabled: true,
    scopes: ['email', 'profile']
  },
  sms: {
    enabled: true,
    timeout: 60,
    codeLength: 6
  }
}
```

### UI Customization

```typescript
ui: {
  theme: 'light', // 'light' | 'dark' | 'auto'
  language: 'en',
  customStyles: {
    primaryColor: '#3B82F6',
    borderRadius: '0.375rem'
  }
}
```

## Examples

See the `/examples` directory for complete integration examples:

- `current-project-config.ts` - Configuration for existing project
- `App-with-auth.tsx` - App integration example
- `pages/LoginPage.tsx` - Login page example
- `pages/RegisterPage.tsx` - Registration page example
- `pages/ProfilePage.tsx` - User profile example

## Architecture

This module follows Clean Architecture principles:

```
├── core/                 # Business Logic Layer
│   ├── entities/        # Domain entities (User, AuthState, etc.)
│   ├── usecases/        # Application use cases
│   └── interfaces/      # Repository & service interfaces
├── infrastructure/      # External Layer
│   ├── firebase/        # Firebase implementation
│   ├── storage/         # Local storage implementation
│   └── validation/      # Validation implementation
├── adapters/           # Interface Adapters
│   ├── repositories/   # Repository implementations
│   ├── services/       # Service implementations
│   └── container/      # Dependency injection
├── presentation/       # Presentation Layer
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   └── providers/      # Context providers
└── config/            # Configuration
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/react-auth-module/issues)
- Documentation: [Full documentation](https://your-org.github.io/react-auth-module)
