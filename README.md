# SuperChat - Advanced Authentication System

A comprehensive chat application with advanced authentication features including phone OTP, email magic links, wallet authentication, account linking, and device management.

## Features

### 🔐 Authentication Methods
- **Phone Number OTP**: Secure SMS-based authentication
- **Email Magic Links**: Passwordless email authentication
- **Wallet Authentication**: Sign-in with Ethereum (SIWE)
- **Traditional Email/Password**: Standard credential-based auth
- **Social Login**: Google and GitHub OAuth

### 🔗 Account Linking
- Link multiple phone numbers to one account
- Link multiple wallet addresses to one account
- Link multiple email addresses to one account
- Unified account management

### 📱 Device Management
- Register and manage trusted devices
- QR code verification for new devices
- Device fingerprinting and tracking
- Secure device removal

### 🛡️ Security Features
- JWT-based authentication
- Secure token management
- Device verification
- Account recovery options

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js, JWT, SIWE
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Twilio account (for SMS OTP)
- SMTP service (for email magic links)
- MetaMask or similar wallet (for wallet auth)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/superchat"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Twilio (SMS OTP)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="your-twilio-phone-number"

# SMTP (Email Magic Links)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd superchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication

#### Phone OTP
- `POST /api/auth/phone/send-otp` - Send OTP to phone number
- `POST /api/auth/phone/verify-otp` - Verify OTP and authenticate

#### Email Magic Links
- `POST /api/auth/email/send-magic-link` - Send magic link to email
- `POST /api/auth/email/verify-magic-link` - Verify magic link

#### Wallet Authentication
- `POST /api/auth/wallet/nonce` - Generate nonce for wallet signature
- `POST /api/auth/wallet/verify` - Verify wallet signature

### Account Linking
- `POST /api/auth/link/phone` - Link phone number to account
- `POST /api/auth/link/wallet` - Link wallet address to account

### Device Management
- `POST /api/auth/device/register` - Register new device
- `GET /api/auth/device/list` - List user devices
- `POST /api/auth/device/verify` - Verify device with QR code
- `POST /api/auth/device/trust` - Trust device after verification
- `DELETE /api/auth/device/[deviceId]` - Remove device

## Usage

### Phone OTP Authentication

1. Navigate to the sign-in page
2. Select the "Phone" tab
3. Enter your phone number
4. Click "Send OTP"
5. Enter the 6-digit code received via SMS
6. Click "Verify OTP"

### Email Magic Link Authentication

1. Navigate to the sign-in page
2. Select the "Magic Link" tab
3. Enter your email address
4. Click "Send Magic Link"
5. Check your email and click the link
6. You'll be automatically signed in

### Wallet Authentication

1. Navigate to the sign-in page
2. Select the "Wallet" tab
3. Enter your Ethereum wallet address
4. Click "Connect Wallet"
5. Sign the message in MetaMask
6. You'll be automatically signed in

### Account Linking

1. Sign in to your account
2. Go to Settings > Security
3. Click "Link" next to the method you want to add
4. Follow the verification process
5. Your accounts will be linked

### Device Management

1. Sign in to your account
2. Go to Settings > Devices
3. Click "Register This Device" to add current device
4. Use QR codes to verify new devices
5. Manage trusted devices from the list

## Development

### Database Schema

The application uses Prisma with the following main models:

- **User**: Main user account with multiple auth methods
- **OTPCode**: Phone OTP codes for verification
- **MagicLink**: Email magic link tokens
- **Device**: User devices with trust status
- **Account**: OAuth provider accounts
- **Session**: User sessions

### Adding New Authentication Methods

1. Add the provider to the Prisma schema
2. Create API routes for the new method
3. Add UI components for the new method
4. Update the AuthTabs component
5. Add account linking support if needed

### Customization

#### Styling
- Modify `tailwind.config.ts` for theme customization
- Update CSS classes in components for styling changes
- Add new UI components as needed

#### Authentication Flow
- Modify API routes in `/src/app/api/auth/`
- Update authentication logic in `/src/lib/auth.ts`
- Customize UI components in `/src/components/auth/`

## Security Considerations

- All sensitive data is encrypted
- JWT tokens have appropriate expiration times
- OTP codes expire after 10 minutes
- Magic links expire after 15 minutes
- Device verification uses QR codes with short-lived tokens
- Rate limiting should be implemented for production

## Production Deployment

1. **Set up production database**
   - Use a managed PostgreSQL service
   - Configure connection pooling

2. **Configure environment variables**
   - Use production OAuth credentials
   - Set up production Twilio account
   - Configure production SMTP service

3. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS/GCP/Azure

4. **Set up monitoring and logging**
   - Monitor authentication attempts
   - Log security events
   - Set up error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## Roadmap

- [ ] Multi-factor authentication
- [ ] Biometric authentication
- [ ] Advanced device fingerprinting
- [ ] Account recovery options
- [ ] Audit logging
- [ ] Admin dashboard
- [ ] API rate limiting
- [ ] Webhook support
