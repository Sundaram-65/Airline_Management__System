
const getTicketTemplate = (data) => `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e0e0e0;">

      <!-- Header -->
      <tr><td style="background:#1e1b4b;padding:28px 32px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:20px;">SkyBooker Airlines</h1>
        <p style="color:#c7d2fe;margin:4px 0 0;font-size:12px;">Boarding Pass & Ticket</p>
      </td></tr>

      <!-- Intro -->
      <tr><td style="padding:20px 24px 8px;">
        <p style="font-size:13px;color:#4b5563;line-height:1.7;margin:0;">
          Your boarding pass is ready. Present this at the airport counter or use mobile check-in.
        </p>
      </td></tr>

      <!-- Ticket Card -->
      <tr><td style="padding:0 24px;">
        <table width="100%" style="border:1px solid #e0e7ff;border-radius:8px;overflow:hidden;">
          
          <!-- Route -->
          <tr><td style="background:#eef2ff;padding:16px 20px;">
            <table width="100%">
              <tr>
                <td style="font-size:22px;font-weight:bold;color:#1e1b4b;">${data.from || 'DEL'}</td>
                <td style="text-align:center;color:#818cf8;font-size:20px;">&#8594;</td>
                <td style="font-size:22px;font-weight:bold;color:#1e1b4b;text-align:right;">${data.to || 'BOM'}</td>
                <td style="text-align:right;">
                  <span style="background:#e0e7ff;color:#3730a3;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:bold;">${data.class || 'Economy'}</span>
                </td>
              </tr>
            </table>
          </td></tr>

          <!-- Details Grid -->
          <tr><td style="border-top:1px dashed #c7d2fe;">
            <table width="100%" style="font-size:12px;">
              <tr>
                <td style="padding:12px 20px;border-right:1px solid #e0e7ff;">
                  <span style="display:block;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Passenger</span>
                  <strong style="color:#1e1b4b;">${data.passengerName || 'Passenger'}</strong>
                </td>
                <td style="padding:12px 20px;border-right:1px solid #e0e7ff;">
                  <span style="display:block;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Flight</span>
                  <strong style="color:#1e1b4b;">${data.flightNumber || 'SK-204'}</strong>
                </td>
                <td style="padding:12px 20px;">
                  <span style="display:block;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Seat</span>
                  <strong style="color:#1e1b4b;">${data.seat || '14A'}</strong>
                </td>
              </tr>
              <tr style="border-top:1px solid #e0e7ff;">
                <td style="padding:12px 20px;border-right:1px solid #e0e7ff;">
                  <span style="display:block;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Departure</span>
                  <strong style="color:#1e1b4b;">${data.departureTime || '08:30 AM'}</strong>
                </td>
                <td style="padding:12px 20px;border-right:1px solid #e0e7ff;">
                  <span style="display:block;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Date</span>
                  <strong style="color:#1e1b4b;">${data.date || new Date().toDateString()}</strong>
                </td>
                <td style="padding:12px 20px;">
                  <span style="display:block;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Booking ID</span>
                  <strong style="color:#1e1b4b;">#${data.bookingId || 'BK0000'}</strong>
                </td>
              </tr>
            </table>
          </td></tr>

        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f5f3ff;padding:16px 24px;text-align:center;border-top:1px solid #e0e7ff;margin-top:16px;">
        <p style="margin:0;font-size:12px;color:#4f46e5;font-weight:bold;">SkyBooker Airlines</p>
        <p style="margin:4px 0 0;font-size:11px;color:#6b7280;">© ${new Date().getFullYear()} SkyBooker. All rights reserved.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

module.exports = getTicketTemplate;