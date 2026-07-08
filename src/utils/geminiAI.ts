import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

interface ChatContext {
  language: 'ar' | 'en';
  context?: string;
}

export const generateResponse = async (
  userMessage: string,
  chatContext?: ChatContext
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = chatContext?.language === 'ar'
      ? `أنت مساعد ذكي لمنصة SkillNova التعليمية. تساعد الطلاب والمدربين على:
      - الإجابة على أسئلتهم حول الكورسات
      - تقديم نصائح تعليمية
      - الإجابة على استفسارات تقنية
      - توجيه المستخدمين في المنصة
      رد بشكل احترافي وودي باللغة العربية.`
      : `You are an intelligent assistant for SkillNova e-learning platform. Help students and instructors by:
      - Answering questions about courses
      - Providing educational tips
      - Resolving technical issues
      - Guiding users on the platform
      Respond professionally and friendly in English.`;

    const fullPrompt = `${systemPrompt}\n\nالمستخدم: ${userMessage}\nالمساعد:`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    
    return response.text() || 'آسف، لم أتمكن من إنشاء رد في هذا الوقت';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return chatContext?.language === 'ar'
      ? 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة لاحقاً.'
      : 'Sorry, an error occurred processing your request. Please try again later.';
  }
};

export const validateGeminiKey = async (): Promise<boolean> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    await model.generateContent('test');
    return true;
  } catch (error) {
    console.error('Gemini API validation failed:', error);
    return false;
  }
};
