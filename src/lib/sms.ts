import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio credentials not configured');
      return false;
    }

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
};

export const sendOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  const message = `Your SuperChat verification code is: ${otp}. This code will expire in 10 minutes.`;
  return await sendSMS(phoneNumber, message);
};

// For development/testing without Twilio
export const sendOTPDev = async (phoneNumber: string, otp: string): Promise<boolean> => {
  console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);
  return true;
};
