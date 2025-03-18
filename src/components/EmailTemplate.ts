interface EmailTemplateProps {
  userName: string;
  userEmail: string;
  address: string;
  items: { productName: string; unitPrice: number; quantity: number }[];
  totalAmount: number;
  location?: string;
  transportFare?: number;
  distance?: number;
  weight?: number;
}

export function OrderConfirmationEmail({
  userName,
  userEmail,
  address,
  items,
  totalAmount,
  location,
  transportFare,
  distance,
  weight,
}: EmailTemplateProps) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #F0FDF4; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://ayceebuilder.com/wp-content/uploads/2024/07/AYCEE-BUILDER-S.png" 
     alt="Ayceebuilder" 
     style="height: 40px; width: auto;" />
      </div>
      
      <h1 style="color: #065F46; text-align: center;">Order Confirmation</h1>
      <p style="color: #065F46; text-align: center;">Hello <strong>${userName}</strong>,</p>
      <p style="color: #065F46;">Thank you for your order! Here are your order details:</p>

      <div style="background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p><strong>Delivery Location:</strong> ${location || ""}</p>
     
        <p><strong>Weight:</strong> ${weight || 0} kg</p>
      </div>

      <table style="width: 100%; margin-top: 15px; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #065F46; color: white;">
            <th style="padding: 12px; text-align: left;">Product</th>
            <th style="padding: 12px; text-align: center;">Unit Price</th>
            <th style="padding: 12px; text-align: center;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              ({ productName, unitPrice, quantity }) => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 12px; color: #065F46;">${productName}</td>
                  <td style="padding: 12px; text-align: center; color: #065F46;">₦${unitPrice.toLocaleString()}</td>
                  <td style="padding: 12px; text-align: center; color: #065F46;">${quantity}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>

      <p style="text-align: right; margin-top: 15px; font-size: 18px; font-weight: bold; color: #065F46;">
        Total Amount: ₦${totalAmount.toLocaleString()}
      </p>

      <p style="margin-top: 20px; text-align: center; color: #065F46;">
        We appreciate your business! <br> Thank you for shopping with us.
      </p>

      <p style="text-align: center; color: #065F46;">
        <strong>Ayceebuilder</strong>
      </p>
    </div>
  `;
}

interface AdminEmailProps extends EmailTemplateProps {
  orderId: string;
}

export function NewOrderEmail({
  userName,
  userEmail,
  address,
  items,
  totalAmount,
  orderId,
  location,
  transportFare,
  distance,
  weight,
}: AdminEmailProps) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #ECFDF5; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
       <img src="https://ayceebuilder.com/wp-content/uploads/2024/07/AYCEE-BUILDER-S.png" 
     alt="Ayceebuilder" 
     style="height: 40px; width: auto;" />
      </div>

      <h1 style="color: #047857; text-align: center;">New Order Received</h1>
      <p style="text-align: center; color: #047857;">Order ID: <strong>${orderId}</strong></p>

      <div style="background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <p><strong>Customer:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p><strong>Delivery Location:</strong> ${location || ""}</p>
     
        <p><strong>Weight:</strong> ${weight || 0} kg</p>
      </div>

      <table style="width: 100%; margin-top: 15px; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #047857; color: white;">
            <th style="padding: 12px; text-align: left;">Product</th>
            <th style="padding: 12px; text-align: center;">Unit Price</th>
            <th style="padding: 12px; text-align: center;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              ({ productName, unitPrice, quantity }) => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 12px; color: #047857;">${productName}</td>
                  <td style="padding: 12px; text-align: center; color: #047857;">₦${unitPrice.toLocaleString()}</td>
                  <td style="padding: 12px; text-align: center; color: #047857;">${quantity}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>

      <p style="text-align: right; margin-top: 15px; font-size: 18px; font-weight: bold; color: #047857;">
        Total Amount: ₦${totalAmount.toLocaleString()}
      </p>

      <p style="margin-top: 20px; text-align: center; color: #047857;">
        A new order has been placed. Please process it as soon as possible.
      </p>

      <p style="text-align: center; color: #047857;">
        <strong>Ayceebuilder Admin Panel</strong>
      </p>
    </div>
  `;
}
