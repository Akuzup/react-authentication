# ReactCore Auth - Example Project

Đây là project example để demo các tính năng của `@inspireui/reactore-auth` module.

## 🚀 Cách chạy project

### 1. Cài đặt dependencies

```bash
# Từ thư mục examples
npm install

# Hoặc nếu bạn ở thư mục root
cd examples && npm install
```

### 2. Cấu hình Firebase

1. Tạo project Firebase tại [Firebase Console](https://console.firebase.google.com/)
2. Bật Authentication và các provider cần thiết (Email/Password, Google)
3. Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

4. Điền thông tin Firebase vào file `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 3. Build auth module (nếu cần)

```bash
# Từ thư mục root
npm run build
```

### 4. Chạy development server

```bash
# Từ thư mục examples
npm run dev
```

Project sẽ chạy tại `http://localhost:3000`

## 📁 Cấu trúc project

```
examples/
├── src/
│   ├── components/          # Shared components
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Toaster.tsx
│   ├── config/             # Configuration
│   │   └── auth-config.ts
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── router/             # Routing
│   │   └── AppRouter.tsx
│   ├── styles/             # Global styles
│   │   └── globals.css
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
└── .env.example            # Environment variables example
```

## 🎯 Tính năng được demo

### Authentication Methods
- ✅ Email & Password login/register
- ✅ Google OAuth
- ✅ SMS/Phone (cấu hình sẵn)
- ✅ Remember me functionality

### UI Components
- ✅ `LoginForm` - Form đăng nhập hoàn chỉnh
- ✅ `RegisterForm` - Form đăng ký với validation
- ✅ `AuthGuard` - Bảo vệ route yêu cầu authentication
- ✅ Navigation với auth state
- ✅ Toast notifications

### User Management
- ✅ Profile page với thông tin user
- ✅ Update profile (display name, phone)
- ✅ Email verification
- ✅ Password reset
- ✅ Account security info

### Developer Experience
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ React Router integration
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

## 🧪 Test Credentials

Để test nhanh, bạn có thể sử dụng:

**Email/Password:**
- Email: `demo@example.com`
- Password: `demo123456`

**Google Sign-in:**
- Sử dụng tài khoản Google bất kỳ (cần cấu hình Firebase)

## 📚 Cách sử dụng Auth Module

### 1. Setup AuthProvider

```tsx
import { AuthProvider } from '@inspireui/reactore-auth'
import { authConfig } from './config/auth-config'

function App() {
  return (
    <AuthProvider config={authConfig}>
      <YourApp />
    </AuthProvider>
  )
}
```

### 2. Sử dụng useAuth hook

```tsx
import { useAuth } from '@inspireui/reactore-auth'

function Component() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    register 
  } = useAuth()

  // Component logic
}
```

### 3. Bảo vệ routes

```tsx
import { AuthGuard } from '@inspireui/reactore-auth'

function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true}>
      <YourProtectedContent />
    </AuthGuard>
  )
}
```

### 4. Sử dụng components có sẵn

```tsx
import { LoginForm, RegisterForm } from '@inspireui/reactore-auth'

function LoginPage() {
  return (
    <LoginForm
      onSuccess={() => navigate('/')}
      showGoogleLogin={true}
      showRememberMe={true}
    />
  )
}
```

## 🛠️ Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

## 🔧 Customization

### Styling
- Project sử dụng Tailwind CSS
- Có thể customize theme trong `tailwind.config.js`
- Global styles trong `src/styles/globals.css`

### Auth Configuration
- Cấu hình auth trong `src/config/auth-config.ts`
- Có thể thay đổi providers, redirect URLs, error messages, etc.

### Components
- Tất cả components đều có thể customize
- Sử dụng Tailwind classes hoặc custom CSS

## 📖 Documentation

Xem thêm documentation chi tiết tại:
- [Auth Module README](../README.md)
- [Implementation Summary](../docs/implementation-summary.md)
- [Module Authentication Plan](../docs/module-authentication-plan.md)

## 🐛 Troubleshooting

### Firebase Configuration
- Đảm bảo đã enable Authentication trong Firebase Console
- Kiểm tra các provider đã được bật (Email/Password, Google)
- Verify domain trong Firebase settings

### Build Issues
- Chạy `npm run build` từ thư mục root trước
- Đảm bảo TypeScript không có lỗi
- Kiểm tra import paths

### Runtime Errors
- Kiểm tra console để xem error details
- Verify Firebase config trong `.env`
- Đảm bảo auth module đã được build

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console errors
2. Verify Firebase configuration
3. Đọc documentation
4. Tạo issue trên GitHub repository
