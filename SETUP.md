# Setup Guide for SuperChat Authentication System

## Quick Start

### 1. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/superchat"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional for basic functionality)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Twilio (SMS OTP) - Optional for development
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="your-twilio-phone-number"

# SMTP (Email Magic Links) - Optional for development
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 2. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a database named `superchat`
3. Update the DATABASE_URL in `.env.local`

#### Option B: Cloud Database (Recommended)
1. Use a service like Supabase, Railway, or Neon
2. Get your connection string
3. Update the DATABASE_URL in `.env.local`

### 3. Run Database Migration

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

## Feature Configuration

### Phone OTP Authentication

For production SMS functionality:
1. Sign up for a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env.local`

For development:
- The system will log OTP codes to the console
- No Twilio account required

### Email Magic Links

For production email functionality:
1. Set up an SMTP service (Gmail, SendGrid, etc.)
2. Add SMTP credentials to `.env.local`

For development:
- The system will log magic links to the console
- No SMTP setup required

### Wallet Authentication

1. Users need MetaMask or similar wallet installed
2. No additional configuration required
3. Works with any Ethereum-compatible wallet

## Testing the System

### 1. Phone OTP Test
1. Go to `/auth/signin`
2. Select "Phone" tab
3. Enter a phone number
4. Check console for OTP code
5. Enter the code to sign in

### 2. Email Magic Link Test
1. Go to `/auth/signin`
2. Select "Magic Link" tab
3. Enter an email address
4. Check console for magic link
5. Click the link to sign in

### 3. Wallet Authentication Test
1. Go to `/auth/signin`
2. Select "Wallet" tab
3. Enter a wallet address
4. Sign the message in MetaMask
5. You'll be signed in

### 4. Account Linking Test
1. Sign in to your account
2. Go to `/settings`
3. Navigate to Security tab
4. Try linking additional authentication methods

### 5. Device Management Test
1. Sign in to your account
2. Go to `/settings`
3. Navigate to Devices tab
4. Register and manage devices

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists
- Check firewall settings

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure OAuth providers are configured correctly

### SMS/Email Issues
- Check Twilio/SMTP credentials
- Verify phone numbers are in correct format
- Check email addresses are valid
- Review service quotas and limits

## Production Deployment

### 1. Environment Variables
- Use strong, unique secrets
- Set up production database
- Configure production OAuth apps
- Use production Twilio/SMTP services

### 2. Security Considerations
- Enable HTTPS
- Set up rate limiting
- Configure CORS properly
- Monitor authentication attempts
- Set up logging and monitoring

### 3. Performance
- Use connection pooling for database
- Set up CDN for static assets
- Configure caching strategies
- Monitor API response times

## Support

For issues and questions:
1. Check the console for error messages
2. Review the README.md file
3. Check the API documentation
4. Create an issue in the repository
