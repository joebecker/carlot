import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Calendar, Gauge, Fuel, Heart, Filter, Menu, X, Plus, Edit, Trash2, BarChart3, Calculator, Mail, Phone, User, MessageSquare, LogOut, LogIn } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const CarLot = () => {
  // Auth states
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState('marketplace'); // marketplace, dashboard, financing, cardetail
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [viewingCarId, setViewingCarId] = useState(null);
  
  // Financing calculator states
  const [loanAmount, setLoanAmount] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(60);

  // Check for existing session on mount
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth functions
  const handleSignUp = async (email, password) => {
    if (!supabase) {
      alert('Database not configured. Please add Supabase credentials.');
      return;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the confirmation link!');
      setShowAuthModal(false);
    }
  };

  const handleLogin = async (email, password) => {
    if (!supabase) {
      alert('Database not configured. Please add Supabase credentials.');
      return;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      setShowAuthModal(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    setCurrentView('marketplace');
  };

  const handleForgotPassword = async (email) => {
    if (!supabase) {
      alert('Database not configured. Please add Supabase credentials.');
      return;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the password reset link!');
    }
  };


  // Sample car listings - in production, this would come from a database
  const listings = [
    {
      id: 1,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 42990,
      mileage: 8500,
      location: 'San Francisco, CA',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'
      ],
      fuel: 'Electric',
      transmission: 'Automatic',
      color: 'Pearl White',
      vin: '5YJ3E1EA1PF123456',
      seller: 'Premium Auto',
      sellerEmail: 'contact@premiumauto.com',
      sellerPhone: '(555) 123-4567',
      featured: true,
      description: 'Excellent condition, one owner, full service history. This Tesla Model 3 is loaded with premium features including autopilot, premium audio, and white interior. Regularly serviced at Tesla service center.',
      features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'White Interior', 'Heated Seats', 'Navigation', 'Backup Camera', 'Bluetooth']
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      price: 24500,
      mileage: 15200,
      location: 'Los Angeles, CA',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80'
      ],
      fuel: 'Gasoline',
      transmission: 'CVT Automatic',
      color: 'Sonic Gray',
      vin: '2HGFC2F59NH123456',
      seller: 'City Motors',
      sellerEmail: 'sales@citymotors.com',
      sellerPhone: '(555) 234-5678',
      featured: false,
      description: 'Great fuel economy, clean title, no accidents. Well maintained with complete service records. Perfect commuter car with excellent reliability.',
      features: ['Lane Departure Warning', 'Adaptive Cruise Control', 'Apple CarPlay', 'Android Auto', 'Backup Camera', 'Bluetooth', 'USB Ports']
    },
    {
      id: 3,
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      price: 52000,
      mileage: 5000,
      location: 'Austin, TX',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
      ],
      fuel: 'Gasoline',
      transmission: '10-Speed Automatic',
      color: 'Agate Black',
      vin: '1FTFW1E50PFA12345',
      seller: 'Truck World',
      sellerEmail: 'info@truckworld.com',
      sellerPhone: '(555) 345-6789',
      featured: true,
      description: 'Lifted, premium wheels, towing package. This F-150 has been professionally lifted and comes with a comprehensive towing package. Perfect for work or weekend adventures.',
      features: ['4WD', 'Towing Package', 'Lifted Suspension', 'Premium Wheels', 'Tonneau Cover', 'Bed Liner', 'Running Boards', 'LED Lights', 'Navigation']
    },
    {
      id: 4,
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      price: 38900,
      mileage: 22000,
      location: 'Miami, FL',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'
      ],
      fuel: 'Gasoline',
      transmission: '8-Speed Automatic',
      color: 'Alpine White',
      vin: 'WBA8E9C51LK123456',
      seller: 'Luxury Auto Group',
      sellerEmail: 'luxury@autogroup.com',
      sellerPhone: '(555) 456-7890',
      featured: false,
      description: 'Premium package, navigation, leather interior. Meticulously maintained with full BMW service history. Drives like new with all the luxury features you expect from BMW.',
      features: ['Premium Package', 'Navigation', 'Leather Seats', 'Sunroof', 'Heated Seats', 'Parking Sensors', 'Keyless Entry', 'Dual Climate']
    },
    {
      id: 5,
      make: 'Toyota',
      model: 'RAV4',
      year: 2023,
      price: 32500,
      mileage: 12000,
      location: 'Seattle, WA',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'
      ],
      fuel: 'Hybrid',
      transmission: 'CVT',
      color: 'Blueprint',
      vin: '2T3P1RFV8PC123456',
      seller: 'Pacific Motors',
      sellerEmail: 'contact@pacificmotors.com',
      sellerPhone: '(555) 567-8901',
      featured: false,
      description: 'Hybrid efficiency, AWD, safety features. Get amazing fuel economy without sacrificing power or capability. Perfect family SUV with advanced safety features.',
      features: ['AWD', 'Hybrid System', 'Toyota Safety Sense', 'Blind Spot Monitor', 'Rear Cross Traffic', 'Apple CarPlay', 'Roof Rails', 'Power Liftgate']
    },
    {
      id: 6,
      make: 'Porsche',
      model: '911',
      year: 2022,
      price: 118000,
      mileage: 3500,
      location: 'New York, NY',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'
      ],
      fuel: 'Gasoline',
      transmission: '7-Speed PDK',
      color: 'Guards Red',
      vin: 'WP0AA2A99NS123456',
      seller: 'Elite Autos',
      sellerEmail: 'elite@autos.com',
      sellerPhone: '(555) 678-9012',
      featured: true,
      description: 'Immaculate condition, sports package, carbon fiber. This 911 is a true driver\'s car with every performance option. Garage kept and meticulously maintained.',
      features: ['Sport Chrono', 'Carbon Fiber Package', 'Sport Exhaust', 'PASM', 'Porsche Communication', 'Sport Seats Plus', 'LED Headlights', 'Bose Audio']
    }
  ];

  // Seller's listings (for dashboard)
  const myListings = [
    {
      id: 101,
      make: 'Chevrolet',
      model: 'Camaro',
      year: 2020,
      price: 35000,
      mileage: 18000,
      views: 245,
      inquiries: 12,
      status: 'active',
      listedDate: '2024-01-15'
    },
    {
      id: 102,
      make: 'Jeep',
      model: 'Wrangler',
      year: 2021,
      price: 42000,
      mileage: 25000,
      views: 389,
      inquiries: 23,
      status: 'active',
      listedDate: '2024-01-10'
    }
  ];

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const filteredListings = listings.filter(car => {
    const matchesSearch = searchTerm === '' || 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'under25k' && car.price < 25000) ||
      (priceRange === '25k-50k' && car.price >= 25000 && car.price < 50000) ||
      (priceRange === 'over50k' && car.price >= 50000);
    
    return matchesSearch && matchesPrice;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (miles) => {
    return new Intl.NumberFormat('en-US').format(miles);
  };

  // Financing Calculator Logic
  const calculateMonthlyPayment = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - (loanAmount - downPayment);

  // Auth Modal Component
  const AuthModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        handleSignUp(email, password);
      } else {
        if (showForgotPassword) {
          handleForgotPassword(email);
          setShowForgotPassword(false);
        } else {
          handleLogin(email, password);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">
              {showForgotPassword ? 'Reset Password' : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h3>
            <button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            {!showForgotPassword && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              {showForgotPassword ? 'Send Reset Link' : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {!showForgotPassword && (
            <>
              {authMode === 'login' && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {authMode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </>
          )}

          {showForgotPassword && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Contact Modal Component
  const ContactModal = ({ car, onClose }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      message: `I'm interested in the ${car.year} ${car.make} ${car.model}.`
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      alert('Message sent! The seller will contact you shortly.');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Contact Seller</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold">{car.year} {car.make} {car.model}</p>
            <p className="text-blue-600 font-bold">{formatPrice(car.price)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User size={16} className="inline mr-1" />
                Your Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail size={16} className="inline mr-1" />
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone size={16} className="inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageSquare size={16} className="inline mr-1" />
                Message
              </label>
              <textarea
                rows="4"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Seller Dashboard Component
  const SellerDashboard = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your listings and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">634</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">35</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageSquare className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">$77k</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Add New Listing Button */}
        <div className="mb-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            <Plus size={20} />
            Add New Listing
          </button>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Listings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiries</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {listing.year} {listing.make} {listing.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatMileage(listing.mileage)} miles
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-semibold">{formatPrice(listing.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{listing.views}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{listing.inquiries}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit size={18} className="inline" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Financing Calculator Component
  const FinancingCalculator = () => {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auto Loan Calculator</h1>
          <p className="text-gray-600">Calculate your monthly car payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Loan Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={loanAmount}
                  step="1000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (months)
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={24}>24 months (2 years)</option>
                  <option value={36}>36 months (3 years)</option>
                  <option value={48}>48 months (4 years)</option>
                  <option value={60}>60 months (5 years)</option>
                  <option value={72}>72 months (6 years)</option>
                  <option value={84}>84 months (7 years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-md text-white">
              <h2 className="text-lg font-semibold mb-2 opacity-90">Estimated Monthly Payment</h2>
              <p className="text-5xl font-bold mb-4">{formatPrice(monthlyPayment)}</p>
              <p className="text-sm opacity-90">per month for {loanTerm} months</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Vehicle Price</span>
                  <span className="font-semibold text-gray-900">{formatPrice(loanAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Down Payment</span>
                  <span className="font-semibold text-gray-900">-{formatPrice(downPayment)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-gray-900">{formatPrice(loanAmount - downPayment)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold text-red-600">{formatPrice(totalInterest)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-bold">Total Amount Paid</span>
                  <span className="font-bold text-gray-900 text-xl">{formatPrice(totalPayment + downPayment)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> A larger down payment can significantly reduce your monthly payment and total interest paid.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Car Detail Page Component
  const CarDetailPage = () => {
    const car = listings.find(c => c.id === viewingCarId);
    
    if (!car) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>Car not found</p>
          <button 
            onClick={() => setCurrentView('marketplace')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Listings
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => setCurrentView('marketplace')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={car.image} 
                alt={`${car.year} ${car.make} ${car.model}`}
                className="w-full h-96 object-cover"
              />
              
              {/* Thumbnail Images */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {car.images?.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Make</p>
                  <p className="font-semibold text-gray-900">{car.make}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-semibold text-gray-900">{car.model}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-semibold text-gray-900">{car.year}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-semibold text-gray-900">{formatMileage(car.mileage)} miles</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-semibold text-gray-900">{car.fuel}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-semibold text-gray-900">{car.transmission}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-semibold text-gray-900">{car.color}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">VIN</p>
                  <p className="font-semibold text-gray-900 text-sm">{car.vin}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {car.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={20} className="text-blue-600" />
                <span>{car.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-4xl font-bold text-blue-600">{formatPrice(car.price)}</p>
                </div>

                {car.featured && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">⭐ Featured Listing</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setShowContactModal(true);
                    }}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                  >
                    Contact Seller
                  </button>
                  
                  <button
                    onClick={() => toggleFavorite(car.id)}
                    className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition flex items-center justify-center gap-2"
                  >
                    <Heart 
                      size={20} 
                      className={favorites.has(car.id) ? "fill-blue-600" : ""}
                    />
                    {favorites.has(car.id) ? 'Saved' : 'Save Listing'}
                  </button>

                  <button
                    onClick={() => {
                      setLoanAmount(car.price);
                      setCurrentView('financing');
                    }}
                    className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition flex items-center justify-center gap-2"
                  >
                    <Calculator size={20} />
                    Calculate Payment
                  </button>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Seller</p>
                    <p className="font-semibold text-gray-900">{car.seller}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={18} className="text-blue-600" />
                    <span>{car.sellerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={18} className="text-blue-600" />
                    <span className="text-sm">{car.sellerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Safety Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Meet in a public place</li>
                  <li>• Inspect vehicle thoroughly</li>
                  <li>• Request vehicle history report</li>
                  <li>• Never wire money</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-blue-600 cursor-pointer" onClick={() => setCurrentView('marketplace')}>
                CarLot.com
              </h1>
              <span className="ml-3 text-sm text-gray-500 hidden sm:block">Your Premium Car Marketplace</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setCurrentView('marketplace')}
                className={`font-medium ${currentView === 'marketplace' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => {
                  if (user) {
                    setCurrentView('dashboard');
                  } else {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }
                }}
                className={`font-medium ${currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Sell
              </button>
              <button 
                onClick={() => setCurrentView('financing')}
                className={`font-medium ${currentView === 'financing' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Finance
              </button>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 text-gray-700">
                    <User size={20} className="text-blue-600" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
              )}
              <button 
                onClick={() => {
                  if (user) {
                    setCurrentView('dashboard');
                  } else {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                List Your Car
              </button>
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-3">
                <button onClick={() => { setCurrentView('marketplace'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium">Buy</button>
                <button onClick={() => { 
                  if (user) {
                    setCurrentView('dashboard');
                  } else {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }
                  setMobileMenuOpen(false); 
                }} className="text-left text-gray-700 hover:text-blue-600 font-medium">Sell</button>
                <button onClick={() => { setCurrentView('financing'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium">Finance</button>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
                {user ? (
                  <>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                      <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-red-600 hover:text-red-700 font-medium">Logout</button>
                    </div>
                  </>
                ) : (
                  <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); setMobileMenuOpen(false); }} className="text-left text-blue-600 hover:text-blue-700 font-medium">Sign In</button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Conditional View Rendering */}
      {currentView === 'dashboard' && <SellerDashboard />}
      {currentView === 'financing' && <FinancingCalculator />}
      {currentView === 'cardetail' && <CarDetailPage />}
      
      {currentView === 'marketplace' && (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">Find Your Perfect Car</h2>
                <p className="text-xl mb-8 text-blue-100">Browse thousands of quality vehicles from trusted sellers</p>
                
                {/* Search Bar */}
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search by make, model..."
                        className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Listings */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <span className="font-medium text-gray-700">Filters:</span>
                </div>
                
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="under25k">Under $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="over50k">Over $50,000</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Years</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Fuel Types</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                  <option>Gasoline</option>
                  <option>Diesel</option>
                </select>

                <div className="ml-auto text-gray-600">
                  <span className="font-medium">{filteredListings.length}</span> vehicles found
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(car => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    {car.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </div>
                    )}
                    <button 
                      onClick={() => toggleFavorite(car.id)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
                    >
                      <Heart 
                        size={20} 
                        className={favorites.has(car.id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    
                    <div className="flex items-center text-2xl font-bold text-blue-600 mb-4">
                      {formatPrice(car.price)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Gauge size={16} className="mr-2" />
                        {formatMileage(car.mileage)} miles
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Fuel size={16} className="mr-2" />
                        {car.fuel}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={16} className="mr-2" />
                        {car.location}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setViewingCarId(car.id);
                          setCurrentView('cardetail');
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedCar(car);
                          setShowContactModal(true);
                        }}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition"
                      >
                        Contact
                      </button>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      Seller: {car.seller}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Sell Your Car?</h2>
                <p className="text-xl text-gray-300 mb-8">List your vehicle and reach thousands of buyers</p>
                <button 
                  onClick={() => {
                    if (user) {
                      setCurrentView('dashboard');
                    } else {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium transition"
                >
                  Get Started - It's Free
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && <AuthModal />}

      {/* Contact Modal */}
      {showContactModal && selectedCar && (
        <ContactModal car={selectedCar} onClose={() => setShowContactModal(false)} />
      )}

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">CarLot.com</h3>
              <p className="text-sm">Your trusted marketplace for buying and selling quality vehicles.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Browse Cars</a></li>
                <li><a href="#" className="hover:text-white" onClick={() => setCurrentView('financing')}>Financing Options</a></li>
                <li><a href="#" className="hover:text-white">Buyer's Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white" onClick={() => setCurrentView('dashboard')}>List Your Car</a></li>
                <li><a href="#" className="hover:text-white">Pricing Guide</a></li>
                <li><a href="#" className="hover:text-white">Seller Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 CarLot.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Missing Eye import - adding it here
const Eye = ({ size, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default CarLot;