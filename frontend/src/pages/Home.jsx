import React from 'react';
import { Briefcase, Target, BookOpen } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const jobRoles = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Business Analyst',
  'Project Manager',
];

const Home = ({ onStartPractice, onStartMock, onViewTips }) => {
  const [selectedRole, setSelectedRole] = React.useState('');

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            AI Interview Assistant
          </h1>
          <p className="text-xl text-white/80">
            Practice with AI, ace your interviews
          </p>
        </div>

        {/* Role Selection */}
        <Card className="p-8 mb-8 bg-white/95 backdrop-blur">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Select Your Target Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {jobRoles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === role
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <span className="font-medium">{role}</span>
              </button>
            ))}
          </div>

          {selectedRole && (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => onStartPractice(selectedRole)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
              >
                <Target className="w-5 h-5 mr-2" />
                Practice Questions
              </Button>
              <Button
                onClick={() => onStartMock(selectedRole)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Mock Interview
              </Button>
            </div>
          )}
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/90 backdrop-blur hover:scale-105 transition-transform cursor-pointer" onClick={onViewTips}>
            <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interview Tips</h3>
            <p className="text-gray-600">
              Learn best practices and strategies to excel in interviews
            </p>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur">
            <Target className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Evaluation</h3>
            <p className="text-gray-600">
              Get instant feedback on your answers with AI-powered analysis
            </p>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur">
            <Briefcase className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real Scenarios</h3>
            <p className="text-gray-600">
              Practice with questions from actual interviews
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;