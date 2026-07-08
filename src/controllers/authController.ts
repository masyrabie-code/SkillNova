import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import { ApiResponse, validateEmail, validatePassword, sanitizeString } from '../utils/apiResponse';
import jwt from 'jsonwebtoken';

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    try {
      const { firstName, lastName, email, password, role = 'student', language = 'ar' } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !password) {
        return ApiResponse.badRequest(res, 'جميع الحقول مطلوبة');
      }

      if (!validateEmail(email)) {
        return ApiResponse.badRequest(res, 'بريد إلكتروني غير صحيح');
      }

      if (!validatePassword(password)) {
        return ApiResponse.badRequest(res, 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل');
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return ApiResponse.conflict(res, 'هذا البريد مسجل بالفعل');
      }

      // Create new user
      const user = new User({
        firstName: sanitizeString(firstName),
        lastName: sanitizeString(lastName),
        email: email.toLowerCase(),
        password,
        role,
        language,
        instructorStatus: role === 'instructor' ? 'pending' : undefined,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      return ApiResponse.success(
        res,
        {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          token,
        },
        'تم التسجيل بنجاح',
        201
      );
    } catch (error) {
      console.error('Register error:', error);
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  static async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ApiResponse.badRequest(res, 'البريد وكلمة المرور مطلوبان');
      }

      // Find user and include password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return ApiResponse.unauthorized(res, 'بيانات دخول غير صحيحة');
      }

      // Check password
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return ApiResponse.unauthorized(res, 'بيانات دخول غير صحيحة');
      }

      // Check if user is active
      if (!user.isActive) {
        return ApiResponse.unauthorized(res, 'حسابك معطل');
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      return ApiResponse.success(
        res,
        {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          token,
        },
        'تم الدخول بنجاح'
      );
    } catch (error) {
      console.error('Login error:', error);
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return ApiResponse.notFound(res, 'المستخدم غير موجود');
      }

      return ApiResponse.success(res, user, 'تم جلب البيانات بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { firstName, lastName, bio, phone, language } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user?.id,
        {
          firstName: firstName ? sanitizeString(firstName) : undefined,
          lastName: lastName ? sanitizeString(lastName) : undefined,
          bio: bio ? sanitizeString(bio) : undefined,
          phone,
          language,
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        return ApiResponse.notFound(res, 'المستخدم غير موجود');
      }

      return ApiResponse.success(res, user, 'تم تحديث البيانات بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return ApiResponse.badRequest(res, 'كلمات المرور مطلوبة');
      }

      const user = await User.findById(req.user?.id).select('+password');
      if (!user) {
        return ApiResponse.notFound(res, 'المستخدم غير موجود');
      }

      // Verify old password
      const isCorrect = await user.comparePassword(oldPassword);
      if (!isCorrect) {
        return ApiResponse.unauthorized(res, 'كلمة المرور القديمة غير صحيحة');
      }

      // Validate new password
      if (!validatePassword(newPassword)) {
        return ApiResponse.badRequest(res, 'كلمة المرور الجديدة ضعيفة جداً');
      }

      user.password = newPassword;
      await user.save();

      return ApiResponse.success(res, null, 'تم تغيير كلمة المرور بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }
}
