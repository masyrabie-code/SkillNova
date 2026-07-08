import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import { ApiResponse, sanitizeString } from '../utils/apiResponse';

export class CourseController {
  // Get all courses with filters
  static async getAllCourses(req: AuthRequest, res: Response) {
    try {
      const { category, level, language, isFree, page = 1, limit = 10 } = req.query;

      const filter: any = { isPublished: true };

      if (category) filter.category = category;
      if (level) filter.level = level;
      if (language) filter.language = language;
      if (isFree === 'true') filter.isFree = true;

      const courses = await Course.find(filter)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('instructor', 'firstName lastName profileImage');

      const total = await Course.countDocuments(filter);

      return ApiResponse.success(
        res,
        {
          courses,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        'تم جلب الكورسات بنجاح'
      );
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  // Get single course
  static async getCourseById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const course = await Course.findById(id)
        .populate('instructor', 'firstName lastName profileImage bio')
        .populate('students', 'firstName lastName');

      if (!course) {
        return ApiResponse.notFound(res, 'الكورس غير موجود');
      }

      return ApiResponse.success(res, course, 'تم جلب الكورس بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  // Create course (instructor only)
  static async createCourse(req: AuthRequest, res: Response) {
    try {
      const { title, titleAr, description, descriptionAr, category, level, language, price, isFree } = req.body;

      if (!title || !titleAr || !description || !descriptionAr || !category) {
        return ApiResponse.badRequest(res, 'جميع الحقول المطلوبة مفقودة');
      }

      const course = new Course({
        title: sanitizeString(title),
        titleAr: sanitizeString(titleAr),
        description: sanitizeString(description),
        descriptionAr: sanitizeString(descriptionAr),
        instructor: req.user?.id,
        category,
        level,
        language,
        price: isFree ? 0 : price,
        isFree,
      });

      await course.save();

      return ApiResponse.success(res, course, 'تم إنشاء الكورس بنجاح', 201);
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  // Update course (instructor only)
  static async updateCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, titleAr, description, descriptionAr, category, level, language, price, isFree } = req.body;

      const course = await Course.findById(id);
      if (!course) {
        return ApiResponse.notFound(res, 'الكورس غير موجود');
      }

      // Check if user is instructor of this course
      if (course.instructor.toString() !== req.user?.id) {
        return ApiResponse.forbidden(res, 'لا يمكنك تعديل هذا الكورس');
      }

      // Update fields
      if (title) course.title = sanitizeString(title);
      if (titleAr) course.titleAr = sanitizeString(titleAr);
      if (description) course.description = sanitizeString(description);
      if (descriptionAr) course.descriptionAr = sanitizeString(descriptionAr);
      if (category) course.category = category;
      if (level) course.level = level;
      if (language) course.language = language;
      if (isFree !== undefined) course.isFree = isFree;
      if (price) course.price = isFree ? 0 : price;

      await course.save();

      return ApiResponse.success(res, course, 'تم تحديث الكورس بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  // Enroll in course
  static async enrollCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const course = await Course.findById(id);
      if (!course) {
        return ApiResponse.notFound(res, 'الكورس غير موجود');
      }

      // Check if already enrolled
      if (course.students.includes(req.user?.id as any)) {
        return ApiResponse.conflict(res, 'أنت مسجل بالفعل في هذا الكورس');
      }

      course.students.push(req.user?.id as any);
      await course.save();

      return ApiResponse.success(res, course, 'تم التسجيل في الكورس بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  // Delete course (instructor only)
  static async deleteCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const course = await Course.findById(id);
      if (!course) {
        return ApiResponse.notFound(res, 'الكورس غير موجود');
      }

      if (course.instructor.toString() !== req.user?.id) {
        return ApiResponse.forbidden(res, 'لا يمكنك حذف هذا الكورس');
      }

      await Course.findByIdAndDelete(id);

      return ApiResponse.success(res, null, 'تم حذف الكورس بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }

  // Publish course (instructor only)
  static async publishCourse(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const course = await Course.findById(id);
      if (!course) {
        return ApiResponse.notFound(res, 'الكورس غير موجود');
      }

      if (course.instructor.toString() !== req.user?.id) {
        return ApiResponse.forbidden(res, 'لا يمكنك نشر هذا الكورس');
      }

      course.isPublished = true;
      await course.save();

      return ApiResponse.success(res, course, 'تم نشر الكورس بنجاح');
    } catch (error) {
      return ApiResponse.error(res, 'خطأ في الخادم', 500, error);
    }
  }
}
