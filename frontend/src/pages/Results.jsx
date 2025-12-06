import React from 'react';
import { Home, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Results = ({ data, onBackHome }) => {
  if (!data || !data.answers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">No results to display</div>
      </div>
    );
  }

  const { role, answers, totalQuestions } = data;
  
  // Calculate average score from evaluations
  const scores = answers.map(a => a.evaluation?.score || 0);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const percentage = (avgScore / 10) * 100;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = () => {
    if (percentage >= 80) return { level: 'Excellent', color: 'bg-green-500' };
    if (percentage >= 60) return { level: 'Good', color: 'bg-yellow-500' };
    return { level: 'Needs Improvement', color: 'bg-red-500' };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/90 mb-6">
            <Award className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Interview Complete!
          </h1>
          <p className="text-xl text-white/80">
            {role} - Practice Session
          </p>
        </div>

        {/* Overall Score */}
        <Card className="p-8 mb-8 bg-white/95 backdrop-blur text-center">
          <h2 className="text-2xl font-semibold mb-6">Overall Performance</h2>
          <div className="flex items-center justify-center gap-12 mb-6">
            <div>
              <div className="text-6xl font-bold text-purple-600 mb-2">
                {avgScore.toFixed(1)}
              </div>
              <div className="text-gray-600">Average Score</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-indigo-600 mb-2">
                {percentage.toFixed(0)}%
              </div>
              <div className="text-gray-600">Performance</div>
            </div>
          </div>
          <div className={`inline-block px-6 py-3 ${performance.color} text-white rounded-full text-lg font-semibold`}>
            {performance.level}
          </div>
        </Card>

        {/* Detailed Results */}
        <div className="space-y-6 mb-8">
          {answers.map((item, idx) => (
            <Card key={idx} className="p-6 bg-white/95 backdrop-blur">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {item.evaluation?.difficulty || 'Medium'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {item.question?.text || item.question}
                  </h3>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(item.evaluation?.score || 0)}`}>
                  {item.evaluation?.score || 0}/10
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Your Answer:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">
                  {item.answer}
                </p>
              </div>

              {item.evaluation?.feedback && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Feedback:
                  </h4>
                  <p className="text-gray-600">{item.evaluation.feedback}</p>
                </div>
              )}

              {item.evaluation?.strengths && item.evaluation.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-green-700 mb-2">Strengths:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {item.evaluation.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.evaluation?.improvements && item.evaluation.improvements.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Areas for Improvement:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {item.evaluation.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button
            onClick={onBackHome}
            className="bg-white hover:bg-white/90 text-purple-600 px-8 py-6 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;