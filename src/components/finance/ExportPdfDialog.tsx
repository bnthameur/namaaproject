
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportPdfDialogProps {
  transactions: any[];
}

const ExportPdfDialog: React.FC<ExportPdfDialogProps> = ({ transactions }) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<string>('custom');
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    // Filter transactions based on selected date range
    let filteredTransactions = [...transactions];
    
    if (dateRange === 'custom') {
      if (startDate) {
        filteredTransactions = filteredTransactions.filter(t => 
          new Date(t.date) >= startDate
        );
      }
      if (endDate) {
        filteredTransactions = filteredTransactions.filter(t => 
          new Date(t.date) <= endDate
        );
      }
    } else if (dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.date) >= today
      );
    }
    
    // Sort transactions by date
    filteredTransactions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    generatePDF(filteredTransactions);
    setIsOpen(false);
  };

  const generatePDF = (data: any[]) => {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add right-to-left support
      doc.setR2L(true);
      
      // Add Arabic font
      doc.addFont('/fonts/NotoSansArabic-Regular.ttf', 'NotoSansArabic', 'normal');
      doc.setFont('NotoSansArabic');
      
      // Add title
      doc.setFontSize(20);
      doc.text('سجل المعاملات المالية', doc.internal.pageSize.width / 2, 15, { align: 'center' });
      
      // Add date range
      doc.setFontSize(12);
      const dateRangeText = startDate && endDate ? 
        `الفترة: ${format(startDate, 'yyyy/MM/dd')} إلى ${format(endDate, 'yyyy/MM/dd')}` : 
        dateRange === 'today' ? 'الفترة: اليوم' : 'كل المعاملات';
      doc.text(dateRangeText, doc.internal.pageSize.width / 2, 25, { align: 'center' });
      
      // Add timestamp
      doc.setFontSize(10);
      doc.text(`تاريخ الإنشاء: ${format(new Date(), 'yyyy/MM/dd HH:mm')}`, doc.internal.pageSize.width - 15, 35, { align: 'right' });
      
      const tableHeaders = [['التاريخ', 'التعيين', 'الفئة', 'المدخلات', 'المخرجات', 'الرصيد']];
      
      // Prepare data for the table
      let balance = 0;
      const tableData = data.map((item) => {
        let entry = '';
        let outry = '';
        
        if (item.type === 'income') {
          entry = item.amount?.toLocaleString() || '';
          balance += item.amount || 0;
        } else {
          outry = item.amount?.toLocaleString() || '';
          balance -= item.amount || 0;
        }
        
        // Get the assignee (student or teacher name)
        let assignee = '';
        if (item.students?.name) {
          assignee = item.students.name;
        } else if (item.teachers?.name) {
          assignee = item.teachers.name;
        } else {
          assignee = item.description;
        }
        
        // Return formatted row data
        return [
          item.date ? format(new Date(item.date), 'yyyy/MM/dd') : '',
          assignee,
          item.category,
          entry,
          outry,
          '' // We'll fill the last row only
        ];
      });
      
      // If we have data, add the balance to the last row
      if (tableData.length > 0) {
        tableData[tableData.length - 1][5] = balance.toLocaleString();
      }
      
      // Add table to the document
      (doc as any).autoTable({
        head: tableHeaders,
        body: tableData,
        startY: 40,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 12,
          halign: 'center',
          valign: 'middle'
        },
        bodyStyles: {
          fontSize: 10,
          halign: 'center',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 25 }, // تاريخ
          1: { cellWidth: 40 }, // تعيين
          2: { cellWidth: 35 }, // فئة
          3: { cellWidth: 30 }, // مدخلات
          4: { cellWidth: 30 }, // مخرجات
          5: { cellWidth: 30 }, // رصيد
        },
        margin: { top: 40 },
        didDrawPage: function (data: any) {
          // Add page number at the bottom
          doc.setFontSize(10);
          doc.text(`الصفحة ${doc.getNumberOfPages()}`, doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 10, { align: 'right' });
          
          // Add footer with balance
          doc.setFontSize(12);
          doc.setFont('NotoSansArabic', 'normal');
          doc.text(`الرصيد النهائي: ${balance.toLocaleString()} د.ج`, doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 20, { align: 'right' });
        }
      });
      
      // Save the PDF
      doc.save('financial-transactions.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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
          <DialogTitle>تصدير سجل المعاملات المالية</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <RadioGroup 
            value={dateRange} 
            onValueChange={setDateRange} 
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">نطاق زمني مخصص</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today">اليوم فقط</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">كل المعاملات</Label>
            </div>
          </RadioGroup>
          
          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>من تاريخ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-right font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      {startDate ? (
                        format(startDate, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخاً</span>
                      )}
                      <Calendar className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>إلى تاريخ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-right font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      {endDate ? (
                        format(endDate, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخاً</span>
                      )}
                      <Calendar className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              تصدير PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPdfDialog;
