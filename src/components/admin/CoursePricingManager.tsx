import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface PricingData {
  id?: string;
  country_code: string;
  currency: string;
  price: number;
  original_price: number | null;
  is_active: boolean;
}

interface Props {
  courseId: string;
}

const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€' },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
];

const CoursePricingManager: React.FC<Props> = ({ courseId }) => {
  const [pricingList, setPricingList] = useState<PricingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');

  useEffect(() => {
    loadPricing();
  }, [courseId]);

  const loadPricing = async () => {
    try {
      const response = await fetch(`/api/admin/pricing/manage?courseId=${courseId}`);
      const data = await response.json();

      if (response.ok) {
        setPricingList(data.pricing || []);
      }
    } catch (error) {
      console.error('Error loading pricing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPricing = async () => {
    if (!selectedCountry || !price) {
      toast.error('Please select country and enter price');
      return;
    }

    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (!country) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/pricing/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          pricingData: {
            country_code: country.code,
            currency: country.currency,
            price: Math.round(parseFloat(price) * 100), // Convert to smallest unit
            original_price: originalPrice ? Math.round(parseFloat(originalPrice) * 100) : null,
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Pricing added successfully');
        setSelectedCountry('');
        setPrice('');
        setOriginalPrice('');
        loadPricing();
      } else {
        toast.error(data.error || 'Failed to add pricing');
      }
    } catch (error: any) {
      toast.error('Failed to add pricing');
    } finally {
      setIsSaving(false);
    }
  };

  const deletePricing = async (pricingId: string) => {
    if (!confirm('Are you sure you want to delete this pricing?')) return;

    try {
      const response = await fetch('/api/admin/pricing/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricingId })
      });

      if (response.ok) {
        toast.success('Pricing deleted');
        loadPricing();
      } else {
        toast.error('Failed to delete pricing');
      }
    } catch (error) {
      toast.error('Failed to delete pricing');
    }
  };

  const formatPrice = (price: number, currency: string): string => {
    const country = COUNTRIES.find(c => c.currency === currency);
    const symbol = country?.symbol || '₹';
    const amount = price / 100;
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Currency Pricing</h3>

      {/* Add New Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select country...</option>
            {COUNTRIES.map(country => (
              <option
                key={country.code}
                value={country.code}
                disabled={pricingList.some(p => p.country_code === country.code)}
              >
                {country.name} ({country.currency})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ({COUNTRIES.find(c => c.code === selectedCountry)?.currency || 'Currency'})
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="99.99"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Price (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="149.99"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={addPricing}
            disabled={isSaving || !selectedCountry || !price}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Adding...' : 'Add Pricing'}
          </button>
        </div>
      </div>

      {/* Pricing List */}
      <div className="space-y-3">
        {pricingList.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No country-specific pricing added yet</p>
        ) : (
          pricingList.map((pricing) => {
            const country = COUNTRIES.find(c => c.code === pricing.country_code);
            return (
              <div key={pricing.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {country?.name} ({country?.currency})
                  </div>
                  <div className="text-sm text-gray-600">
                    Price: {formatPrice(pricing.price, pricing.currency)}
                    {pricing.original_price && (
                      <span className="ml-2 line-through text-gray-400">
                        {formatPrice(pricing.original_price, pricing.currency)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => pricing.id && deletePricing(pricing.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Prices are entered in the main currency unit (e.g., dollars, pounds) and stored as the smallest unit (cents, pence). Users will see pricing based on their detected country.
        </p>
      </div>
    </div>
  );
};

export default CoursePricingManager;
