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
  ChevronDown
} from 'lucide-react';
import { handleWaitList } from '../api/handleWaitList';
import ConfirmationModal from '../Components/ConfirmationModal';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [industry, setIndustry] = useState('');
  const [leadsPerWeek, setLeadsPerWeek] = useState<number>(0);
  const [companySize, setCompanySize] = useState('0-10');
  const [useCase, setUseCase] = useState('');
  const [currentMetric, setCurrentMetric] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const metrics = [
    { value: '85%', label: 'Lead Conversion Increase' },
    { value: '60%', label: 'Time Saved' },
    { value: '3x', label: 'ROI Improvement' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Database className="w-6 h-6 text-purple-400" />,
      title: 'Smart Lead Processing',
      description: 'Upload your leads via Google Sheets and let our AI handle the rest'
    },
    {
      icon: <Search className="w-6 h-6 text-purple-400" />,
      title: 'Advanced Research',
      description: 'Automatic lead validation and enrichment using multiple data sources'
    },
    {
      icon: <BarChart className="w-6 h-6 text-purple-400" />,
      title: 'Intelligent Scoring',
      description: 'Prioritize leads based on likelihood to convert using our ML models'
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-400" />,
      title: 'Automated Outreach',
      description: 'Personalized email campaigns that feel human and get responses'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await handleWaitList({
        email,
        name,
        position,
        industry,
        leadsPerWeek,
        companySize,
        useCase
      });
      
      setIsSubmitted(true);
      // Reset form
      setEmail('');
      setName('');
      setPosition('');
      setIndustry('');
      setLeadsPerWeek(0);
      setCompanySize('0-10');
      setUseCase('');
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to show an error message to the user here
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
                  bAIcho
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
              Transform Your Sales Team
              <br />
              with AI-Powered Automation
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Upload your leads, connect your tools, and watch as our AI handles everything
              from research to personalized outreach.
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
                key={currentMetric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-purple-400 mb-3">
                  {metrics[currentMetric].value}
                </div>
                <div className="text-xl text-gray-400">
                  {metrics[currentMetric].label}
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
            About bAIcho
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div>
              <p className="text-2xl text-gray-400 mb-12 leading-relaxed">
                We're revolutionizing how sales teams operate by leveraging the power
                of artificial intelligence. Our platform combines advanced machine
                learning with years of sales expertise to create a tool that doesn't
                just automate - it enhances your entire sales process.
              </p>
              <div className="space-y-8">
                {[
                  { icon: <Users className="w-8 h-8" />, text: 'Built by sales professionals for sales professionals' },
                  { icon: <Timer className="w-8 h-8" />, text: 'Save 40+ hours per week per sales rep' },
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
                Why Choose bAIcho?
              </h3>
              <ul className="space-y-6">
                {[
                  'End-to-end sales automation',
                  'Advanced lead scoring and prioritization',
                  'Personalized email campaigns at scale',
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

      {/* Sign Up Section */}
      <section ref={contactRef} className="min-h-screen py-32 px-8 flex items-center">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Get Early Access
          </h2>
          <p className="text-2xl text-gray-400 mb-12 leading-relaxed">
            Join our waitlist to be among the first to experience the future of AI-powered sales.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-8 py-4 rounded-full bg-black/40 border-2 border-purple-900/30 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center"
              />
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Position</span>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter your position"
                className="w-full px-8 py-4 rounded-full bg-black/40 border-2 border-purple-900/30 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center"
              />
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Industry</span>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Enter your industry"
                className="w-full px-8 py-4 rounded-full bg-black/40 border-2 border-purple-900/30 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center"
              />
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Leads per Week</span>
              <input
                type="number"
                value={leadsPerWeek}
                onChange={(e) => setLeadsPerWeek(Number(e.target.value))}
                placeholder="Enter the number of leads you generate per week"
                className="w-full px-8 py-4 rounded-full bg-black/40 border-2 border-purple-900/30 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center"
              />
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Company Size</span>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-8 py-4 rounded-full bg-black/40 border-2 border-purple-900/30 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center"
              >
                <option value="0-10">0-10</option>
                <option value="11-50">11-50</option>
                <option value="51-100">51-100</option>
                <option value="101-500">101-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1001+">1001+</option>
              </select>
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Use Case</span>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Enter a brief description of how you plan to use bAIcho"
                className="w-full px-8 py-4 rounded-xl bg-black/40 border-2 border-purple-900/30 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center"
              />
            </label>
            <label className="block mb-2">
              <span className="text-xl text-gray-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-8 py-4 rounded-full bg-black/40 border-2 border-purple-900/30 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-center"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 hover:transform hover:scale-105"
            >
              {isSubmitted ? 'Thank you!' : 'Join Waitlist'}
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