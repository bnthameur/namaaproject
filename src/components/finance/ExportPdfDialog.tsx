import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';


// ✅ Styles du PDF
const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: 'Helvetica' },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 12, textAlign: 'center', marginBottom: 10 },
  table: { width: '100%', border: '1px solid black', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid black' },
  tableCell: { flex: 1, padding: 5, fontSize: 10, textAlign: 'center' },
});

// ✅ Composant PDF
const PDFDocument = ({ transactions }: { transactions: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>سجل المعاملات المالية</Text>
      <Text style={styles.subtitle}>
        {transactions.length > 0
          ? `عدد المعاملات: ${transactions.length}`
          : "لا توجد معاملات"}
      </Text>

      {/* Tableau des transactions */}
      <View style={styles.table}>
        <View style={[styles.tableRow, { backgroundColor: '#ddd', fontWeight: 'bold' }]}>
          {['التاريخ', 'التعيين', 'الفئة', 'المبلغ', 'الرصيد'].map((header, i) => (
            <Text key={i} style={styles.tableCell}>{header}</Text>
          ))}
        </View>
        {transactions.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{format(new Date(item.date), 'yyyy/MM/dd')}</Text>
            <Text style={styles.tableCell}>{item.students?.name || item.teachers?.name || item.description || ''}</Text>
            <Text style={styles.tableCell}>{item.category || ''}</Text>
            <Text style={styles.tableCell}>{item.amount?.toLocaleString()}</Text>
            <Text style={styles.tableCell}>{item.balance?.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

interface ExportPdfDialogProps {
  transactions: any[];
}

const ExportPdfDialog: React.FC<ExportPdfDialogProps> = ({ transactions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تصدير سجل المعاملات المالية</DialogTitle>
        </DialogHeader>

        {/* ✅ Bouton de téléchargement PDF */}
        <PDFDownloadLink
          document={<PDFDocument transactions={transactions} />}
          fileName={`transactions-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
        >
          {({ loading }) => (
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {loading ? "جاري التحميل..." : "تحميل PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPdfDialog;
