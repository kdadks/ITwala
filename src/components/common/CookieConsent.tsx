import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Settings } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      const savedPrefs = JSON.parse(consent);
      setPreferences(savedPrefs);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);

    // Dispatch event so other components know consent was given
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {!showSettings ? (
                // Main Banner
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        🍪 We Value Your Privacy
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                        By clicking "Accept All", you consent to our use of cookies. You can also customize your preferences.
                      </p>
                    </div>
                    <button
                      onClick={acceptNecessary}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close and accept necessary only"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptAll}
                      className="flex-1 sm:flex-none px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                    >
                      Accept All Cookies
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Necessary Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex-1 sm:flex-none px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    Learn more in our{' '}
                    <a href="/privacy-policy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="/cookie-policy" className="text-primary-600 hover:underline">
                      Cookie Policy
                    </a>
                  </p>
                </div>
              ) : (
                // Settings Panel
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Cookie Preferences
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Necessary Cookies */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">Necessary Cookies</h4>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                            Always Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Essential for the website to function properly. Cannot be disabled.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors relative ${
                          preferences.analytics ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences.analytics ? 'right-1' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Used to track visitors across websites to display relevant advertisements and campaigns.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors relative ${
                          preferences.marketing ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences.marketing ? 'right-1' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    {/* Preference Cookies */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Preference Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Remember your preferences and settings for a personalized experience.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('preferences')}
                        className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors relative ${
                          preferences.preferences ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            preferences.preferences ? 'right-1' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={saveCustomPreferences}
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Save Preferences
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
