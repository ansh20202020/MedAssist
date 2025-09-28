import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Shield, Search, Database, Users, Award } from 'lucide-react'
import SymptomChecker from '../components/user/SymptomChecker'

const Home = () => {
  const features = [
    {
      icon: Search,
      title: 'Symptom Checker',
      description: 'Get instant medicine recommendations based on your symptoms',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Database,
      title: 'Medicine Database',
      description: 'Comprehensive database of medicines and treatments',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Shield,
      title: 'Admin Panel',
      description: 'Advanced management tools for healthcare professionals',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Users,
      title: 'User Friendly',
      description: 'Intuitive interface designed for easy navigation',
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const stats = [
    { number: '1000+', label: 'Medicines' },
    { number: '500+', label: 'Symptoms' },
    { number: '10k+', label: 'Users Helped' },
    { number: '99%', label: 'Accuracy Rate' }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="medical-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-full shadow-lg animate-float">
                <Heart className="h-12 w-12 text-medical-500" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Trusted
              <span className="text-medical-500"> Medical Assistant</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get instant medicine recommendations for common symptoms. Our AI-powered system provides 
              accurate, reliable healthcare guidance when you need it most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Check Symptoms</span>
              </Link>
              
              <Link
                to="/admin"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Admin Access</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MedAssist Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with medical expertise to provide 
              you with the best healthcare guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow duration-300">
                <div className={`inline-flex p-3 rounded-full ${feature.color} mb-4`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptom Checker Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Check Your Symptoms Now
            </h2>
            <p className="text-xl text-gray-600">
              Get instant medicine recommendations for your health concerns
            </p>
          </div>
          
          <SymptomChecker />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who trust MedAssist Pro for their healthcare needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Start Free Health Check</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
