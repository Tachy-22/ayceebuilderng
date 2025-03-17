// ...existing code...
export function getPaystackConfig(email: string, amount: number) {
  return {
    email,
    amount,
    publicKey: "pk_test_9426c6bc564571909c4705b1f66b776496f38015",
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
