import express, { Router, Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const router: Router = express.Router();

interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'student' | 'instructor';
  language?: 'ar' | 'en';
}

interface LoginBody {
  email: string;
  password: string;
}

// POST: Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role = 'student', language = 'ar' }: RegisterBody = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: language === 'ar' ? 'جميع الحقول مطلوبة' : 'All fields are required',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: language === 'ar' ? 'هذا البريد مسجل بالفعل' : 'Email already registered',
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      language,
      instructorStatus: role === 'instructor' ? 'pending' : undefined,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    return res.status(201).json({
      success: true,
      message: language === 'ar' ? 'تم التسجيل بنجاح' : 'Registration successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST: Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginBody = req.body;
    const language = req.body.language || 'ar';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: language === 'ar' ? 'البريد وكلمة المرور مطلوبان' : 'Email and password are required',
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: language === 'ar' ? 'بيانات دخول غير صحيحة' : 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: language === 'ar' ? 'بيانات دخول غير صحيحة' : 'Invalid credentials',
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    return res.status(200).json({
      success: true,
      message: language === 'ar' ? 'تم الدخول بنجاح' : 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
