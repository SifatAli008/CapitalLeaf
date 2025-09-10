'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import { Shield, Lock, Users, Activity, Zap } from 'lucide-react';

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
      title: "Zero Trust Access Control",
      description: "Continuous authentication and risk-based access control"
    },
    {
      icon: Lock,
      title: "Multi-Factor Authentication",
      description: "Google Authenticator integration with TOTP verification"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Complete user registration, login, and profile management"
    },
    {
      icon: Activity,
      title: "Risk Assessment",
      description: "Dynamic risk scoring and behavioral analytics"
    },
    {
      icon: Zap,
      title: "Real-time Security",
      description: "Live threat detection and automated incident response"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CapitalLeafLogo variant="default" size="lg" animated={true} />
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="btn-ghost"
              >
                Login
              </a>
              <a
                href="/register"
                className="btn-primary"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gray-800">Capital</span>
            <span className="text-green-600">Leaf</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Dynamic Defense with Microservice Isolation, Behavior-Driven Protection & Live Threat Intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </a>
            <a
              href="/login"
              className="btn-outline text-lg px-8 py-3"
            >
              Sign In
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Enterprise-Grade Security Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 gradient-primary rounded-2xl p-8 text-center shadow-fintech-lg">
          <h2 className="text-responsive-3xl font-bold text-white mb-4">
            Ready to Secure Your Platform?
          </h2>
          <p className="text-white/90 mb-6 text-responsive-lg">
            Join thousands of financial institutions using CapitalLeaf for comprehensive security
          </p>
          <a
            href="/register"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 inline-block shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <CapitalLeafLogo variant="light" size="md" animated={true} />
            <p className="mt-4 text-gray-400">
              © 2024 CapitalLeaf. All rights reserved. Protecting financial platforms with intelligent security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}