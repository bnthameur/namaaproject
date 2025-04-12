import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Register Arabic font
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v22/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hL4-W1Q.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v22/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hL4-W1Q.ttf',
  fontWeight: 'bold',
});

// PDF Styles with improved design for Arabic
const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: 'Cairo',
    backgroundColor: '#fff',
    direction: 'rtl',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #334155',
    paddingBottom: 10,
  },
  title: { 
    fontSize: 24, 
    textAlign: 'center', 
    marginBottom: 5,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 15,
    color: '#475569',
  },
  date: {
    fontSize: 12,
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 15,
    color: '#64748b',
  },
  table: { 
    width: '100%', 
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row', 
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#cbd5e1',
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#cbd5e1',
    minHeight: 30,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  headerCell: { 
    flex: 1, 
    padding: 8, 
    fontSize: 12, 
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#334155',
  },
  tableCell: { 
    flex: 1, 
    padding: 8, 
    fontSize: 10, 
    textAlign: 'center',
    color: '#1e293b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  amountPositive: {
    color: '#059669',
  },
  amountNegative: {
    color: '#dc2626',
  },
  noTransactions: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
    padding: 20,
  }
});

// PDF Document Component
const PDFDocument = ({ transactions }: { transactions: any[] }) => {
  const currentDate = format(new Date(), 'yyyy/MM/dd');
  const balance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
  
  const formatAmount = (amount: number) => {
    return amount?.toLocaleString('ar-SA') || '0';
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>سجل المعاملات المالية</Text>
          <Text style={styles.subtitle}>
            {transactions.length > 0
              ? `عدد المعاملات: ${transactions.length} | الرصيد الحالي: ${formatAmount(balance)} DA`
              : "لا توجد معاملات مسجلة"}
          </Text>
          <Text style={styles.date}>تاريخ الإصدار: {currentDate}</Text>
        </View>

        {transactions.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {['التاريخ', 'الوصف', 'الفئة', 'المبلغ', 'الرصيد'].map((header, i) => (
                <Text key={i} style={styles.headerCell}>{header}</Text>
              ))}
            </View>
            
            {transactions.map((item, index) => {
              const isPositiveAmount = item.amount >= 0;
              
              return (
                <View key={index} style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowEven : {}
                ]}>
                  <Text style={styles.tableCell}>
                    {format(new Date(item.date), 'yyyy/MM/dd')}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.students?.name || item.teachers?.name || item.description || '-'}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.category || '-'}
                  </Text>
                  <Text style={[
                    styles.tableCell, 
                    isPositiveAmount ? styles.amountPositive : styles.amountNegative
                  ]}>
                    {isPositiveAmount ? '+' : ''}{formatAmount(item.amount)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatAmount(item.balance)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            <Text style={styles.noTransactions}>
              لم يتم العثور على أي معاملات في النظام
            </Text>
          </View>
        )}
        
        <Text style={styles.footer}>
          تم إنشاء هذا التقرير بتاريخ {currentDate}
        </Text>
      </Page>
    </Document>
  );
};

interface ExportPdfDialogProps {
  transactions: any[];
}

const ExportPdfDialog: React.FC<ExportPdfDialogProps> = ({ transactions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDownloadClick = () => {
    toast({
      title: "جاري تحضير الملف",
      description: "يتم الآن تحضير ملف PDF للتحميل",
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-right">تصدير سجل المعاملات المالية</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <p className="text-sm text-right text-muted-foreground">
            قم بتحميل سجل المعاملات المالية بصيغة PDF. يحتوي الملف على {transactions.length} معاملة.
          </p>
          
          <PDFDownloadLink
            document={<PDFDocument transactions={transactions} />}
            fileName={`transactions-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
            onClick={handleDownloadClick}
          >
            {({ loading, error }) => (
              <Button disabled={loading} className="w-full">
                <Download className="ml-2 h-4 w-4" />
                {loading ? "جاري التحضير..." : "تحميل السجل بصيغة PDF"}
              </Button>
            )}
          </PDFDownloadLink>
          
          {transactions.length === 0 && (
            <p className="text-xs text-center text-muted-foreground">
              لا توجد معاملات لتصديرها. الرجاء إضافة معاملات أولاً.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPdfDialog;