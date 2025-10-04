from datetime import datetime
from app.models.assets import AssetService
from app.shared.dependencies import get_db




def build_booking_email_template(db, result, start_time: str, end_time: str) -> str:

    print("Inside build_booking_email_template", result)

    asset=AssetService.get_asset_by_id(db, result.space_asset_id, "850e8400-e29b-41d4-a716-446655440001")
    print("Asset object:", asset)
    print("Asset type:", type(asset))
    print("Asset name:", asset.name)
   
    """Generate booking confirmation email template."""
    return f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Booking Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">

        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: #4CAF50; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Booking Confirmed ✅</h1>
            </div>

            <!-- Body -->
            <div style="padding: 20px; color: #333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Your booking has been successfully created. Below are the details:</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Booking ID:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{result.id}</td>
                </tr>
                <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Contact Number:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{result.contact_number}</td>
                </tr>
                <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Date & Time:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{start_time} – {end_time}</td>
                </tr>
                <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Asset:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{asset.name}</td>                </tr>
                <tr>
                <td style="padding: 10px;"><strong>Status:</strong></td>
                <td style="padding: 10px; color: #4CAF50; font-weight: bold;">
                    {result.status.value if hasattr(result.status, "value") else result.status}
                </td>
                </tr>
            </table>

            <p style="margin-top: 20px; font-size: 14px; color: #777;">
                Thank you for booking with us. We look forward to seeing you!
            </p>
            </div>

            <!-- Footer -->
            <div style="background: #f4f6f8; padding: 15px; text-align: center; font-size: 12px; color: #999;">
            © {datetime.now().year} Your Company. All rights reserved.
            </div>

        </div>

        </body>
        </html>
    """