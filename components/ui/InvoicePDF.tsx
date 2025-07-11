// components/ui/InvoicePDF.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface InvoiceItem {
  id: number;
  description: string;
  qty: number;
  rate: number;
}

interface InvoiceData {
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxValue: number;
  discountAmt: number;
  shippingFee: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  logo?: string; // base64
  notes?: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 30,
    fontSize: 11,
    lineHeight: 1.5,
    color: "#333",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  leftCol: {
    width: "50%",
    paddingRight: 10,
  },
  rightCol: {
    width: "50%",
    paddingLeft: 10,
    alignItems: "flex-end",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  header: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  col6: { width: "50%" },
  col2: { width: "16.6%", textAlign: "right" },
  totalRow: {
    marginTop: 10,
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
  notes: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
});

const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  const {
    fromName,
    fromAddress,
    toName,
    toAddress,
    invoiceNumber,
    date,
    dueDate,
    items,
    subtotal,
    taxValue,
    discountAmt,
    shippingFee,
    total,
    amountPaid,
    balanceDue,
    currency,
    logo,
    notes,
  } = data;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Row: Invoice details (left) and Addresses (right) */}
        {logo && <Image style={styles.logo} src={logo} />}
        <View style={styles.headerRow}>
          <View style={styles.leftCol}>
            <Text style={styles.title}>Invoice</Text>
            <Text>Invoice #: {invoiceNumber}</Text>
            <Text>Date: {new Date(date).toLocaleDateString()}</Text>
            <Text>Due Date: {new Date(dueDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.bold}>From:</Text>
            <Text>{fromName}</Text>
            <Text>{fromAddress}</Text>
            <Text style={{ marginTop: 10, ...styles.bold }}>Bill To:</Text>
            <Text>{toName}</Text>
            <Text>{toAddress}</Text>
          </View>
        </View>
        {/* Items Table */}
        <View style={[styles.section, styles.table]}>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.col6}>Description</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col2}>Rate</Text>
            <Text style={styles.col2}>Amount</Text>
          </View>

          {items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.col6}>{item.description}</Text>
              <Text style={styles.col2}>{item.qty}</Text>
              <Text style={styles.col2}>{formatCurrency(item.rate)}</Text>
              <Text style={styles.col2}>
                {formatCurrency(item.qty * item.rate)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text>Subtotal: {formatCurrency(subtotal)}</Text>
          {taxValue > 0 && <Text>Tax: {formatCurrency(taxValue)}</Text>}
          {discountAmt > 0 && (
            <Text>Discount: -{formatCurrency(discountAmt)}</Text>
          )}
          {shippingFee > 0 && (
            <Text>Shipping: {formatCurrency(shippingFee)}</Text>
          )}
          <Text style={styles.bold}>Total: {formatCurrency(total)}</Text>
          {amountPaid > 0 && (
            <Text>Amount Paid: {formatCurrency(amountPaid)}</Text>
          )}
          <Text style={[styles.bold, { color: "#1e3a8a" }]}>
            Balance Due: {formatCurrency(balanceDue)}
          </Text>
        </View>

        {/* Notes */}
        {notes && (
          <View style={styles.notes}>
            <Text style={styles.bold}>Notes</Text>
            <Text>{notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
