import React from 'react';
import { motion } from 'framer-motion';

interface Location {
  city: string;
  address: string;
  mapUrl: string;
  contactNumber: string;
  email: string;
  facilities: string[];
  timings: string;
}

const locations: Location[] = [
  {
    city: 'Lucknow',
    address: 'Lucknow, Uttar Pradesh 226016',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.0695846299307!2d80.99421!3d26.8668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh%20226010!5e0!3m2!1sen!2sin!4v1684637298945!5m2!1sen!2sin",
    contactNumber: '+91 7982303199',
    email: 'sales@it-wala.com',
    facilities: [

    ],
    timings: 'Mon-Sat: 9:00 AM - 6:00 PM'
  },
  {
    city: 'Azamgarh',
    address: 'Azamgarh, Uttar Pradesh 276001',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.0429388584654!2d83.1859!3d26.0679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991ff77953e65d7%3A0x25ef082e2c5eea8e!2sCivil%20Lines%2C%20Azamgarh%2C%20Uttar%20Pradesh%20276001!5e0!3m2!1sen!2sin!4v1684637298945!5m2!1sen!2sin",
    contactNumber: '+91 7982303199',
    email: 'sales@it-wala.com',
    facilities: [
      
    ],
    timings: 'Mon-Sat: 9:30 AM - 6:30 PM'
  }
];

const Locations: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Learning Centers</h2>
          <p className="text-lg text-gray-600">
            Visit our state-of-the-art learning centers equipped with modern facilities and experienced faculty
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={location.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-64">
                <iframe
                  src={location.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {location.city} Center
                </h3>
                <p className="text-gray-600 mb-4">{location.address}</p>
                
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Facilities:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {location.facilities.map((facility, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-gray-600">
                  <p className="mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {location.timings}
                  </p>
                  <p className="mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {location.contactNumber}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {location.email}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;