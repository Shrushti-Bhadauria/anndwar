/**
 * Real SMS & WhatsApp Notification Service
 * Supports:
 * 1. Universal WhatsApp deep-links (wa.me) - 100% Free, opens directly in WhatsApp app/web
 * 2. Fast2SMS Indian SMS Gateway (via FAST2SMS_API_KEY) - Sends real SMS directly to mobile phones
 * 3. Twilio SMS / WhatsApp API (via TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
 */

export function cleanIndianPhone(phone: string | number | undefined | null): string {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '919826199999';
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length > 10) return `91${digits.slice(-10)}`;
  return `91${digits}`;
}

export function buildWhatsAppUrl(phone: string | number | undefined | null, message: string): string {
  const clean = cleanIndianPhone(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export async function dispatchRealNotification(phone: string, message: string, title?: string): Promise<{
  phone: string;
  waUrl: string;
  smsSent: boolean;
  gateway: string;
  error?: string;
}> {
  const cleanPhone = cleanIndianPhone(phone);
  const waUrl = buildWhatsAppUrl(cleanPhone, message);
  const tenDigit = cleanPhone.slice(-10);

  console.log(`\n======================================================`);
  console.log(`📲 [REAL NOTIFICATION DISPATCH]`);
  console.log(`📞 Recipient: +91 ${tenDigit}`);
  console.log(`🏷️ Header: ${title || 'AnnDwar - Kisan se Desh Tak'}`);
  console.log(`💬 Content: ${message}`);
  console.log(`🔗 Universal WhatsApp Link: ${waUrl}`);
  console.log(`======================================================\n`);

  let smsSent = false;
  let gateway = 'whatsapp_deep_link';
  let error: string | undefined;

  // 1. Check for Fast2SMS Gateway (Most popular Indian free/quick SMS gateway)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const resp = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          flash: 0,
          numbers: tenDigit
        })
      });
      const data = await resp.json();
      if (data && data.return === true) {
        smsSent = true;
        gateway = 'Fast2SMS';
        console.log(`✅ [Fast2SMS] SMS sent successfully to +91 ${tenDigit}! Request ID:`, data.request_id);
      } else {
        error = data?.message?.[0] || 'Fast2SMS dispatch failed';
        console.warn(`⚠️ [Fast2SMS] Warning:`, data);
      }
    } catch (e: any) {
      error = e.message;
      console.error(`❌ [Fast2SMS] Network error:`, e.message);
    }
  }

  // 2. Check for Twilio Gateway
  if (!smsSent && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams({
        To: `+91${tenDigit}`,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: message
      });
      const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      const twData = await resp.json();
      if (twData.sid) {
        smsSent = true;
        gateway = 'Twilio';
        console.log(`✅ [Twilio] SMS sent successfully to +91 ${tenDigit}! SID:`, twData.sid);
      } else {
        error = twData?.message || 'Twilio dispatch failed';
        console.warn(`⚠️ [Twilio] Warning:`, twData);
      }
    } catch (e: any) {
      error = e.message;
      console.error(`❌ [Twilio] Error:`, e.message);
    }
  }

  return {
    phone: cleanPhone,
    waUrl,
    smsSent,
    gateway,
    error
  };
}
