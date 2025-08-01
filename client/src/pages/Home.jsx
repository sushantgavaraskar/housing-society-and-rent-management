import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  Bell,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Building2,
      title: 'Society Management',
      description: 'Efficiently manage multiple housing societies with comprehensive building and flat management.',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Handle owners, tenants, and administrators with role-based access control.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-grade security with JWT authentication and data encryption.',
    },
    {
      icon: BarChart3,
      title: 'Financial Tracking',
      description: 'Track rent payments, maintenance fees, and generate detailed financial reports.',
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Handle complaints, announcements, and internal communication seamlessly.',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Real-time notifications for payments, announcements, and important updates.',
    },
  ];

  const benefits = [
    'Streamlined society management',
    'Automated rent collection',
    'Digital complaint system',
    'Real-time notifications',
    'Comprehensive reporting',
    'Multi-role access control',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Housing Society
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Modern Housing Society
              <span className="block text-primary-600">Management System</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Streamline your housing society operations with our comprehensive management platform. 
              Handle everything from rent collection to maintenance requests with ease.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-3"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to manage your housing society
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive tools designed for modern housing society management
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Why choose our platform?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Our housing society management system is designed to simplify complex operations 
                and provide a seamless experience for administrators, owners, and tenants.
              </p>
              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success-600 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center"
                >
                  Start Managing Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="card p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Key Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Societies Managed</span>
                    <span className="font-semibold text-primary-600">500+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold text-primary-600">10,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transactions/Month</span>
                    <span className="font-semibold text-primary-600">50,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-semibold text-success-600">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <p className="text-gray-400">
              © 2024 Housing Society Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 