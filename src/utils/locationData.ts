/**
 * Location data utility for country, state, and city selections
 * Includes ISO codes for generating student IDs
 */

// Country data with ISO 3166-1 alpha-2 codes
export interface Country {
  name: string;
  isoCode: string;
  phoneCode: string;
}

export const countries: Country[] = [
  { name: 'India', isoCode: 'IN', phoneCode: '+91' },
  { name: 'United States', isoCode: 'US', phoneCode: '+1' },
  { name: 'United Kingdom', isoCode: 'GB', phoneCode: '+44' },
  { name: 'Canada', isoCode: 'CA', phoneCode: '+1' },
  { name: 'Australia', isoCode: 'AU', phoneCode: '+61' },
  { name: 'Germany', isoCode: 'DE', phoneCode: '+49' },
  { name: 'France', isoCode: 'FR', phoneCode: '+33' },
  { name: 'United Arab Emirates', isoCode: 'AE', phoneCode: '+971' },
  { name: 'Singapore', isoCode: 'SG', phoneCode: '+65' },
  { name: 'Japan', isoCode: 'JP', phoneCode: '+81' },
  { name: 'South Korea', isoCode: 'KR', phoneCode: '+82' },
  { name: 'China', isoCode: 'CN', phoneCode: '+86' },
  { name: 'Brazil', isoCode: 'BR', phoneCode: '+55' },
  { name: 'Mexico', isoCode: 'MX', phoneCode: '+52' },
  { name: 'South Africa', isoCode: 'ZA', phoneCode: '+27' },
  { name: 'Nigeria', isoCode: 'NG', phoneCode: '+234' },
  { name: 'Kenya', isoCode: 'KE', phoneCode: '+254' },
  { name: 'Bangladesh', isoCode: 'BD', phoneCode: '+880' },
  { name: 'Pakistan', isoCode: 'PK', phoneCode: '+92' },
  { name: 'Sri Lanka', isoCode: 'LK', phoneCode: '+94' },
  { name: 'Nepal', isoCode: 'NP', phoneCode: '+977' },
  { name: 'Indonesia', isoCode: 'ID', phoneCode: '+62' },
  { name: 'Malaysia', isoCode: 'MY', phoneCode: '+60' },
  { name: 'Thailand', isoCode: 'TH', phoneCode: '+66' },
  { name: 'Vietnam', isoCode: 'VN', phoneCode: '+84' },
  { name: 'Philippines', isoCode: 'PH', phoneCode: '+63' },
  { name: 'Russia', isoCode: 'RU', phoneCode: '+7' },
  { name: 'Italy', isoCode: 'IT', phoneCode: '+39' },
  { name: 'Spain', isoCode: 'ES', phoneCode: '+34' },
  { name: 'Netherlands', isoCode: 'NL', phoneCode: '+31' },
  { name: 'New Zealand', isoCode: 'NZ', phoneCode: '+64' },
  { name: 'Ireland', isoCode: 'IE', phoneCode: '+353' },
  { name: 'Switzerland', isoCode: 'CH', phoneCode: '+41' },
  { name: 'Sweden', isoCode: 'SE', phoneCode: '+46' },
  { name: 'Norway', isoCode: 'NO', phoneCode: '+47' },
  { name: 'Denmark', isoCode: 'DK', phoneCode: '+45' },
  { name: 'Finland', isoCode: 'FI', phoneCode: '+358' },
  { name: 'Poland', isoCode: 'PL', phoneCode: '+48' },
  { name: 'Belgium', isoCode: 'BE', phoneCode: '+32' },
  { name: 'Austria', isoCode: 'AT', phoneCode: '+43' },
  { name: 'Portugal', isoCode: 'PT', phoneCode: '+351' },
  { name: 'Greece', isoCode: 'GR', phoneCode: '+30' },
  { name: 'Turkey', isoCode: 'TR', phoneCode: '+90' },
  { name: 'Saudi Arabia', isoCode: 'SA', phoneCode: '+966' },
  { name: 'Qatar', isoCode: 'QA', phoneCode: '+974' },
  { name: 'Kuwait', isoCode: 'KW', phoneCode: '+965' },
  { name: 'Bahrain', isoCode: 'BH', phoneCode: '+973' },
  { name: 'Oman', isoCode: 'OM', phoneCode: '+968' },
  { name: 'Egypt', isoCode: 'EG', phoneCode: '+20' },
  { name: 'Israel', isoCode: 'IL', phoneCode: '+972' },
];

// State data with ISO 3166-2 codes
export interface State {
  name: string;
  isoCode: string;
  countryCode: string;
}

// Indian States with ISO codes (ISO 3166-2:IN)
export const indianStates: State[] = [
  { name: 'Andhra Pradesh', isoCode: 'AP', countryCode: 'IN' },
  { name: 'Arunachal Pradesh', isoCode: 'AR', countryCode: 'IN' },
  { name: 'Assam', isoCode: 'AS', countryCode: 'IN' },
  { name: 'Bihar', isoCode: 'BR', countryCode: 'IN' },
  { name: 'Chhattisgarh', isoCode: 'CG', countryCode: 'IN' },
  { name: 'Goa', isoCode: 'GA', countryCode: 'IN' },
  { name: 'Gujarat', isoCode: 'GJ', countryCode: 'IN' },
  { name: 'Haryana', isoCode: 'HR', countryCode: 'IN' },
  { name: 'Himachal Pradesh', isoCode: 'HP', countryCode: 'IN' },
  { name: 'Jharkhand', isoCode: 'JH', countryCode: 'IN' },
  { name: 'Karnataka', isoCode: 'KA', countryCode: 'IN' },
  { name: 'Kerala', isoCode: 'KL', countryCode: 'IN' },
  { name: 'Madhya Pradesh', isoCode: 'MP', countryCode: 'IN' },
  { name: 'Maharashtra', isoCode: 'MH', countryCode: 'IN' },
  { name: 'Manipur', isoCode: 'MN', countryCode: 'IN' },
  { name: 'Meghalaya', isoCode: 'ML', countryCode: 'IN' },
  { name: 'Mizoram', isoCode: 'MZ', countryCode: 'IN' },
  { name: 'Nagaland', isoCode: 'NL', countryCode: 'IN' },
  { name: 'Odisha', isoCode: 'OD', countryCode: 'IN' },
  { name: 'Punjab', isoCode: 'PB', countryCode: 'IN' },
  { name: 'Rajasthan', isoCode: 'RJ', countryCode: 'IN' },
  { name: 'Sikkim', isoCode: 'SK', countryCode: 'IN' },
  { name: 'Tamil Nadu', isoCode: 'TN', countryCode: 'IN' },
  { name: 'Telangana', isoCode: 'TS', countryCode: 'IN' },
  { name: 'Tripura', isoCode: 'TR', countryCode: 'IN' },
  { name: 'Uttar Pradesh', isoCode: 'UP', countryCode: 'IN' },
  { name: 'Uttarakhand', isoCode: 'UK', countryCode: 'IN' },
  { name: 'West Bengal', isoCode: 'WB', countryCode: 'IN' },
  // Union Territories
  { name: 'Andaman and Nicobar Islands', isoCode: 'AN', countryCode: 'IN' },
  { name: 'Chandigarh', isoCode: 'CH', countryCode: 'IN' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', isoCode: 'DH', countryCode: 'IN' },
  { name: 'Delhi', isoCode: 'DL', countryCode: 'IN' },
  { name: 'Jammu and Kashmir', isoCode: 'JK', countryCode: 'IN' },
  { name: 'Ladakh', isoCode: 'LA', countryCode: 'IN' },
  { name: 'Lakshadweep', isoCode: 'LD', countryCode: 'IN' },
  { name: 'Puducherry', isoCode: 'PY', countryCode: 'IN' },
];

// US States
export const usStates: State[] = [
  { name: 'Alabama', isoCode: 'AL', countryCode: 'US' },
  { name: 'Alaska', isoCode: 'AK', countryCode: 'US' },
  { name: 'Arizona', isoCode: 'AZ', countryCode: 'US' },
  { name: 'Arkansas', isoCode: 'AR', countryCode: 'US' },
  { name: 'California', isoCode: 'CA', countryCode: 'US' },
  { name: 'Colorado', isoCode: 'CO', countryCode: 'US' },
  { name: 'Connecticut', isoCode: 'CT', countryCode: 'US' },
  { name: 'Delaware', isoCode: 'DE', countryCode: 'US' },
  { name: 'Florida', isoCode: 'FL', countryCode: 'US' },
  { name: 'Georgia', isoCode: 'GA', countryCode: 'US' },
  { name: 'Hawaii', isoCode: 'HI', countryCode: 'US' },
  { name: 'Idaho', isoCode: 'ID', countryCode: 'US' },
  { name: 'Illinois', isoCode: 'IL', countryCode: 'US' },
  { name: 'Indiana', isoCode: 'IN', countryCode: 'US' },
  { name: 'Iowa', isoCode: 'IA', countryCode: 'US' },
  { name: 'Kansas', isoCode: 'KS', countryCode: 'US' },
  { name: 'Kentucky', isoCode: 'KY', countryCode: 'US' },
  { name: 'Louisiana', isoCode: 'LA', countryCode: 'US' },
  { name: 'Maine', isoCode: 'ME', countryCode: 'US' },
  { name: 'Maryland', isoCode: 'MD', countryCode: 'US' },
  { name: 'Massachusetts', isoCode: 'MA', countryCode: 'US' },
  { name: 'Michigan', isoCode: 'MI', countryCode: 'US' },
  { name: 'Minnesota', isoCode: 'MN', countryCode: 'US' },
  { name: 'Mississippi', isoCode: 'MS', countryCode: 'US' },
  { name: 'Missouri', isoCode: 'MO', countryCode: 'US' },
  { name: 'Montana', isoCode: 'MT', countryCode: 'US' },
  { name: 'Nebraska', isoCode: 'NE', countryCode: 'US' },
  { name: 'Nevada', isoCode: 'NV', countryCode: 'US' },
  { name: 'New Hampshire', isoCode: 'NH', countryCode: 'US' },
  { name: 'New Jersey', isoCode: 'NJ', countryCode: 'US' },
  { name: 'New Mexico', isoCode: 'NM', countryCode: 'US' },
  { name: 'New York', isoCode: 'NY', countryCode: 'US' },
  { name: 'North Carolina', isoCode: 'NC', countryCode: 'US' },
  { name: 'North Dakota', isoCode: 'ND', countryCode: 'US' },
  { name: 'Ohio', isoCode: 'OH', countryCode: 'US' },
  { name: 'Oklahoma', isoCode: 'OK', countryCode: 'US' },
  { name: 'Oregon', isoCode: 'OR', countryCode: 'US' },
  { name: 'Pennsylvania', isoCode: 'PA', countryCode: 'US' },
  { name: 'Rhode Island', isoCode: 'RI', countryCode: 'US' },
  { name: 'South Carolina', isoCode: 'SC', countryCode: 'US' },
  { name: 'South Dakota', isoCode: 'SD', countryCode: 'US' },
  { name: 'Tennessee', isoCode: 'TN', countryCode: 'US' },
  { name: 'Texas', isoCode: 'TX', countryCode: 'US' },
  { name: 'Utah', isoCode: 'UT', countryCode: 'US' },
  { name: 'Vermont', isoCode: 'VT', countryCode: 'US' },
  { name: 'Virginia', isoCode: 'VA', countryCode: 'US' },
  { name: 'Washington', isoCode: 'WA', countryCode: 'US' },
  { name: 'West Virginia', isoCode: 'WV', countryCode: 'US' },
  { name: 'Wisconsin', isoCode: 'WI', countryCode: 'US' },
  { name: 'Wyoming', isoCode: 'WY', countryCode: 'US' },
];

// UK Countries/Regions
export const ukRegions: State[] = [
  { name: 'England', isoCode: 'ENG', countryCode: 'GB' },
  { name: 'Scotland', isoCode: 'SCT', countryCode: 'GB' },
  { name: 'Wales', isoCode: 'WLS', countryCode: 'GB' },
  { name: 'Northern Ireland', isoCode: 'NIR', countryCode: 'GB' },
];

// Canadian Provinces
export const canadianProvinces: State[] = [
  { name: 'Alberta', isoCode: 'AB', countryCode: 'CA' },
  { name: 'British Columbia', isoCode: 'BC', countryCode: 'CA' },
  { name: 'Manitoba', isoCode: 'MB', countryCode: 'CA' },
  { name: 'New Brunswick', isoCode: 'NB', countryCode: 'CA' },
  { name: 'Newfoundland and Labrador', isoCode: 'NL', countryCode: 'CA' },
  { name: 'Nova Scotia', isoCode: 'NS', countryCode: 'CA' },
  { name: 'Ontario', isoCode: 'ON', countryCode: 'CA' },
  { name: 'Prince Edward Island', isoCode: 'PE', countryCode: 'CA' },
  { name: 'Quebec', isoCode: 'QC', countryCode: 'CA' },
  { name: 'Saskatchewan', isoCode: 'SK', countryCode: 'CA' },
  { name: 'Northwest Territories', isoCode: 'NT', countryCode: 'CA' },
  { name: 'Nunavut', isoCode: 'NU', countryCode: 'CA' },
  { name: 'Yukon', isoCode: 'YT', countryCode: 'CA' },
];

// Australian States
export const australianStates: State[] = [
  { name: 'New South Wales', isoCode: 'NSW', countryCode: 'AU' },
  { name: 'Victoria', isoCode: 'VIC', countryCode: 'AU' },
  { name: 'Queensland', isoCode: 'QLD', countryCode: 'AU' },
  { name: 'South Australia', isoCode: 'SA', countryCode: 'AU' },
  { name: 'Western Australia', isoCode: 'WA', countryCode: 'AU' },
  { name: 'Tasmania', isoCode: 'TAS', countryCode: 'AU' },
  { name: 'Northern Territory', isoCode: 'NT', countryCode: 'AU' },
  { name: 'Australian Capital Territory', isoCode: 'ACT', countryCode: 'AU' },
];

// UAE Emirates
export const uaeEmirates: State[] = [
  { name: 'Abu Dhabi', isoCode: 'AZ', countryCode: 'AE' },
  { name: 'Dubai', isoCode: 'DU', countryCode: 'AE' },
  { name: 'Sharjah', isoCode: 'SH', countryCode: 'AE' },
  { name: 'Ajman', isoCode: 'AJ', countryCode: 'AE' },
  { name: 'Umm Al Quwain', isoCode: 'UQ', countryCode: 'AE' },
  { name: 'Ras Al Khaimah', isoCode: 'RK', countryCode: 'AE' },
  { name: 'Fujairah', isoCode: 'FU', countryCode: 'AE' },
];

// Generic states for other countries
export const genericStates: State[] = [
  { name: 'Other', isoCode: 'OT', countryCode: 'OTHER' },
];

// Get states by country code
export function getStatesByCountry(countryCode: string): State[] {
  switch (countryCode) {
    case 'IN':
      return indianStates;
    case 'US':
      return usStates;
    case 'GB':
      return ukRegions;
    case 'CA':
      return canadianProvinces;
    case 'AU':
      return australianStates;
    case 'AE':
      return uaeEmirates;
    default:
      return [{ name: 'Other', isoCode: 'OT', countryCode }];
  }
}

// Get country ISO code by name
export function getCountryIsoCode(countryName: string): string {
  const country = countries.find(
    c => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country?.isoCode || 'XX';
}

// Get state ISO code by name and country
export function getStateIsoCode(stateName: string, countryCode: string): string {
  const states = getStatesByCountry(countryCode);
  const state = states.find(
    s => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return state?.isoCode || 'XX';
}

// Indian cities by state (comprehensive list)
export const indianCitiesByState: { [key: string]: string[] } = {
  "Andhra Pradesh": [
    "Adoni", "Anantapur", "Bhimavaram", "Chirala", "Chittoor", "Dharmavaram", "Eluru", "Gudivada", "Guntur", "Guntakal",
    "Hindupur", "Kadapa", "Kakinada", "Kurnool", "Machilipatnam", "Madanapalle", "Mangalagiri", "Narasaraopet", "Nellore",
    "Ongole", "Parvathipuram", "Proddatur", "Rajahmundry", "Srikakulam", "Tadipatri", "Tenali", "Tirupati", "Vijayawada",
    "Visakhapatnam", "Vizianagaram"
  ],
  "Arunachal Pradesh": [
    "Aalo", "Anini", "Basar", "Bomdila", "Changlang", "Daporijo", "Deomali", "Hawai", "Itanagar", "Khonsa",
    "Longding", "Naharlagun", "Namsai", "Pasighat", "Roing", "Seppa", "Tawang", "Tezu", "Yingkiong", "Ziro"
  ],
  "Assam": [
    "Barpeta", "Bongaigaon", "Dhemaji", "Dhubri", "Dibrugarh", "Diphu", "Duliajan", "Goalpara", "Golaghat", "Guwahati",
    "Haflong", "Hojai", "Jorhat", "Karimganj", "Kokrajhar", "Lanka", "Lumding", "Mangaldoi", "Margherita", "Morigaon",
    "Nagaon", "Namrup", "North Lakhimpur", "Rangia", "Sibsagar", "Silchar", "Sivasagar", "Sonari", "Tezpur", "Tinsukia"
  ],
  "Bihar": [
    "Arrah", "Aurangabad", "Bagaha", "Begusarai", "Bettiah", "Bhagalpur", "Bihar Sharif", "Buxar", "Chapra", "Darbhanga",
    "Dehri", "Gaya", "Hajipur", "Jamalpur", "Jehanabad", "Katihar", "Kishanganj", "Lakhisarai", "Madhubani", "Motihari",
    "Munger", "Muzaffarpur", "Nawada", "Patna", "Purnia", "Saharsa", "Samastipur", "Sasaram", "Sitamarhi", "Siwan"
  ],
  "Chhattisgarh": [
    "Akaltara", "Ambikapur", "Baikunthpur", "Baloda Bazar", "Bhatapara", "Bhilai", "Bhilai-Charoda", "Bilaspur", "Chirmiri", "Dhamtari",
    "Dongargarh", "Dongargaon", "Durg", "Jagdalpur", "Kanker", "Katghora", "Kawardha", "Kirandul", "Kondagaon", "Korba",
    "Mahasamund", "Mungeli", "Naila Janjgir", "Pakhanjore", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Surajpur", "Tilda Newra"
  ],
  "Goa": [
    "Aldona", "Anjuna", "Arambol", "Benaulim", "Bicholim", "Calangute", "Canacona", "Candolim", "Colva", "Cortalim",
    "Cuncolim", "Curchorem", "Majorda", "Mandrem", "Marcel", "Margao", "Morjim", "Panaji", "Pernem", "Ponda",
    "Porvorim", "Quepem", "Reis Magos", "Sanquelim", "Sanguem", "Shiroda", "Vagator", "Valpoi", "Vasco da Gama"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Ankleshwar", "Bharuch", "Bhavnagar", "Bhuj", "Botad", "Dahod", "Deesa",
    "Gandhidham", "Gandhinagar", "Godhra", "Jamnagar", "Jetpur", "Junagadh", "Mehsana", "Morbi", "Nadiad", "Navsari",
    "Palanpur", "Patan", "Porbandar", "Rajkot", "Surendranagar", "Surat", "Vadodara", "Vapi", "Veraval", "Wadhwan"
  ],
  "Haryana": [
    "Ambala", "Bahadurgarh", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gohana", "Gurugram", "Hansi", "Hisar",
    "Jind", "Kaithal", "Karnal", "Kosli", "Mahendraganj", "Narnaul", "Narwana", "Palwal", "Panchkula", "Panipat",
    "Pehowa", "Rewari", "Rohtak", "Samalkha", "Shahbad", "Sirsa", "Sonipat", "Thanesar", "Tohana", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Arki", "Baddi", "Bilaspur", "Chamba", "Dalhousie", "Dharamshala", "Hamirpur", "Jogindernagar", "Kalpa", "Kangra",
    "Kasauli", "Keylong", "Kullu", "Manali", "Mcleodganj", "Nahan", "Nalagarh", "Nurpur", "Palampur", "Paonta Sahib",
    "Parwanoo", "Rampur", "Rohru", "Shimla", "Solan", "Sundernagar", "Sujanpur", "Theog", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Bundu", "Chakradharpur", "Chandil", "Chatra", "Deoghar", "Dhanbad", "Dumka", "Garhwa", "Giridih",
    "Godda", "Gomoh", "Gumla", "Hazaribagh", "Jamshedpur", "Jamtara", "Khunti", "Lohardaga", "Madhupur", "Medininagar",
    "Mihijam", "Pakur", "Phusro", "Rajmahal", "Ramgarh", "Ranchi", "Sahibganj", "Saraikela", "Simdega"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru", "Bhadravati", "Bidar", "Chamrajnagar", "Chikkamagaluru", "Chitradurga", "Davanagere",
    "Gadag", "Gokak", "Hassan", "Haveri", "Hospet", "Hubballi", "Kalaburagi", "Kolar", "Madikeri", "Mandya",
    "Mangaluru", "Mysuru", "Puttur", "Raichur", "Ramanagara", "Robertsonpet", "Shivamogga", "Tumakuru", "Udupi", "Vijayapura"
  ],
  "Kerala": [
    "Alappuzha", "Chavakkad", "Cherthala", "Guruvayur", "Idukki", "Kannur", "Kasaragod", "Kochi", "Kodungallur", "Kottayam",
    "Kozhikode", "Kunnamkulam", "Koyilandy", "Malappuram", "Manjeri", "Nileshwaram", "Ottappalam", "Palakkad", "Pathanamthitta", "Payyannur",
    "Perinthalmanna", "Ponnani", "Taliparamba", "Thalassery", "Thiruvananthapuram", "Thrissur", "Tirur", "Vadakkanchery", "Vatakara"
  ],
  "Madhya Pradesh": [
    "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Dewas", "Guna", "Gwalior",
    "Hoshangabad", "Indore", "Itarsi", "Jabalpur", "Khandwa", "Khargone", "Mandsaur", "Morena", "Neemuch", "Pithampur",
    "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shivpuri", "Singrauli", "Ujjain", "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Bhiwandi", "Bhusawal", "Chandrapur", "Dhule", "Ichalkaranji", "Jalgaon",
    "Jalna", "Kalyan-Dombivli", "Kolhapur", "Latur", "Malegaon", "Mumbai", "Nagpur", "Nanded", "Nashik", "Navi Mumbai",
    "Panvel", "Parbhani", "Pune", "Sangli", "Satara", "Solapur", "Thane", "Ulhasnagar", "Vasai-Virar", "Yavatmal"
  ],
  "Manipur": [
    "Andro", "Bishnupur", "Chandel", "Churachandpur", "Heingang", "Imphal", "Jiribam", "Kakching", "Kangpokpi", "Kongba",
    "Kumbi", "Kwakta", "Lilong", "Mayang Imphal", "Moirang", "Moreh", "Nambol", "Ningthoukhong", "Nungba", "Oinam",
    "Pherzawl", "Samurou", "Sekmai", "Senapati", "Sikhong Sekmai", "Sugnu", "Thoubal", "Ukhrul", "Wangjing", "Yairipok"
  ],
  "Meghalaya": [
    "Ampati", "Baghmara", "Betasing", "Cherrapunji", "Dadengiri", "Dadenggre", "Dalu", "Garobadha", "Jowai", "Khliehriat",
    "Laitumkhrah", "Madanriting", "Mahendraganj", "Mairang", "Mankachar", "Mawkyrwat", "Mawlai", "Mendipathar", "Nongpoh", "Nongstoin",
    "Nongthymmai", "Pynursla", "Raksamgre", "Resubelpara", "Rongjeng", "Selsella", "Shillong", "Tura", "Umroi", "Williamnagar"
  ],
  "Mizoram": [
    "Aizawl", "Bairabi", "Bunghmun", "Champhai", "Darlawn", "Hnahthial", "Kawrthah", "Keifang", "Khawhai", "Khawzawl",
    "Kolasib", "Lawngtlai", "Lengpui", "Lunglei", "Mamit", "North Vanlaiphai", "Phullen", "Saiha", "Saitual", "Samtlang",
    "Serchhip", "Thenzawl", "Thingfal", "Tlabung", "Tuidam", "Vairengte", "West Phaileng", "Zawlnuam", "Zobawk", "Zokhawthar"
  ],
  "Nagaland": [
    "Aboi", "Aghunato", "Changtongya", "Chen", "Chozuba", "Dimapur", "Jalukie", "Kiphire", "Kohima", "Longkhim",
    "Longleng", "Mangkolemba", "Medziphema", "Meluri", "Mon", "Mokokchung", "Naginimora", "Noklak", "Peren", "Pfutsero",
    "Phek", "Shamator", "Tening", "Tizit", "Tobu", "Tseminyu", "Tuli", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balasore", "Baripada", "Bargarh", "Berhampur", "Bhadrak", "Bhawanipatna", "Bhubaneswar", "Bolangir", "Boudh",
    "Cuttack", "Dhenkanal", "Jajpur", "Jeypore", "Jharsuguda", "Kendrapara", "Kendujhargarh", "Keonjhar", "Koraput", "Nabarangpur",
    "Nayagarh", "Paradip", "Phulbani", "Puri", "Rayagada", "Rourkela", "Sambalpur", "Soro", "Sundargarh", "Talcher"
  ],
  "Punjab": [
    "Abohar", "Amritsar", "Barnala", "Batala", "Bathinda", "Faridkot", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
    "Kapurthala", "Khanna", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Mohali", "Muktsar", "Nabha", "Nangal",
    "Nakodar", "Nawanshahr", "Pathankot", "Patiala", "Phagwara", "Rajpura", "Ropar", "Sangrur", "Tarn Taran", "Zira"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh",
    "Churu", "Dausa", "Dhaulpur", "Gangapur City", "Hanumangarh", "Hindaun", "Jaipur", "Jaisalmer", "Jhunjhunu", "Jodhpur",
    "Kishangarh", "Kota", "Nagaur", "Pali", "Sawai Madhopur", "Sikar", "Sri Ganganagar", "Sujangarh", "Tonk", "Udaipur"
  ],
  "Sikkim": [
    "Chungthang", "Dentam", "Dikchu", "Gangtok", "Gyalshing", "Hee", "Jorethang", "Lachen", "Lachung", "Legship",
    "Makha", "Mangan", "Namchi", "Namthang", "Nayabazar", "Pakyong", "Pelling", "Phodong", "Ranipool", "Ravangla",
    "Rhenock", "Rinchenpong", "Rangpo", "Singtam", "Soreng", "Tashiding", "Toong", "Yangang", "Yuksom"
  ],
  "Tamil Nadu": [
    "Ambur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Gudiyatham", "Hosur", "Kancheepuram",
    "Karur", "Kumbakonam", "Madurai", "Nagercoil", "Namakkal", "Ooty", "Pollachi", "Pudukkottai", "Rajapalayam", "Salem",
    "Sivakasi", "Thanjavur", "Theni", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Thoothukudi", "Vaniyambadi", "Vellore"
  ],
  "Telangana": [
    "Adilabad", "Bhadrachalam", "Bodhan", "Gadwal", "Hyderabad", "Jagitial", "Jangaon", "Kamareddy", "Karimnagar", "Khammam",
    "Kothagudem", "Mahbubnagar", "Mancherial", "Medak", "Miryalaguda", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Ramagundam",
    "Sangareddy", "Secunderabad", "Siddipet", "Sircilla", "Suryapet", "Tandur", "Vikarabad", "Wanaparthy", "Warangal", "Yellandu"
  ],
  "Tripura": [
    "Agartala", "Ambassa", "Amarpur", "Belonia", "Bishalgarh", "Boxanagar", "Dharmanagar", "Jampuijala", "Jirania", "Jumpuijala",
    "Kailasahar", "Kamalpur", "Kanchanpur", "Karbook", "Khowai", "Kumarghat", "Longtharai Valley", "Mandai", "Matabari", "Melaghar",
    "Mohanpur", "Panisagar", "Ranirbazar", "Sabroom", "Salema", "Santir Bazar", "Sonamura", "Teliamura", "Udaipur"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat",
    "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun",
    "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur",
    "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow",
    "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Noida",
    "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli",
    "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Bajpur", "Bhimtal", "Champawat", "Chamoli", "Dehradun", "Gopeshwar", "Haldwani", "Haridwar",
    "Jaspur", "Joshimath", "Kashipur", "Kichha", "Kotdwar", "Lansdowne", "Mussoorie", "Nainital", "Pauri", "Pithoragarh",
    "Ramnagar", "Ranikhet", "Rishikesh", "Roorkee", "Rudrapur", "Sitarganj", "Srinagar", "Tanakpur", "Tehri", "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar", "Asansol", "Baharampur", "Balurghat", "Bangaon", "Bankura", "Bardhaman", "Basirhat", "Chakdaha", "Cooch Behar",
    "Dankuni", "Darjeeling", "Dhulian", "Durgapur", "Habra", "Haldia", "Howrah", "Jalpaiguri", "Jangipur", "Kharagpur",
    "Kolkata", "Krishnanagar", "Malda", "Medinipur", "Nabadwip", "Purulia", "Raiganj", "Ranaghat", "Shantipur", "Siliguri"
  ],
  // Union Territories
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi",
    "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  "Andaman and Nicobar Islands": ["Port Blair", "Diglipur", "Rangat", "Mayabunder", "Car Nicobar"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam",
    "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"
  ],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Agatti", "Amini", "Andrott", "Kavaratti", "Minicoy"]
};

// Get cities by state and country
export function getCitiesByState(stateName: string, countryCode: string = 'IN'): string[] {
  if (countryCode === 'IN') {
    return (indianCitiesByState[stateName] || []).sort();
  }
  // For other countries, return empty array (manual input)
  return [];
}

// Helper function to generate student ID
export function generateStudentIdPrefix(countryName: string, stateName: string): string {
  const countryCode = getCountryIsoCode(countryName);
  const stateCode = getStateIsoCode(stateName, countryCode);
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  return `${countryCode}-${stateCode}-${year}-${month}`;
}
