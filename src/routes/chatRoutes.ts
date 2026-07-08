import express, { Router, Request, Response, NextFunction } from 'express';
import ChatMessage from '../models/ChatMessage';
import { generateResponse } from '../utils/geminiAI';

const router: Router = express.Router();

// Middleware to verify user (basic example)
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // In production, verify JWT token here
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  (req as any).userId = userId;
  next();
};

// POST: Send chat message and get AI response
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { message, language = 'ar' } = req.body;
    const userId = (req as any).userId;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: language === 'ar' ? 'الرسالة مطلوبة' : 'Message is required',
      });
    }

    // Generate response using Google Gemini
    const response = await generateResponse(message, { language });

    // Save chat history to database
    const chatMessage = new ChatMessage({
      userId,
      message: message.trim(),
      response,
      language,
    });

    await chatMessage.save();

    return res.status(200).json({
      success: true,
      data: {
        message: message.trim(),
        response,
        timestamp: chatMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET: Retrieve chat history
router.get('/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await ChatMessage.find({ userId })
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const total = await ChatMessage.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
