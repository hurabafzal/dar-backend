# Twilio WhatsApp Setup for Quotations

## Required Environment Variables

Make sure these environment variables are set in your backend `.env` file:

```env
# Twilio Account Credentials
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_ACCOUNT_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number  # Format: +1234567890

# Twilio Content Template SID for Quotations
TWILIO_QUOTATION_CONTENT_SID=your_quotation_content_template_sid

# Country Code (for phone number formatting)
COUNTRY_CODE=+965  # Kuwait default, adjust as needed

# Backend URL (for PDF download link in WhatsApp message)
BACKEND_URL=https://darkw.ai/api  # or your backend URL
```

## How to Check if WhatsApp is Working

1. **Check Backend Logs**: When creating a quotation, look for these log messages:
   - `📱 sendQuotationWhatsApp called with:` - Confirms function is called
   - `🔑 Twilio config check:` - Shows if credentials are configured
   - `✅ WhatsApp message sent successfully:` - Confirms message was sent
   - `❌ Error sending WhatsApp message` - Shows any errors

2. **Common Issues**:
   - Missing environment variables → Check `🔑 Twilio config check:` in logs
   - Invalid phone number format → Should start with +965 or +92
   - Missing Content Template SID → Check Twilio console
   - Twilio account not approved for WhatsApp → Check Twilio dashboard

3. **Phone Number Format**:
   - Kuwait: `+965XXXXXXXX` or `965XXXXXXXX` (will be auto-formatted)
   - Pakistan: `+92XXXXXXXXXX`
   - Other: Will use `COUNTRY_CODE` environment variable

## Testing

1. Create a quotation with a valid phone number
2. Check backend console logs for WhatsApp sending status
3. Verify the phone number format is correct
4. Check Twilio dashboard for message delivery status

## Note

The quotation will be created successfully even if WhatsApp sending fails (non-blocking error handling). Check backend logs to see if WhatsApp was actually sent.

