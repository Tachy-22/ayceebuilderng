import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import {
  // EmailTemplate,
  NewOrderEmail,
  OrderConfirmationEmail,
} from "@/components/EmailTemplate";

export async function POST(request: Request) {
  try {
    const { reference, user, items, totalAmount, location, transportFare, distance, weight } =
      await request.json();
    console.log({ reference, user, items, totalAmount, location, transportFare, distance, weight });
    // 1. Verify payment from Paystack (basic illustration):
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    //     if (!verifyRes.ok) {
    //             console.log("verification failure")

    //       return NextResponse.json(
    //         { error: "Could not verify payment" },
    //         { status: 400 }
    //       );
    //     }

    //     const verifyData = await verifyRes.json();
    //     if (verifyData?.data?.status !== "success") {
    //       console.log("verification success")
    //       return NextResponse.json(
    //         { error: "Payment verification failed" },
    //         { status: 400 }
    //       );
    //     }

    // 2. Send confirmation emails:

    
    const orderConfirmationEmailHTML = OrderConfirmationEmail({
      userName: user.name,
      userEmail: user.email,
      address: user.address,
      items,
      totalAmount,
      location,
      transportFare,
      distance,
      weight,
    });

    const newOrderEmailHTML = NewOrderEmail({
      userName: user.name,
      userEmail: user.email,
      address: user.address,
      items,
      totalAmount,
      orderId: reference.reference,
      location,
      transportFare,
      distance,
      weight,
    });

    console.log(
      "Sending email to user:",
      user.email,
      "and the company...",
      newOrderEmailHTML
    );

    // User email
    await sendEmail({
      subject: `AYCEEBUILDER Order Confirmation - ${reference.reference}`,
      content: orderConfirmationEmailHTML,
      recipients: user.email,
    });

    // Company email
    await sendEmail({
      subject: `AYCEEBUILDER New Order - ${reference.reference}`,
      content: newOrderEmailHTML,
      recipients: process.env.EMAIL_USER as string,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
