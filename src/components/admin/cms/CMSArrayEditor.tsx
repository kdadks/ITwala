import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ListFilter, HelpCircle, Award, CheckCircle2 } from 'lucide-react';

export interface ArrayItem {
  id?: string;
  title?: string;
  description?: string;
  value?: string;
  label?: string;
  icon?: string;
  tag?: string;
}

interface CMSArrayEditorProps {
  items: ArrayItem[];
  onChange: (updated: ArrayItem[]) => void;
  title: string;
  itemType?: 'stat' | 'feature' | 'faq' | 'generic';
}

export const CMSArrayEditor: React.FC<CMSArrayEditorProps> = ({
  items = [],
  onChange,
  title,
  itemType = 'generic',
}) => {
  const handleItemChange = (index: number, field: keyof ArrayItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addItem = () => {
    const newItem: ArrayItem = itemType === 'stat'
      ? { value: '100+', label: 'New Metric' }
      : itemType === 'faq'
      ? { title: 'New Question?', description: 'Answer content here...' }
      : { title: 'New Item Title', description: 'Item description...' };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          {itemType === 'stat' && <Award className="w-4 h-4 text-emerald-600" />}
          {itemType === 'faq' && <HelpCircle className="w-4 h-4 text-purple-600" />}
          {itemType === 'feature' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
          {itemType === 'generic' && <ListFilter className="w-4 h-4 text-primary-600" />}
          {title} ({items.length})
        </h3>
        <button
          type="button"
          onClick={addItem}
          className="btn btn-outline text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-500 mb-2">No items added yet</p>
          <button
            type="button"
            onClick={addItem}
            className="text-xs font-semibold text-primary-600 hover:underline"
          >
            + Add first item
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Item #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-500 hover:text-red-700 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {itemType === 'stat' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Metric Value</label>
                    <input
                      type="text"
                      value={item.value || ''}
                      onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                      placeholder="e.g. 98% or 10K+"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Metric Label</label>
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                      placeholder="e.g. Student Satisfaction"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">
                      {itemType === 'faq' ? 'Question' : 'Title / Heading'}
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                      placeholder={itemType === 'faq' ? 'Enter question...' : 'Title'}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">
                      {itemType === 'faq' ? 'Answer' : 'Description'}
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder={itemType === 'faq' ? 'Enter answer detail...' : 'Description'}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
