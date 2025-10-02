const express = require('express')
const axios = require('axios')
const router = express.Router()

// Chat with OpenAI GPT
router.post('/chat', async (req, res) => {
  try {
    const { message, context = [], systemPrompt } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' })
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt || 'You are a helpful AI assistant focused on health and medical topics.'
      },
      ...context.slice(-8), // Keep last 8 messages for context
      {
        role: 'user',
        content: message
      }
    ]

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    const aiResponse = response.data.choices[0].message.content.trim()

    res.json({
      response: aiResponse,
      usage: response.data.usage
    })

  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message)
    
    // Return a helpful fallback response
    res.status(500).json({
      error: 'AI service temporarily unavailable',
      fallbackResponse: "I'm having trouble connecting to my AI services right now. For immediate help:\n\n🚨 Emergency: Call 108\n🏥 Find hospitals: Use our Hospital Locator\n💊 Check symptoms: Visit our Dashboard\n📱 Website help: Try the navigation menu\n\nPlease try your question again in a moment."
    })
  }
})

module.exports = router
