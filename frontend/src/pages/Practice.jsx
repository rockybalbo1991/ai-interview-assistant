import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Practice = ({ role, onBack, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/interview/generate-questions`, {
        role: role,
        count: 5,
        difficulty: 'mixed'
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`${API}/interview/evaluate-answer`, {
        question: questions[currentIndex],
        answer: answer,
        role: role
      });

      const newAnswers = [...answers, {
        question: questions[currentIndex],
        answer: answer,
        evaluation: response.data.evaluation
      }];
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswer('');
      } else {
        onComplete({
          role: role,
          answers: newAnswers,
          totalQuestions: questions.length
        });
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              Practice: {role}
            </h1>
            <p className="text-white/80">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 bg-white/95 backdrop-blur">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              {currentQuestion?.difficulty || 'Medium'}
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              {currentQuestion?.text}
            </h2>
            {currentQuestion?.context && (
              <p className="text-gray-600 italic">{currentQuestion.context}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Your Answer:
            </label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px] text-base"
              disabled={submitting}
            />
          </div>

          <Button
            onClick={handleSubmitAnswer}
            disabled={!answer.trim() || submitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
          >
            {submitting ? (
              'Evaluating...'
            ) : currentIndex < questions.length - 1 ? (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit & Next
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit & Finish
              </>
            )}
          </Button>
        </Card>

        {/* Answered Questions */}
        {answers.length > 0 && (
          <Card className="p-6 bg-white/90 backdrop-blur">
            <h3 className="text-lg font-semibold mb-3">
              Answered: {answers.length}/{questions.length}
            </h3>
            <div className="flex gap-2">
              {answers.map((_, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Practice;