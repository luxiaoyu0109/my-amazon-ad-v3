import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // 从环境变量中读取密钥。前端代码和浏览器的 F12 是绝对看不到这句话的！
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: '没有配置 API Key！' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "You are an expert Amazon PPC Manager." }] }
      })
    });

    if (!response.ok) {
      throw new Error('请求 Gemini API 失败');
    }

    const data = await response.json();
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return NextResponse.json({ result: insight });

  } catch (error) {
    console.error('AI服务错误:', error);
    return NextResponse.json({ error: 'AI 诊断服务异常' }, { status: 500 });
  }
}