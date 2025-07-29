import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { InvoiceData } from './InvoiceGenerator';
import { previewInvoicePDF } from '../../utils/pdfGenerator';

interface InvoicePreviewProps {
  data: InvoiceData;
  onEdit: () => void;
  onSave: () => void;
  onSaveAndGenerate: () => void;
  onGeneratePDF: () => void;
  loading: boolean;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  data,
  onEdit,
  onSave,
  onSaveAndGenerate,
  onGeneratePDF,
  loading
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadPreview = async () => {
    try {
      const url = await previewInvoicePDF(data);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error loading preview:', error);
    }
  };

  React.useEffect(() => {
    loadPreview();
    
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [data]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Edit Invoice
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onGeneratePDF}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            Download PDF
          </button>
          <button
            onClick={onSaveAndGenerate}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Save & Download'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Invoice Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
                <p className="text-lg text-gray-600">{data.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(data.status)}`}>
                  {data.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Company & Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{data.companyInfo.name}</p>
                <p>{data.companyInfo.address}</p>
                <p>{data.companyInfo.city}, {data.companyInfo.zipCode}</p>
                <p>{data.companyInfo.country}</p>
                <p>{data.companyInfo.email}</p>
                <p>{data.companyInfo.phone}</p>
                {data.companyInfo.website && (
                  <p>
                    <a href={data.companyInfo.website} className="text-primary-600 hover:text-primary-700">
                      {data.companyInfo.website}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{data.clientInfo.name}</p>
                <p>{data.clientInfo.email}</p>
                {data.clientInfo.address && <p>{data.clientInfo.address}</p>}
                {data.clientInfo.city && data.clientInfo.zipCode && (
                  <p>{data.clientInfo.city}, {data.clientInfo.zipCode}</p>
                )}
                {data.clientInfo.country && <p>{data.clientInfo.country}</p>}
                {data.clientInfo.phone && <p>{data.clientInfo.phone}</p>}
              </div>
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Invoice Date:</p>
              <p className="text-sm text-gray-900">{formatDate(data.issueDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Due Date:</p>
              <p className="text-sm text-gray-900">{formatDate(data.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(data.status)}`}>
                {data.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Items:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Description
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700">
                      Qty
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Rate
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-gray-900">
                        {item.description}
                        {item.course && (
                          <div className="text-xs text-gray-500 mt-1">
                            Course: {item.course.name}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-900">
                        ${item.rate.toFixed(2)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-900">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">${data.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax ({data.taxRate}%):</span>
                  <span className="text-sm font-medium">${data.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">${data.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(data.notes || data.terms) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              {data.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
                  <p className="text-sm text-gray-600">{data.notes}</p>
                </div>
              )}
              {data.terms && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Terms and Conditions:</h4>
                  <p className="text-sm text-gray-600">{data.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PDF Preview */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PDF Preview</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '800px' }}>
            {pdfUrl ? (
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full h-full"
                title="Invoice PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading PDF preview...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoicePreview;
