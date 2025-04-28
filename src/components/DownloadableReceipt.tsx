import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#065F46",
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#F0FDF4",
    padding: 8,
    color: "#065F46",
  },
  userDetails: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#F0FDF4",
    fontWeight: "bold",
    color: "#065F46",
  },
  col1: {
    flex: 3,
    paddingRight: 5,
  },
  col2: {
    flex: 1,
    textAlign: "center",
  },
  col3: {
    flex: 1,
    textAlign: "center",
  },
  col4: {
    flex: 1,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 8,
  },
  totalText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 8,
  },
  totalAmount: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6B7280",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  bold: {
    fontWeight: "bold",
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
  },
  thankyou: {
    marginTop: 30,
    fontSize: 12,
    color: "#065F46",
    textAlign: "center",
  },
  inline: {
    flexDirection: "row",
    marginBottom: 5,
  },
  metadata: {
    flex: 1,
  },
});

// Receipt Document component
const ReceiptDocument = ({ orderData }: { orderData: any }) => {
  // Calculate subtotal manually from order items
  const subtotal = orderData.items.reduce((total: number, item: any) => {
    return total + item.unitPrice * item.quantity;
  }, 0);

  // Calculate tax (7.5% of subtotal)
  const tax = subtotal * 0.075;

  // Ensure transport fare is a number
  const transportFare = orderData.transportFare || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            src="https://ayceebuilder.com/aycee-logo.png"
            style={styles.logo}
          />
          <Text style={styles.title}>Official Receipt</Text>
          <Text style={styles.subtitle}>Thank you for your purchase</Text>
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <View style={styles.metadata}>
            <Text style={styles.label}>ORDER DATE</Text>
            <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.metadata}>
            <Text style={styles.label}>ORDER ID</Text>
            <Text style={styles.value}>{orderData.reference || "N/A"}</Text>
          </View>
          <View style={styles.metadata}>
            <Text style={styles.label}>PAYMENT METHOD</Text>
            <Text style={styles.value}>Paystack</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.userDetails}>
            <View style={styles.inline}>
              <Text style={[styles.label, { width: 80 }]}>Name:</Text>
              <Text style={styles.value}>{orderData.user.name}</Text>
            </View>
            <View style={styles.inline}>
              <Text style={[styles.label, { width: 80 }]}>Email:</Text>
              <Text style={styles.value}>{orderData.user.email}</Text>
            </View>
            <View style={styles.inline}>
              <Text style={[styles.label, { width: 80 }]}>Address:</Text>
              <Text style={styles.value}>{orderData.user.address}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.userDetails}>
            <View style={styles.inline}>
              <Text style={[styles.label, { width: 100 }]}>Distance:</Text>
              <Text style={styles.value}>{orderData.distance || 0} km</Text>
            </View>
            <View style={styles.inline}>
              <Text style={[styles.label, { width: 100 }]}>Weight:</Text>
              <Text style={styles.value}>{orderData.weight || 0} kg</Text>
            </View>
            <View style={styles.inline}>
              <Text style={[styles.label, { width: 100 }]}>
                Transport Fare:
              </Text>
              <Text style={styles.value}>
                N{transportFare.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Order items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={styles.col1}>Product</Text>
            <Text style={styles.col2}>Unit Price</Text>
            <Text style={styles.col3}>Quantity</Text>
            <Text style={styles.col4}>Total</Text>
          </View>

          {/* Table Rows */}
          {orderData.items &&
            orderData.items.map((item: any, index: number) => (
              <View key={index} style={styles.row}>
                <Text style={styles.col1}>{item.productName}</Text>
                <Text style={styles.col2}>
                  N{item.unitPrice.toLocaleString()}
                </Text>
                <Text style={styles.col3}>{item.quantity}</Text>
                <Text style={styles.col4}>
                  N{(item.unitPrice * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.row}>
            <Text style={styles.col1}>Subtotal</Text>
            <Text style={styles.col4}>N{subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.col1}>VAT (7.5%)</Text>
            <Text style={styles.col4}>N{tax.toLocaleString()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.col1}>Delivery Fee</Text>
            <Text style={styles.col4}>N{transportFare.toLocaleString()}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              N{orderData.totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Thank you note */}
        <View style={styles.thankyou}>
          <Text>Thank you for shopping with Ayceebuilder!</Text>
          <Text>
            For any inquiries, please contact our customer service at
            aycee20@ayceebuilder.com
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            © {new Date().getFullYear()} Ayceebuilder. All rights reserved.
          </Text>
          <Text>This is an official receipt for your purchase.</Text>
        </View>
      </Page>
    </Document>
  );
};

// Updated interface to match Paystack response format
interface DownloadableReceiptProps {
  orderData: {
    reference: string;
    user: {
      name: string;
      email: string;
      address: string;
    };
    items: {
      productName: string;
      unitPrice: number;
      quantity: number;
    }[];
    totalAmount: number;
    transportFare?: number;
    distance?: number;
    weight?: number;
  };
}

const DownloadableReceipt = ({ orderData }: DownloadableReceiptProps) => {
  // Generate a safe filename
  const fileName = `ayceebuilder-receipt-${
    orderData.reference || new Date().getTime()
  }.pdf`;

  // Ensure we have all required data in the correct format
  const safeOrderData = {
    ...orderData,
    items: Array.isArray(orderData.items) ? orderData.items : [],
    transportFare: orderData.transportFare || 0,
    distance: orderData.distance || 0,
    weight: orderData.weight || 0,
    totalAmount: orderData.totalAmount || 0,
  };

  return (
    <PDFDownloadLink
      document={<ReceiptDocument orderData={safeOrderData} />}
      fileName={fileName}
      style={{ textDecoration: "none" }}
    >
      {({ blob, url, loading, error }) => (
        <Button variant="outline" className="w-full mt-4" disabled={loading}>
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? "Generating receipt..." : "Download Receipt"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadableReceipt;
