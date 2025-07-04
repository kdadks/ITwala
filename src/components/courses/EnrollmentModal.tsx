import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getSiteSettings } from '@/utils/siteSettings';

interface Course {
  id: string;
  title: string;
  price: number;
}

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose, course }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentsEnabled, setEnrollmentsEnabled] = useState(true);
  const [isCheckingSettings, setIsCheckingSettings] = useState(true);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [showDirectEnrollment, setShowDirectEnrollment] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    country: 'India',
    pincode: '',
    highestQualification: '',
    degreeName: '',
    hasLaptop: false
  });

  useEffect(() => {
    const checkEnrollmentSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setEnrollmentsEnabled(settings.enrollmentsEnabled);
        
        // If enrollments are disabled and modal is open, show an error and close the modal
        if (!settings.enrollmentsEnabled && isOpen) {
          toast.error('Enrollment is currently disabled. Please try again later.');
          onClose();
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        // Default to true if we can't fetch settings
        setEnrollmentsEnabled(true);
      } finally {
        setIsCheckingSettings(false);
      }
    };
    
    if (isOpen) {
      checkEnrollmentSettings();
    }
  }, [isOpen, onClose]);

  // Check if user has previously enrolled in any course and has complete profile
  useEffect(() => {
    const checkUserEnrollmentHistory = async () => {
      if (!isOpen || !user) {
        setIsCheckingProfile(false);
        return;
      }

      try {
        setIsCheckingProfile(true);
        
        // Check if user has any previous enrollments
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (enrollmentError) {
          console.error('Error checking enrollments:', enrollmentError);
          setHasExistingProfile(false);
          setIsCheckingProfile(false);
          return;
        }

        // If user has previous enrollments, check if profile has complete info
        if (enrollments && enrollments.length > 0) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, phone, address_line1, city, state, country, pincode, highest_qualification')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setHasExistingProfile(false);
          } else {
            // Check if profile has essential information for direct enrollment
            const hasCompleteProfile = profile &&
              profile.full_name &&
              profile.phone &&
              profile.address_line1 &&
              profile.city &&
              profile.state;

            setHasExistingProfile(!!hasCompleteProfile);
            
            if (hasCompleteProfile) {
              setShowDirectEnrollment(true);
            }
          }
        } else {
          setHasExistingProfile(false);
        }
      } catch (error) {
        console.error('Error checking user enrollment history:', error);
        setHasExistingProfile(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkUserEnrollmentHistory();
  }, [isOpen, user?.id, supabase]);

  // Indian states list
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
    "West Bengal"
  ];

  // City list based on state
  const getCitiesByState = (state: string): string[] => {
    const cityMap: { [key: string]: string[] } = {
      "Andhra Pradesh": [
        "Adoni", "Anantapur", "Bhimavaram", "Chirala", "Chittoor", "Dharmavaram", "Eluru", "Gudivada", "Guntur", "Guntakal",
        "Hindupur", "Kadapa", "Kakinada", "Kurnool", "Machilipatnam", "Madanapalle", "Mangalagiri", "Narasaraopet", "Nellore",
        "Ongole", "Parvathipuram", "Proddatur", "Rajahmundry", "Srikakulam", "Tadipatri", "Tenali", "Tirupati", "Vijayawada",
        "Visakhapatnam", "Vizianagaram"
      ].sort(),
      "Arunachal Pradesh": [
        "Aalo", "Anini", "Basar", "Bomdila", "Changlang", "Daporijo", "Deomali", "Hawai", "Itanagar", "Khonsa",
        "Longding", "Naharlagun", "Namsai", "Pasighat", "Roing", "Seppa", "Tawang", "Tezu", "Yingkiong", "Ziro"
      ].sort(),
      "Assam": [
        "Barpeta", "Bongaigaon", "Dhemaji", "Dhubri", "Dibrugarh", "Diphu", "Duliajan", "Goalpara", "Golaghat", "Guwahati",
        "Haflong", "Hojai", "Jorhat", "Karimganj", "Kokrajhar", "Lanka", "Lumding", "Mangaldoi", "Margherita", "Morigaon",
        "Nagaon", "Namrup", "North Lakhimpur", "Rangia", "Sibsagar", "Silchar", "Sivasagar", "Sonari", "Tezpur", "Tinsukia"
      ].sort(),
      "Bihar": [
        "Arrah", "Aurangabad", "Bagaha", "Begusarai", "Bettiah", "Bhagalpur", "Bihar Sharif", "Buxar", "Chapra", "Darbhanga",
        "Dehri", "Gaya", "Hajipur", "Jamalpur", "Jehanabad", "Katihar", "Kishanganj", "Lakhisarai", "Madhubani", "Motihari",
        "Munger", "Muzaffarpur", "Nawada", "Patna", "Purnia", "Saharsa", "Samastipur", "Sasaram", "Sitamarhi", "Siwan"
      ].sort(),
      "Chhattisgarh": [
        "Akaltara", "Ambikapur", "Baikunthpur", "Baloda Bazar", "Bhatapara", "Bhilai", "Bhilai-Charoda", "Bilaspur", "Chirmiri", "Dhamtari",
        "Dongargarh", "Dongargaon", "Durg", "Jagdalpur", "Kanker", "Katghora", "Kawardha", "Kirandul", "Kondagaon", "Korba",
        "Mahasamund", "Mungeli", "Naila Janjgir", "Pakhanjore", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Surajpur", "Tilda Newra"
      ].sort(),
      "Goa": [
        "Aldona", "Anjuna", "Arambol", "Benaulim", "Bicholim", "Calangute", "Canacona", "Candolim", "Colva", "Cortalim",
        "Cuncolim", "Curchorem", "Majorda", "Mandrem", "Marcel", "Margao", "Morjim", "Panaji", "Pernem", "Ponda",
        "Porvorim", "Quepem", "Reis Magos", "Sanquelim", "Sanguem", "Shiroda", "Vagator", "Valpoi", "Vasco da Gama"
      ].sort(),
      "Gujarat": [
        "Ahmedabad", "Amreli", "Anand", "Ankleshwar", "Bharuch", "Bhavnagar", "Bhuj", "Botad", "Dahod", "Deesa",
        "Gandhidham", "Gandhinagar", "Godhra", "Jamnagar", "Jetpur", "Junagadh", "Mehsana", "Morbi", "Nadiad", "Navsari",
        "Palanpur", "Patan", "Porbandar", "Rajkot", "Surendranagar", "Surat", "Vadodara", "Vapi", "Veraval", "Wadhwan"
      ].sort(),
      "Haryana": [
        "Ambala", "Bahadurgarh", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gohana", "Gurugram", "Hansi", "Hisar",
        "Jind", "Kaithal", "Karnal", "Kosli", "Mahendraganj", "Narnaul", "Narwana", "Palwal", "Panchkula", "Panipat",
        "Pehowa", "Rewari", "Rohtak", "Samalkha", "Shahbad", "Sirsa", "Sonipat", "Thanesar", "Tohana", "Yamunanagar"
      ].sort(),
      "Himachal Pradesh": [
        "Arki", "Baddi", "Bilaspur", "Chamba", "Dalhousie", "Dharamshala", "Hamirpur", "Jogindernagar", "Kalpa", "Kangra",
        "Kasauli", "Keylong", "Kullu", "Manali", "Mcleodganj", "Nahan", "Nalagarh", "Nurpur", "Palampur", "Paonta Sahib",
        "Parwanoo", "Rampur", "Rohru", "Shimla", "Solan", "Sundernagar", "Sujanpur", "Theog", "Una"
      ].sort(),
      "Jharkhand": [
        "Bokaro", "Bundu", "Chakradharpur", "Chandil", "Chatra", "Deoghar", "Dhanbad", "Dumka", "Garhwa", "Giridih",
        "Godda", "Gomoh", "Gumla", "Hazaribagh", "Jamshedpur", "Jamtara", "Khunti", "Lohardaga", "Madhupur", "Medininagar",
        "Mihijam", "Pakur", "Phusro", "Rajmahal", "Ramgarh", "Ranchi", "Sahibganj", "Saraikela", "Simdega"
      ].sort(),
      "Karnataka": [
        "Bagalkot", "Ballari", "Belagavi", "Bengaluru", "Bhadravati", "Bidar", "Chamrajnagar", "Chikkamagaluru", "Chitradurga", "Davanagere",
        "Gadag", "Gokak", "Hassan", "Haveri", "Hospet", "Hubballi", "Kalaburagi", "Kolar", "Madikeri", "Mandya",
        "Mangaluru", "Mysuru", "Puttur", "Raichur", "Ramanagara", "Robertsonpet", "Shivamogga", "Tumakuru", "Udupi", "Vijayapura"
      ].sort(),
      "Kerala": [
        "Alappuzha", "Chavakkad", "Cherthala", "Guruvayur", "Idukki", "Kannur", "Kasaragod", "Kochi", "Kodungallur", "Kottayam",
        "Kozhikode", "Kunnamkulam", "Koyilandy", "Malappuram", "Manjeri", "Nileshwaram", "Ottappalam", "Palakkad", "Pathanamthitta", "Payyannur",
        "Perinthalmanna", "Ponnani", "Taliparamba", "Thalassery", "Thiruvananthapuram", "Thrissur", "Tirur", "Vadakkanchery", "Vatakara"
      ].sort(),
      "Madhya Pradesh": [
        "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Dewas", "Guna", "Gwalior",
        "Hoshangabad", "Indore", "Itarsi", "Jabalpur", "Khandwa", "Khargone", "Mandsaur", "Morena", "Neemuch", "Pithampur",
        "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shivpuri", "Singrauli", "Ujjain", "Vidisha"
      ].sort(),
      "Maharashtra": [
        "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Bhiwandi", "Bhusawal", "Chandrapur", "Dhule", "Ichalkaranji", "Jalgaon",
        "Jalna", "Kalyan-Dombivli", "Kolhapur", "Latur", "Malegaon", "Mumbai", "Nagpur", "Nanded", "Nashik", "Navi Mumbai",
        "Panvel", "Parbhani", "Pune", "Sangli", "Satara", "Solapur", "Thane", "Ulhasnagar", "Vasai-Virar", "Yavatmal"
      ].sort(),
      "Manipur": [
        "Andro", "Bishnupur", "Chandel", "Churachandpur", "Heingang", "Imphal", "Jiribam", "Kakching", "Kangpokpi", "Kongba",
        "Kumbi", "Kwakta", "Lilong", "Mayang Imphal", "Moirang", "Moreh", "Nambol", "Ningthoukhong", "Nungba", "Oinam",
        "Pherzawl", "Samurou", "Sekmai", "Senapati", "Sikhong Sekmai", "Sugnu", "Thoubal", "Ukhrul", "Wangjing", "Yairipok"
      ].sort(),
      "Meghalaya": [
        "Ampati", "Baghmara", "Betasing", "Cherrapunji", "Dadengiri", "Dadenggre", "Dalu", "Garobadha", "Jowai", "Khliehriat",
        "Laitumkhrah", "Madanriting", "Mahendraganj", "Mairang", "Mankachar", "Mawkyrwat", "Mawlai", "Mendipathar", "Nongpoh", "Nongstoin",
        "Nongthymmai", "Pynursla", "Raksamgre", "Resubelpara", "Rongjeng", "Selsella", "Shillong", "Tura", "Umroi", "Williamnagar"
      ].sort(),
      "Mizoram": [
        "Aizawl", "Bairabi", "Bunghmun", "Champhai", "Darlawn", "Hnahthial", "Kawrthah", "Keifang", "Khawhai", "Khawzawl",
        "Kolasib", "Lawngtlai", "Lengpui", "Lunglei", "Mamit", "North Vanlaiphai", "Phullen", "Saiha", "Saitual", "Samtlang",
        "Serchhip", "Thenzawl", "Thingfal", "Tlabung", "Tuidam", "Vairengte", "West Phaileng", "Zawlnuam", "Zobawk", "Zokhawthar"
      ].sort(),
      "Nagaland": [
        "Aboi", "Aghunato", "Changtongya", "Chen", "Chozuba", "Dimapur", "Jalukie", "Kiphire", "Kohima", "Longkhim",
        "Longleng", "Mangkolemba", "Medziphema", "Meluri", "Mon", "Mokokchung", "Naginimora", "Noklak", "Peren", "Pfutsero",
        "Phek", "Shamator", "Tening", "Tizit", "Tobu", "Tseminyu", "Tuli", "Tuensang", "Wokha", "Zunheboto"
      ].sort(),
      "Odisha": [
        "Angul", "Balasore", "Baripada", "Bargarh", "Berhampur", "Bhadrak", "Bhawanipatna", "Bhubaneswar", "Bolangir", "Boudh",
        "Cuttack", "Dhenkanal", "Jajpur", "Jeypore", "Jharsuguda", "Kendrapara", "Kendujhargarh", "Keonjhar", "Koraput", "Nabarangpur",
        "Nayagarh", "Paradip", "Phulbani", "Puri", "Rayagada", "Rourkela", "Sambalpur", "Soro", "Sundargarh", "Talcher"
      ].sort(),
      "Punjab": [
        "Abohar", "Amritsar", "Barnala", "Batala", "Bathinda", "Faridkot", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
        "Kapurthala", "Khanna", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Mohali", "Muktsar", "Nabha", "Nangal",
        "Nakodar", "Nawanshahr", "Pathankot", "Patiala", "Phagwara", "Rajpura", "Ropar", "Sangrur", "Tarn Taran", "Zira"
      ].sort(),
      "Rajasthan": [
        "Ajmer", "Alwar", "Banswara", "Baran", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh",
        "Churu", "Dausa", "Dhaulpur", "Gangapur City", "Hanumangarh", "Hindaun", "Jaipur", "Jaisalmer", "Jhunjhunu", "Jodhpur",
        "Kishangarh", "Kota", "Nagaur", "Pali", "Sawai Madhopur", "Sikar", "Sri Ganganagar", "Sujangarh", "Tonk", "Udaipur"
      ].sort(),
      "Sikkim": [
        "Chungthang", "Dentam", "Dikchu", "Gangtok", "Gyalshing", "Hee", "Jorethang", "Lachen", "Lachung", "Legship",
        "Makha", "Mangan", "Namchi", "Namthang", "Nayabazar", "Pakyong", "Pelling", "Phodong", "Ranipool", "Ravangla",
        "Rhenock", "Rinchenpong", "Rangpo", "Singtam", "Soreng", "Tashiding", "Toong", "Yangang", "Yuksom"
      ].sort(),
      "Tamil Nadu": [
        "Ambur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Gudiyatham", "Hosur", "Kancheepuram",
        "Karur", "Kumbakonam", "Madurai", "Nagercoil", "Namakkal", "Ooty", "Pollachi", "Pudukkottai", "Rajapalayam", "Salem",
        "Sivakasi", "Thanjavur", "Theni", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Thoothukudi", "Vaniyambadi", "Vellore"
      ].sort(),
      "Telangana": [
        "Adilabad", "Bhadrachalam", "Bodhan", "Gadwal", "Hyderabad", "Jagitial", "Jangaon", "Kamareddy", "Karimnagar", "Khammam",
        "Kothagudem", "Mahbubnagar", "Mancherial", "Medak", "Miryalaguda", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Ramagundam",
        "Sangareddy", "Secunderabad", "Siddipet", "Sircilla", "Suryapet", "Tandur", "Vikarabad", "Wanaparthy", "Warangal", "Yellandu"
      ].sort(),
      "Tripura": [
        "Agartala", "Ambassa", "Amarpur", "Belonia", "Bishalgarh", "Boxanagar", "Dharmanagar", "Jampuijala", "Jirania", "Jumpuijala",
        "Kailasahar", "Kamalpur", "Kanchanpur", "Karbook", "Khowai", "Kumarghat", "Longtharai Valley", "Mandai", "Matabari", "Melaghar",
        "Mohanpur", "Panisagar", "Ranirbazar", "Sabroom", "Salema", "Santir Bazar", "Sonamura", "Teliamura", "Udaipur"
      ].sort(),
      "Uttar Pradesh": [
        "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat",
        "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun",
        "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
        "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur",
        "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow",
        "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Noida",
        "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli",
        "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
      ].sort(),
      "Uttarakhand": [
        "Almora", "Bageshwar", "Bajpur", "Bhimtal", "Champawat", "Chamoli", "Dehradun", "Gopeshwar", "Haldwani", "Haridwar",
        "Jaspur", "Joshimath", "Kashipur", "Kichha", "Kotdwar", "Lansdowne", "Mussoorie", "Nainital", "Pauri", "Pithoragarh",
        "Ramnagar", "Ranikhet", "Rishikesh", "Roorkee", "Rudrapur", "Sitarganj", "Srinagar", "Tanakpur", "Tehri", "Uttarkashi"
      ].sort(),
      "West Bengal": [
        "Alipurduar", "Asansol", "Baharampur", "Balurghat", "Bangaon", "Bankura", "Bardhaman", "Basirhat", "Chakdaha", "Cooch Behar",
        "Dankuni", "Darjeeling", "Dhulian", "Durgapur", "Habra", "Haldia", "Howrah", "Jalpaiguri", "Jangipur", "Kharagpur",
        "Kolkata", "Krishnanagar", "Malda", "Medinipur", "Nabadwip", "Purulia", "Raiganj", "Ranaghat", "Shantipur", "Siliguri"
      ].sort()
    };
    return cityMap[state] || [];
  };

  // Handle direct enrollment for users with existing profile
  const handleDirectEnrollment = async () => {
    setIsLoading(true);

    try {
      // Check if enrollments are enabled
      const settings = await getSiteSettings();
      if (!settings.enrollmentsEnabled) {
        throw new Error('Enrollment is currently disabled. Please try again later.');
      }

      // Use the new enrollment API endpoint with direct enrollment flag
      const enrollmentResponse = await fetch('/api/enrollment/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          directEnrollment: true // Flag to indicate this is a direct enrollment
        }),
      });

      const enrollmentData = await enrollmentResponse.json();

      if (!enrollmentResponse.ok) {
        if (enrollmentData.requiresAuth) {
          toast.error('Please log in to enroll in this course');
          router.push('/auth/login?redirect=enrollment');
          return;
        }
        throw new Error(enrollmentData.message || 'Failed to enroll in the course');
      }

      toast.success(`Successfully enrolled in the course! You are now a ${enrollmentData.userRole}.`);
      router.push('/dashboard/courses');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll in the course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if enrollments are enabled
      const settings = await getSiteSettings();
      if (!settings.enrollmentsEnabled) {
        throw new Error('Enrollment is currently disabled. Please try again later.');
      }

      // If user is not logged in, redirect to login with enrollment intent
      if (!user) {
        // Store enrollment intent in localStorage
        localStorage.setItem('enrollmentIntent', JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          userDetails: formData
        }));
        
        toast.error('Please log in to enroll in this course');
        router.push('/auth/login?redirect=enrollment');
        return;
      }

      // Use the new enrollment API endpoint
      const enrollmentResponse = await fetch('/api/enrollment/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          userDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            state: formData.state,
            city: formData.city,
            country: formData.country,
            pincode: formData.pincode,
            highestQualification: formData.highestQualification,
            degreeName: formData.degreeName,
            hasLaptop: formData.hasLaptop
          }
        }),
      });

      const enrollmentData = await enrollmentResponse.json();

      if (!enrollmentResponse.ok) {
        if (enrollmentData.requiresAuth) {
          // Store enrollment intent and redirect to login
          localStorage.setItem('enrollmentIntent', JSON.stringify({
            courseId: course.id,
            courseTitle: course.title,
            userDetails: formData
          }));
          
          toast.error('Please log in to enroll in this course');
          router.push('/auth/login?redirect=enrollment');
          return;
        }
        throw new Error(enrollmentData.message || 'Failed to enroll in the course');
      }

      toast.success(`Successfully enrolled in the course! You are now a ${enrollmentData.userRole}.`);
      router.push('/dashboard/courses');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll in the course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => !isLoading && onClose()} 
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Enroll in Course
          </Dialog.Title>

          <div className="mt-4">
            {isCheckingProfile ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-sm text-gray-600">Checking your profile...</span>
              </div>
            ) : showDirectEnrollment && hasExistingProfile ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Welcome back! Since you've enrolled in courses before, you can enroll directly.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <strong>Quick Enrollment:</strong> We'll use your existing profile information to enroll you directly. A confirmation email will be sent to you.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => !isLoading && onClose()}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDirectEnrollment(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Fill Form Instead
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectEnrollment}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Please fill in your details to enroll in {course.title}
                </p>
                <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">Address Details</h3>
                  
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          state: e.target.value,
                          city: '' // Reset city when state changes
                        });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <select
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      disabled={isLoading || !formData.state}
                    >
                      <option value="">Select City</option>
                      {getCitiesByState(formData.state).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="highestQualification" className="block text-sm font-medium text-gray-700">
                    Highest Qualification
                  </label>
                  <select
                    id="highestQualification"
                    value={formData.highestQualification}
                    onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select qualification</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">Ph.D.</option>
                  </select>
                </div>

                {(formData.highestQualification === 'bachelors' || formData.highestQualification === 'masters') && (
                  <div>
                    <label htmlFor="degreeName" className="block text-sm font-medium text-gray-700">
                      Degree Name
                    </label>
                    <input
                      type="text"
                      id="degreeName"
                      value={formData.degreeName}
                      onChange={(e) => setFormData({ ...formData, degreeName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={`Enter your ${formData.highestQualification === 'bachelors' ? "Bachelor's" : "Master's"} degree name`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="hasLaptop"
                      type="checkbox"
                      checked={formData.hasLaptop}
                      onChange={(e) => setFormData({ ...formData, hasLaptop: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="hasLaptop" className="font-medium text-gray-700">
                      Do you have access to a laptop?
                    </label>
                    <p className="text-gray-500">This is required for completing course assignments and projects.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => !isLoading && onClose()}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EnrollmentModal;