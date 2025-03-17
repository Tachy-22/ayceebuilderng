// ...existing code...
export function getPaystackConfig(email: string, amount: number) {
  return {
    email,
    amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Email",
          variable_name: "customer_email",
          value: email,
        },
      ],
    },
  };
}
// ...existing code...
