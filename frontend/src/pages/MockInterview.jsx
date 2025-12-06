import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Send } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MockInterview = ({ role, onBack, onComplete }) => {
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);

  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/interview/start-mock`, {
        role: role
      });
      setSessionId(response.data.session_id);
      setCurrentQuestion(response.data.first_question);
      setMessages([{
        type: 'interviewer',
        text: response.data.greeting
      }, {
        type: 'interviewer',
        text: response.data.first_question
      }]);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnswer = async () => {
    if (!answer.trim() || interviewComplete) return;

    const userMessage = { type: 'user', text: answer };
    setMessages([...messages, userMessage]);
    setAnswer('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/interview/mock-continue`, {
        session_id: sessionId,
        answer: answer,
        role: role
      });

      if (response.data.is_complete) {
        setMessages([...messages, userMessage, {
          type: 'interviewer',
          text: response.data.closing_message
        }]);
        setInterviewComplete(true);
        setTimeout(() => {
          onComplete({
            role: role,
            session_id: sessionId,
            messages: [...messages, userMessage]
          });
        }, 2000);
      } else {
        setCurrentQuestion(response.data.next_question);
        setMessages([...messages, userMessage, {
          type: 'interviewer',
          text: response.data.feedback
        }, {
          type: 'interviewer',
          text: response.data.next_question
        }]);
      }
    } catch (error) {
      console.error('Error sending answer:', error);
    } finally {
      setLoading(false);
    }
  };

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
              Mock Interview: {role}
            </h1>
            <p className="text-white/80">Real-time AI Interview Simulation</p>
          </div>
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full">
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="p-6 mb-6 bg-white/95 backdrop-blur min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`mb-4 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-lg max-w-[80%] ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm font-medium mb-1">
                  {message.type === 'user' ? 'You' : 'AI Interviewer'}
                </p>
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block px-4 py-3 rounded-lg bg-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Input Area */}
        {!interviewComplete && (
          <Card className="p-6 bg-white/95 backdrop-blur">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="mb-4 min-h-[120px]"
              disabled={loading}
            />
            <Button
              onClick={handleSendAnswer}
              disabled={!answer.trim() || loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Answer
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MockInterview;