import React from 'react';
import { Heart, Target, Zap, Users, Award, TrendingUp, BarChart3, Lightbulb } from 'lucide-react';

export default function About({ darkMode }) {
  const team = [
    { name: 'Sarah Chen', role: 'Founder & CEO', icon: Target, bio: 'Investment enthusiast with 10+ years experience' },
    { name: 'Alex Kumar', role: 'Lead Developer', icon: Zap, bio: 'Full-stack developer passionate about fintech' },
    { name: 'Maya Patel', role: 'AI Specialist', icon: Lightbulb, bio: 'AI researcher focused on financial applications' },
    { name: 'James Wilson', role: 'Financial Advisor', icon: TrendingUp, bio: 'Certified financial planner and educator' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Empathy',
      description: 'We understand the fear and anxiety around investing. Our platform is built with compassion for beginners.'
    },
    {
      icon: Target,
      title: 'Clarity',
      description: 'We make complex financial concepts simple and understandable for everyone, regardless of background.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We use cutting-edge AI and technology to provide personalized guidance and insights.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in the power of community and shared learning experiences among investors.'
    },
  ];

  const milestones = [
    { year: '2024', event: 'Investing Fear Platform Launched', description: 'Started with a mission to help young investors' },
    { year: '2024', event: '1,000 Users Milestone', description: 'Reached 1,000 active users in first month' },
    { year: '2024', event: '10,000 Simulations', description: 'Users completed 10,000 practice simulations' },
    { year: '2024', event: 'AI Integration', description: 'Integrated Groq AI for personalized portfolio analysis' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`${darkMode ? 'bg-gradient-to-br from-secondary to-tertiary' : 'bg-gradient-to-br from-gray-100 to-gray-50'} py-20 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            About Investing Fear
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Empowering young investors to overcome fear and build wealth through education, simulation, and AI guidance
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Our Mission
          </h2>
          <p className={`text-lg text-center mb-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We believe that fear of investing shouldn't hold young people back from building wealth. Our mission is to provide accessible, interactive tools that help users understand investment risk, practice with virtual money, and gain the confidence to invest in their future. We're committed to democratizing financial education and making investing accessible to everyone.
          </p>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-lg shadow-lg text-center ${darkMode ? 'bg-tertiary' : 'bg-white'}`}
                >
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className={`py-20 px-4 ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => {
              const Icon = member.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-lg text-center shadow-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                    {member.name}
                  </h3>
                  <p className={`text-sm font-semibold text-primary mb-2`}>
                    {member.role}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {member.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Our Journey
          </h2>

          <div className="space-y-6">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-lg shadow-lg border-l-4 border-primary ${
                  darkMode ? 'bg-tertiary' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold text-primary mb-1`}>{milestone.year}</p>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                      {milestone.event}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-20 px-4 ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            By The Numbers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-secondary' : 'bg-gray-50'} shadow-lg`}>
              <p className="text-4xl font-bold text-primary mb-2">10K+</p>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Active Users</p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Growing daily</p>
            </div>

            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-secondary' : 'bg-gray-50'} shadow-lg`}>
              <p className="text-4xl font-bold text-primary mb-2">50K+</p>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Simulations Run</p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Practice sessions</p>
            </div>

            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-secondary' : 'bg-gray-50'} shadow-lg`}>
              <p className="text-4xl font-bold text-primary mb-2">95%</p>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>User Satisfaction</p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Highly rated</p>
            </div>

            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-secondary' : 'bg-gray-50'} shadow-lg`}>
              <p className="text-4xl font-bold text-primary mb-2">24/7</p>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Support Available</p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Why Choose Investing Fear?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
              <div className="flex items-start gap-4">
                <BarChart3 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                    Interactive Simulations
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Practice investing with virtual money and see real-world scenarios without any financial risk.
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                    AI-Powered Insights
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get personalized portfolio analysis and recommendations powered by advanced AI technology.
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
              <div className="flex items-start gap-4">
                <Heart className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                    Beginner-Friendly
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Designed specifically for young investors with no prior experience. Easy to understand and use.
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                    Community Support
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Join a supportive community of young investors learning and growing together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 px-4 ${darkMode ? 'bg-gradient-to-r from-secondary to-tertiary' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Ready to Start Your Investment Journey?
          </h2>
          <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of young investors who are overcoming their fear and building wealth with Investing Fear
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}
