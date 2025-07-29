import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import InvoiceHistory from './InvoiceHistory';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

export interface InvoiceData {
  id?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  companyInfo: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    email: string;
    phone: string;
    website?: string;
    logo?: string;
  };
  clientInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
  terms?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  course?: {
    id: string;
    name: string;
    code: string;
  };
}

const InvoiceGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'preview' | 'history'>('form');
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const supabase = useSupabaseClient();

  useEffect(() => {
    loadCourses();
    loadStudents();
    loadInvoices();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, price')
        .eq('status', 'published');

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone')
        .eq('role', 'student');

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    }
  };

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
    }
  };

  const saveInvoice = async (data: InvoiceData) => {
    setLoading(true);
    try {
      const invoiceToSave = {
        invoice_number: data.invoiceNumber,
        issue_date: data.issueDate,
        due_date: data.dueDate,
        company_info: data.companyInfo,
        client_info: data.clientInfo,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        tax_rate: data.taxRate,
        total: data.total,
        notes: data.notes,
        terms: data.terms,
        status: data.status || 'draft',
      };

      const { data: savedInvoice, error } = await supabase
        .from('invoices')
        .insert([invoiceToSave])
        .select()
        .single();

      if (error) throw error;

      setInvoiceData({ ...data, id: savedInvoice.id });
      await loadInvoices();
      toast.success('Invoice saved successfully!');
      return savedInvoice;
    } catch (error: any) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id: string, data: Partial<InvoiceData>) => {
    setLoading(true);
    try {
      const invoiceToUpdate = {
        invoice_number: data.invoiceNumber,
        issue_date: data.issueDate,
        due_date: data.dueDate,
        company_info: data.companyInfo,
        client_info: data.clientInfo,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        tax_rate: data.taxRate,
        total: data.total,
        notes: data.notes,
        terms: data.terms,
        status: data.status,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('invoices')
        .update(invoiceToUpdate)
        .eq('id', id);

      if (error) throw error;

      await loadInvoices();
      toast.success('Invoice updated successfully!');
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadInvoices();
      toast.success('Invoice deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (data: InvoiceData) => {
    try {
      const pdfBlob = await generateInvoicePDF(data);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${data.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Invoice PDF generated successfully!');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleFormSubmit = async (data: InvoiceData) => {
    setInvoiceData(data);
    setCurrentStep('preview');
  };

  const handleSaveAndGenerate = async (data: InvoiceData) => {
    try {
      const savedInvoice = await saveInvoice(data);
      await generatePDF({ ...data, id: savedInvoice.id });
    } catch (error) {
      // Error is already handled in saveInvoice
    }
  };

  const steps = [
    { id: 'form', label: 'Create Invoice', icon: '📝' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
    { id: 'history', label: 'Invoice History', icon: '📜' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentStep === step.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{step.icon}</span>
              {step.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === 'form' && (
          <InvoiceForm
            onSubmit={handleFormSubmit}
            loading={loading}
            courses={courses}
            students={students}
            initialData={invoiceData}
          />
        )}

        {currentStep === 'preview' && invoiceData && (
          <InvoicePreview
            data={invoiceData}
            onEdit={() => setCurrentStep('form')}
            onSave={() => saveInvoice(invoiceData)}
            onSaveAndGenerate={() => handleSaveAndGenerate(invoiceData)}
            onGeneratePDF={() => generatePDF(invoiceData)}
            loading={loading}
          />
        )}

        {currentStep === 'history' && (
          <InvoiceHistory
            invoices={invoices}
            onEdit={(invoice) => {
              setInvoiceData(invoice);
              setCurrentStep('form');
            }}
            onDelete={deleteInvoice}
            onGeneratePDF={generatePDF}
            loading={loading}
          />
        )}
      </motion.div>
    </div>
  );
};

export default InvoiceGenerator;
