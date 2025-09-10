'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import { Shield, Lock, Users, Activity, Zap, ArrowRight, CheckCircle, Star, BarChart3 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const features = [
    {
      icon: Shield,
      title: 'Zero Trust Architecture',
      description: 'Never trust, always verify with continuous authentication and risk-based access control',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Lock,
      title: 'Advanced MFA',
      description: 'Multi-factor authentication with TOTP, biometrics, and hardware security keys',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Identity Management',
      description: 'Comprehensive user lifecycle management with role-based access control',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Activity,
      title: 'Risk Intelligence',
      description: 'AI-powered behavioral analytics and dynamic risk scoring in real-time',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Threat Response',
      description: 'Automated incident response with machine learning threat detection',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: BarChart3,
      title: 'Security Analytics',
      description: 'Comprehensive dashboards and reporting for security posture monitoring',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '500+', label: 'Enterprise Clients' },
    { number: '50M+', label: 'Transactions Secured' },
    { number: '24/7', label: 'Security Monitoring' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CISO, FinTech Global',
      content: 'CapitalLeaf transformed our security posture with its intelligent threat detection and seamless user experience.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Security, BankCorp',
      content: 'The zero-trust implementation was flawless. Our security incidents dropped by 95% in the first quarter.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'CTO, Payment Solutions Inc',
      content: 'Outstanding platform. The real-time analytics give us complete visibility into our security landscape.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CapitalLeafLogo variant="default" size="lg" animated={true} />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#security" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Security</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
                <Star className="w-4 h-4 mr-2" />
                Trusted by 500+ Financial Institutions
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-gray-800">Capital</span>
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Leaf</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                The most advanced zero-trust security platform for financial services. 
                Protect your digital assets with AI-powered threat detection and seamless user experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <a
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a
                  href="#demo"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                >
                  Watch Demo
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Security Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive security solutions designed specifically for financial institutions and fintech companies.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Bank-Level Security
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Our platform meets the highest security standards with SOC 2 Type II compliance, 
                  end-to-end encryption, and continuous security monitoring.
                </p>
                <div className="space-y-4">
                  {[
                    'SOC 2 Type II Certified',
                    '256-bit AES Encryption',
                    'GDPR & CCPA Compliant',
                    'Regular Security Audits',
                    '24/7 Threat Monitoring'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Security Score</h3>
                    <div className="text-4xl font-bold text-green-600 mb-2">98.7%</div>
                    <p className="text-gray-600">Industry-leading security rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-gray-600">
                See what our clients say about CapitalLeaf
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Secure Your Platform?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of financial institutions using CapitalLeaf for comprehensive security. 
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Start Free Trial
              </a>
              <a
                href="#contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <CapitalLeafLogo variant="light" size="lg" animated={true} />
              <p className="mt-4 text-gray-400 max-w-md">
                The most advanced zero-trust security platform for financial services. 
                Protecting digital assets with intelligent security solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#security" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 CapitalLeaf. All rights reserved. Protecting financial platforms with intelligent security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}