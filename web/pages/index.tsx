'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface Course {
  id: string;
  title: string;
  titleAr: string;
  image: string;
  price: number;
  isFree: boolean;
  rating: number;
  instructor: string;
}

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const featuredCourses: Course[] = [
    {
      id: '1',
      title: 'Digital Marketing Basics',
      titleAr: 'أساسيات التسويق الرقمي',
      image: '/courses/marketing.jpg',
      price: 0,
      isFree: true,
      rating: 4.8,
      instructor: 'Ahmed Hassan',
    },
    {
      id: '2',
      title: 'Web Development with React',
      titleAr: 'تطوير الويب مع React',
      image: '/courses/react.jpg',
      price: 49.99,
      isFree: false,
      rating: 4.9,
      instructor: 'Sarah Mohamed',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600">🎓 SkillNova</h1>
            <div className="flex gap-4">
              <button
                onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {i18n.language === 'ar' ? 'English' : 'العربية'}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                {t('login')}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            {i18n.language === 'ar' ? 'تعلم مهارات جديدة' : 'Learn New Skills'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {i18n.language === 'ar'
              ? 'منصة تعليمية شاملة لتطوير مهاراتك في التسويق الرقمي والبرمجة'
              : 'Comprehensive platform to develop your skills in digital marketing and programming'
            }
          </p>
          <button className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            {i18n.language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
          </button>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-12">
          {i18n.language === 'ar' ? 'الكورسات المميزة' : 'Featured Courses'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {i18n.language === 'ar' ? course.titleAr : course.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {course.isFree ? 'Free' : `$${course.price}`}
                  </span>
                  <span className="text-yellow-500">⭐ {course.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-400">© 2024 SkillNova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
