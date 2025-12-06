import React from 'react';
import { ArrowLeft, CheckCircle, Star, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const tips = [
  {
    category: 'Before the Interview',
    icon: Star,
    items: [
      'Research the company thoroughly - history, products, culture, recent news',
      'Review the job description and match your skills to their requirements',
      'Prepare answers using the STAR method (Situation, Task, Action, Result)',
      'Practice common interview questions out loud',
      'Prepare 3-5 thoughtful questions to ask the interviewer',
      'Test your technology setup if it\'s a virtual interview',
      'Plan your outfit and ensure it\'s professional',
      'Get a good night\'s sleep and arrive 10-15 minutes early'
    ]
  },
  {
    category: 'During the Interview',
    icon: CheckCircle,
    items: [
      'Make eye contact and offer a firm handshake',
      'Listen carefully to each question before answering',
      'Take a moment to think before responding to complex questions',
      'Provide specific examples from your experience',
      'Be honest about what you don\'t know, but show willingness to learn',
      'Ask for clarification if you don\'t understand a question',
      'Show enthusiasm for the role and company',
      'Watch your body language - sit up straight, don\'t fidget',
      'Take notes during the interview'
    ]
  },
  {
    category: 'Common Mistakes to Avoid',
    icon: AlertTriangle,
    items: [
      'Don\'t speak negatively about previous employers',
      'Avoid giving yes/no answers without explanation',
      'Don\'t interrupt the interviewer',
      'Avoid being too casual or overly familiar',
      'Don\'t lie or exaggerate your accomplishments',
      'Avoid checking your phone during the interview',
      'Don\'t ask about salary/benefits too early',
      'Avoid using filler words like "um", "like", "you know" excessively'
    ]
  },
  {
    category: 'After the Interview',
    icon: Star,
    items: [
      'Send a thank-you email within 24 hours',
      'Reflect on what went well and what could be improved',
      'Follow up if you haven\'t heard back within the expected timeframe',
      'Be patient and professional while waiting for a response',
      'Continue applying to other opportunities',
      'Keep notes on each interview for future reference'
    ]
  }
];

const commonQuestions = [
  'Tell me about yourself',
  'What are your greatest strengths and weaknesses?',
  'Why do you want to work here?',
  'Where do you see yourself in 5 years?',
  'Tell me about a time you faced a challenge',
  'Why should we hire you?',
  'What\'s your salary expectation?',
  'Do you have any questions for us?'
];

const Tips = ({ onBack }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white">
            Interview Tips & Guide
          </h1>
        </div>

        {/* Tips Sections */}
        <div className="space-y-6 mb-8">
          {tips.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="p-6 bg-white/95 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-semibold">{section.category}</h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Common Questions */}
        <Card className="p-6 bg-white/95 backdrop-blur">
          <h2 className="text-2xl font-semibold mb-4">Common Interview Questions</h2>
          <p className="text-gray-600 mb-4">
            Be prepared to answer these frequently asked questions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonQuestions.map((question, idx) => (
              <div
                key={idx}
                className="p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <span className="text-purple-800 font-medium">
                  {idx + 1}. {question}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Tips;