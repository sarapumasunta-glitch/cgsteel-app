import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1F2328" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  companyName: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  muted: { color: "#5D6673", marginTop: 2 },
  quoteTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "right" },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#0F3D5E",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#0F3D5E",
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 6,
  },
  colDesc: { width: "46%" },
  colQty: { width: "12%", textAlign: "right" },
  colPrice: { width: "20%", textAlign: "right" },
  colSubtotal: { width: "22%", textAlign: "right" },
  totalsBox: { marginTop: 12, alignSelf: "flex-end", width: 220 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsLabel: { color: "#5D6673" },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#0F3D5E",
    marginTop: 4,
    paddingTop: 6,
  },
  grandTotalText: { fontFamily: "Helvetica-Bold", fontSize: 12, color: "#0F3D5E" },
});

function formatMoney(value: number) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export type QuotePdfData = {
  quote_number: string;
  created_at: string;
  valid_until: string | null;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
};

export type QuotePdfClient = {
  contact_name: string;
  company_name: string | null;
  ruc: string | null;
  phone: string | null;
  email: string | null;
};

export type QuotePdfItem = {
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number | null;
};

export default function QuotePdfDocument({
  quote,
  client,
  items,
}: {
  quote: QuotePdfData;
  client: QuotePdfClient;
  items: QuotePdfItem[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>Cg Steel Design</Text>
            <Text style={styles.muted}>Taller propio en Calderón, Quito</Text>
            <Text style={styles.muted}>WhatsApp: +593 98 384 2395</Text>
          </View>
          <View>
            <Text style={styles.quoteTitle}>Cotización {quote.quote_number}</Text>
            <Text style={styles.muted}>Fecha: {formatDate(quote.created_at)}</Text>
            <Text style={styles.muted}>
              Válida hasta: {formatDate(quote.valid_until)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text>{client.contact_name}</Text>
          {client.company_name && <Text style={styles.muted}>{client.company_name}</Text>}
          {client.ruc && <Text style={styles.muted}>RUC: {client.ruc}</Text>}
          {client.phone && <Text style={styles.muted}>Teléfono: {client.phone}</Text>}
          {client.email && <Text style={styles.muted}>Email: {client.email}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDesc}>Descripción</Text>
            <Text style={styles.colQty}>Cant.</Text>
            <Text style={styles.colPrice}>P. Unit.</Text>
            <Text style={styles.colSubtotal}>Subtotal</Text>
          </View>
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatMoney(item.unit_price)}</Text>
              <Text style={styles.colSubtotal}>
                {formatMoney(item.subtotal ?? item.quantity * item.unit_price)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text>{formatMoney(quote.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>IVA</Text>
            <Text>{formatMoney(quote.tax)}</Text>
          </View>
          <View style={[styles.totalsRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalText}>Total</Text>
            <Text style={styles.grandTotalText}>{formatMoney(quote.total)}</Text>
          </View>
        </View>

        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text>{quote.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
