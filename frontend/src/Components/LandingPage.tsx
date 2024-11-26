import React, { useState, useEffect, useRef } from 'react';
import { motion} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { 
  Bot, 
  Mail, 
  BarChart, 
  Search, 
  CheckCircle, 
  Users,
  Database,
  Timer,
  MessageSquare,
  ChevronDown,
  FileText,
  ArrowRight,
  Video,
  MessageCircle
} from 'lucide-react';
import ConfirmationModal from '../Components/ConfirmationModal';
import { handleWaitList } from '../api/handleWaitList';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [use_case, setuse_case] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const metrics = [
    { value: '70%', label: 'Better Information Retention' },
    { value: '3x', label: 'Faster Learning Speed' },
    { value: '85%', label: 'Student Engagement Increase' }
  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-purple-400" />,
      title: 'Easy Content Upload',
      description: 'Upload any study material - PDFs, docs, or links, and let our AI do the magic'
    },
    {
      icon: <Video className="w-6 h-6 text-purple-400" />,
      title: 'TikTok-Style Learning',
      description: 'Transform boring study material into engaging, short-form educational content'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-400" />,
      title: 'Interactive Learning Bot',
      description: 'Ask questions via voice or text to deepen your understanding'
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: 'Gen Alpha Engagement',
      description: 'Connect with students through their preferred entertainment medium'
    }
  ];

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    if (user) {
      setShowLogoutConfirmation(true);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirmation(false);
  };

  const scrollTo = (ref: React.MutableRefObject<HTMLElement>) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Position validation
    if (!position.trim()) {
      newErrors.position = 'Position is required';
    }

    // Use case validation
    if (!use_case.trim()) {
      newErrors.use_case = 'Use case is required';
    } else if (use_case.trim().length < 10) {
      newErrors.use_case = 'Please provide more details (at least 10 characters)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await handleWaitList({
        email,
        name,
        position,
        use_case
      });
      
      setIsSubmitted(true);
      // Reset form
      setEmail('');
      setName('');
      setPosition('');
      setuse_case('');
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    }
  };

  const navItems = [
    { label: 'Home', ref: heroRef },
    { label: 'About', ref: aboutRef },
    { label: 'Features', ref: featuresRef },
    { label: 'Contact', ref: contactRef }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="pt-16">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-sm border-b border-purple-900/30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <Bot className="w-12 h-12 text-purple-400" />
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  BRAINTOK
                </span>
              </motion.div>
              <div className="hidden md:flex items-center space-x-12">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.ref as React.MutableRefObject<HTMLElement>)}
                    className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                ))}
                <Link
                  to="/auth"
                  className="text-2xl font-medium bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text hover:from-purple-500 hover:to-pink-600 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section ref={heroRef} className="min-h-screen pt-32 pb-20 px-6 flex items-center">
          <div className="container mx-auto text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            >
              Education Meets<br />Gen Alpha's Language
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Transform boring study materials into addictive TikTok-style learning content. 
              Connect with students where they are - on their phones, speaking their language.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => window.location.href = '/auth'}
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full text-xl font-semibold transition-colors duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
            </motion.div>

            {/* Animated Metrics */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16"
            >
              <motion.div
                key={metrics[0].value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-purple-400 mb-3">
                  {metrics[0].value}
                </div>
                <div className="text-xl text-gray-400">
                  {metrics[0].label}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12"
            >
              <ChevronDown 
                className="w-12 h-12 text-purple-400 mx-auto animate-bounce cursor-pointer"
                onClick={() => scrollTo(aboutRef as React.MutableRefObject<HTMLElement>)}
              />
            </motion.div>
          </div>
        </section>
        {/* About Section */}
        <section ref={aboutRef} className="min-h-screen py-32 px-8 flex items-center">
        <div className="container mx-auto">
          <h2 className="text-6xl md:text-7xl font-bold mb-24 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            About BRAINTOK
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div>
              <p className="text-2xl text-gray-400 mb-12 leading-relaxed">
                We're revolutionizing how students learn by leveraging the power
                of artificial intelligence. Our platform combines advanced machine
                learning with years of educational expertise to create a tool that doesn't
                just automate - it enhances your entire learning process.
              </p>
              <div className="space-y-8">
                {[
                  { icon: <Users className="w-8 h-8" />, text: 'Built by educators for educators' },
                  { icon: <Timer className="w-8 h-8" />, text: 'Save 40+ hours per week per educator' },
                  { icon: <MessageSquare className="w-8 h-8" />, text: 'AI-powered personalization at scale' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-6 text-purple-400 text-xl"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-purple-900/20 p-12 rounded-xl border-2 border-purple-900/30 hover:border-purple-500/30 transition-all duration-300"
            >
              <h3 className="text-4xl font-semibold mb-10 text-purple-300">
                Why Choose BRAINTOK?
              </h3>
              <ul className="space-y-6">
                {[
                  'End-to-end learning automation',
                  'Advanced content creation and curation',
                  'Personalized learning experiences at scale',
                  'Real-time tracking and analytics',
                  'Seamless integration with your existing tools'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 text-xl text-gray-300"
                  >
                    <CheckCircle className="w-8 h-8 text-purple-400 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="min-h-screen py-32 bg-gray-900/50 flex items-center">
        <div className="container mx-auto px-8">
          <h2 className="text-6xl md:text-7xl font-bold mb-24 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-12 rounded-xl bg-black/40 border-2 border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-center justify-center mb-8">{React.cloneElement(feature.icon, { className: "w-16 h-16 text-purple-400" })}</div>
                <h3 className="text-3xl font-semibold mb-6 text-purple-300">
                  {feature.title}
                </h3>
                <p className="text-xl text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Diagram Section */}
      <section className="min-h-screen py-32 bg-black/40 flex items-center">
        <div className="container mx-auto px-8">
          <h2 className="text-6xl md:text-7xl font-bold mb-24 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-12 md:space-y-0 md:space-x-8">
            {/* Study Material */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-8 rounded-xl bg-black/40 border-2 border-purple-900/30"
            >
              <FileText className="w-16 h-16 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-purple-300 text-center">Study Material</h3>
              <p className="text-gray-400 text-center mt-2">PDFs, Docs, Links</p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <ArrowRight className="w-12 h-12 text-purple-400" />
            </motion.div>

            {/* BRAINTOK */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-8 rounded-xl bg-black/40 border-2 border-purple-900/30"
            >
              <Bot className="w-16 h-16 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-purple-300 text-center">BRAINTOK</h3>
              <p className="text-gray-400 text-center mt-2">AI Processing</p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <ArrowRight className="w-12 h-12 text-purple-400" />
            </motion.div>

            {/* TikTok Style Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-8 rounded-xl bg-black/40 border-2 border-purple-900/30"
            >
              <Video className="w-16 h-16 text-purple-400 mb-4" />
              <h3 className="text-2xl font-semibold text-purple-300 text-center">Educational Content</h3>
              <p className="text-gray-400 text-center mt-2">TikTok-Style Videos</p>
            </motion.div>
          </div>

          <div className="mt-24 text-center">
            <p className="text-2xl text-gray-400 mb-8">
              Gone are the days of reading long PDF documents. 
              Connect with students at their entertainment level.
            </p>
            <button
              onClick={() => scrollTo(contactRef as React.MutableRefObject<HTMLDivElement>)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 hover:transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section ref={contactRef} className="min-h-screen py-32 px-8 flex items-center">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Get Early Access
          </h2>
          <p className="text-2xl text-gray-400 mb-12 leading-relaxed">
            Join our waitlist to be among the first to experience the future of AI-powered learning.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="text-red-500 text-lg mb-4">{errors.submit}</div>
            )}
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-8 py-4 rounded-full bg-black/40 border-2 ${
                  errors.name ? 'border-red-500' : 'border-purple-900/30'
                } text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">{errors.name}</span>
              )}
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Position</span>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter your position"
                className={`w-full px-8 py-4 rounded-full bg-black/40 border-2 ${
                  errors.position ? 'border-red-500' : 'border-purple-900/30'
                } text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center`}
              />
              {errors.position && (
                <span className="text-red-500 text-sm mt-1">{errors.position}</span>
              )}
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-8 py-4 rounded-full bg-black/40 border-2 ${
                  errors.email ? 'border-red-500' : 'border-purple-900/30'
                } text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">{errors.email}</span>
              )}
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Use Case</span>
              <textarea
                value={use_case}
                onChange={(e) => setuse_case(e.target.value)}
                placeholder="Enter a brief description of how you plan to use BRAINTOK"
                className={`w-full px-8 py-4 rounded-2xl bg-black/40 border-2 ${
                  errors.use_case ? 'border-red-500' : 'border-purple-900/30'
                } text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center min-h-[120px]`}
              />
              {errors.use_case && (
                <span className="text-red-500 text-sm mt-1">{errors.use_case}</span>
              )}
            </label>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 hover:transform hover:scale-105"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </section>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirmation}
        onClose={() => {
          setShowLogoutConfirmation(false);
          navigate('/home');
        }}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="You are currently logged in. Would you like to logout and return to the landing page?"
        confirmText="Logout"
        cancelText="Go Back"
      />
    </div>
    </div>
  );
};

export default LandingPage;