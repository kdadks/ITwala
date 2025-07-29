import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InvoiceData, InvoiceItem } from './InvoiceGenerator';
import { toast } from 'react-hot-toast';

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
  loading: boolean;
  courses: any[];
  students: any[];
  initialData?: InvoiceData | null;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  loading,
  courses,
  students,
  initialData
}) => {
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyInfo: {
      name: 'ITwala Academy',
      address: '123 Education Street',
      city: 'Learning City',
      zipCode: '12345',
      country: 'United States',
      email: 'billing@itwala.academy',
      phone: '+1 (555) 123-4567',
      website: 'https://itwala.academy',
      logo: ''
    },
    clientInfo: {
      name: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      phone: ''
    },
    items: [],
    subtotal: 0,
    tax: 0,
    taxRate: 8.5,
    total: 0,
    notes: 'Thank you for choosing ITwala Academy. Payment is due within 30 days.',
    terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional fees.',
    status: 'draft'
  });

  const [selectedStudent, setSelectedStudent] = useState('');
  const [currentItem, setCurrentItem] = useState<Partial<InvoiceItem>>({
    id: '',
    description: '',
    quantity: 1,
    rate: 0,
    amount: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.taxRate]);

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = (subtotal * formData.taxRate) / 100;
    const total = subtotal + tax;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setFormData(prev => ({
        ...prev,
        clientInfo: {
          name: student.full_name || student.email,
          email: student.email,
          address: '',
          city: '',
          zipCode: '',
          country: '',
          phone: student.phone || ''
        }
      }));
      setSelectedStudent(studentId);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setCurrentItem(prev => ({
        ...prev,
        id: `item-${Date.now()}`,
        description: `${course.title} - Online Course`,
        rate: course.price || 0,
        amount: (prev.quantity || 1) * (course.price || 0),
        course: {
          id: course.id,
          name: course.title,
          code: course.id
        }
      }));
    }
  };

  const handleItemChange = (field: keyof InvoiceItem, value: any) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'quantity' || field === 'rate') {
        updated.amount = (updated.quantity || 0) * (updated.rate || 0);
      }
      
      return updated;
    });
  };

  const addItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.rate) {
      toast.error('Please fill in all item fields');
      return;
    }

    const newItem: InvoiceItem = {
      id: currentItem.id || `item-${Date.now()}`,
      description: currentItem.description,
      quantity: currentItem.quantity || 1,
      rate: currentItem.rate || 0,
      amount: (currentItem.quantity || 1) * (currentItem.rate || 0),
      course: currentItem.course
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setCurrentItem({
      id: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    });
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientInfo.name || !formData.clientInfo.email) {
      toast.error('Please fill in client information');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    onSubmit(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyInfo.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, name: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.companyInfo.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, email: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.companyInfo.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, address: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.companyInfo.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, city: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.companyInfo.zipCode}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, zipCode: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.companyInfo.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, phone: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.companyInfo.website}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, website: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h3>
        
        {students.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student (Optional)
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- Select a student --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name || student.email} ({student.email})
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientInfo.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, name: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.clientInfo.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, email: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.clientInfo.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, address: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.clientInfo.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, city: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.clientInfo.zipCode}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, zipCode: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.clientInfo.country}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, country: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.clientInfo.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: { ...prev.clientInfo, phone: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Invoice Items</h3>
        
        {/* Add Item Form */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Add New Item</h4>
          
          {courses.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course (Optional)
              </label>
              <select
                onChange={(e) => handleCourseSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">-- Select a course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} - ${course.price}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={currentItem.description || ''}
                onChange={(e) => handleItemChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Item description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={currentItem.quantity || 1}
                onChange={(e) => handleItemChange('quantity', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentItem.rate || 0}
                onChange={(e) => handleItemChange('rate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-medium">
              Amount: ${((currentItem.quantity || 1) * (currentItem.rate || 0)).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Add Item
            </button>
          </div>
        </div>
        
        {/* Items List */}
        {formData.items.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Added Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.rate.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Tax and Total */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax & Total</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.taxRate}
              onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax ({formData.taxRate}%):</span>
              <span className="font-medium">${formData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Additional notes..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Terms and conditions..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Preview Invoice'}
        </button>
      </div>
    </motion.form>
  );
};

export default InvoiceForm;
