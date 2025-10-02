import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, Loader, AlertTriangle, Heart, Phone } from 'lucide-react'
import { useNotification } from '../../context/NotificationContext'

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI-powered health assistant. I can help you with medical questions, find hospitals, provide emergency information, and guide you through our website. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationContext, setConversationContext] = useState([])
  const messagesEndRef = useRef(null)
  const { showError } = useNotification()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // System prompt for the AI
  const systemPrompt = `You are MedBot, an AI health assistant for MedAssist Pro, a medical prescription management system. Your role is to:

1. Provide helpful medical guidance and symptom information (but always recommend consulting healthcare professionals for serious concerns)
2. Help users navigate the MedAssist Pro website features:
   - Home page: Main symptom checker and features overview
   - Dashboard: Symptom search and medicine recommendations  
   - Hospitals: Find nearby hospitals using location
   - Profile: User health profile management (for logged-in users)
   - Admin: Restricted administrative access
3. Provide emergency contact information for India:
   - Ambulance: 108
   - Medical Emergency: 102  
   - Police: 100
   - Fire: 101
4. Answer questions about common medications and treatments
5. Be empathetic, helpful, and professional
6. Always emphasize seeking professional medical help for serious symptoms

Keep responses concise but informative. If asked about serious medical emergencies, immediately provide emergency numbers. Never provide specific medication dosages - always recommend consulting a healthcare provider.

Current website features:
- Symptom checker with medicine recommendations
- Hospital locator using live GPS location
- User profiles and prescription history
- Admin panel for healthcare providers`

  // Send message to OpenAI GPT API
  const sendToAI = async (userMessage, context) => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: context,
          systemPrompt: systemPrompt
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('AI API error:', error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    
    // Add to conversation context
    const newContext = [...conversationContext, 
      { role: 'user', content: inputMessage.trim() }
    ].slice(-10) // Keep only last 10 messages for context
    
    setConversationContext(newContext)
    setInputMessage('')
    setIsTyping(true)

    try {
      // Check for emergency keywords first
      const emergencyKeywords = ['emergency', 'urgent', 'dying', 'accident', 'heart attack', 'stroke', 'unconscious', 'bleeding', 'poison']
      const isEmergency = emergencyKeywords.some(keyword => 
        inputMessage.toLowerCase().includes(keyword)
      )

      let aiResponse
      
      if (isEmergency) {
        aiResponse = `🚨 **EMERGENCY DETECTED** 🚨

If this is a life-threatening emergency, please call immediately:
• **Ambulance: 108**
• **Medical Emergency: 102**

For your safety, please:
1. Call emergency services immediately
2. Stay calm and follow dispatcher instructions
3. If possible, get to the nearest hospital

I can also help you find nearby hospitals if needed. Please prioritize getting immediate medical attention for emergency situations.`
      } else {
        aiResponse = await sendToAI(inputMessage, newContext)
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        isEmergency: isEmergency
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Add AI response to context
      setConversationContext(prev => [...prev, 
        { role: 'assistant', content: aiResponse }
      ].slice(-10))

    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Fallback response
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to my AI services right now. However, I can still help you with:\n\n• Emergency numbers (108 for ambulance)\n• Finding the symptom checker on our Dashboard\n• Locating nearby hospitals\n• General website navigation\n\nPlease try your question again, or if this is urgent, call 108 for emergency assistance.",
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
      showError('AI service temporarily unavailable')
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const quickSuggestions = [
    "How do I check symptoms?",
    "Find hospitals near me",
    "Emergency numbers",
    "Common cold remedies",
    "How to use this website?"
  ]

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion)
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-180' 
              : 'bg-gradient-to-r from-primary-600 to-medical-500 hover:from-primary-700 hover:to-medical-600'
          } text-white relative`}
        >
          {!isOpen && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
          )}
          
          {isOpen ? (
            <X className="h-6 w-6 transition-transform duration-300" />
          ) : (
            <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>
        
        {!isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 border border-gray-200 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-sm font-medium text-gray-900">AI Health Assistant</div>
            <div className="text-xs text-gray-600">Click to chat with MedBot</div>
          </div>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-medical-500 text-white p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">MedBot AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs opacity-90">Powered by AI • Always learning</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white ml-8'
                      : message.isEmergency
                      ? 'bg-red-100 text-red-900 border-2 border-red-300 mr-8'
                      : message.isError
                      ? 'bg-yellow-100 text-yellow-900 border border-yellow-300 mr-8'
                      : 'bg-white text-gray-800 border border-gray-200 mr-8 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        message.isEmergency 
                          ? 'text-red-600' 
                          : message.isError
                          ? 'text-yellow-600'
                          : 'text-primary-600'
                      }`} />
                    )}
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {message.text}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl border border-gray-200 mr-8 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-primary-600" />
                    <div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">AI is thinking...</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <div className="text-xs text-gray-600 mb-3 font-medium">Quick questions:</div>
              <div className="space-y-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="w-full text-left text-xs bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about health, symptoms, or website features..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  rows={1}
                  style={{
                    minHeight: '44px',
                    maxHeight: '100px'
                  }}
                  disabled={isTyping}
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors duration-200"
                >
                  {isTyping ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <AlertTriangle className="h-3 w-3" />
              <span>For medical emergencies, call 108 immediately</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatbot
