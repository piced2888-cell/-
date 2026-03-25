import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Share2, 
  Mail, 
  Video, 
  Plus, 
  History, 
  Settings, 
  Send, 
  Copy, 
  Save, 
  Trash2, 
  Loader2,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  Zap,
  Table,
  Download,
  Play,
  RefreshCw,
  AlertCircle,
  Shirt,
  Layers,
  CheckSquare,
  ExternalLink,
  ArrowRight,
  Eye,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';
import { ContentType, GeneratedContent, CONTENT_TYPES, TONES, ControlRow, SONGKRAN_SAMPLES, TSHIRT_SAMPLES } from './types';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'control-desk' | 'assembly-line'>('generate');
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('article');
  const [tone, setTone] = useState('professional');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedScript, setSelectedScript] = useState<ControlRow | null>(null);
  const [characterAnchor, setCharacterAnchor] = useState('A stunning young Thai female model with a sleek, sharp, chin-length black bob haircut, wearing a minimalist trendy outfit, expressive friendly face, flawless skin.');
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  // Control Desk State
  const [controlRows, setControlRows] = useState<ControlRow[]>([]);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Load history and control rows from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('content_factory_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedControlRows = localStorage.getItem('content_factory_control_rows');
    if (savedControlRows) {
      setControlRows(JSON.parse(savedControlRows));
    } else {
      // Initial empty row
      setControlRows([{
        id: generateId(),
        productId: '',
        productName: '',
        usp: '',
        script: '',
        imagePrompt: '',
        hook: '',
        status: 'pending'
      }]);
    }
  }, []);

  // Save control rows to localStorage
  useEffect(() => {
    if (controlRows.length > 0) {
      localStorage.setItem('content_factory_control_rows', JSON.stringify(controlRows));
    }
  }, [controlRows]);

  const saveToHistory = (content: string, topicStr: string, type: ContentType) => {
    const newEntry: GeneratedContent = {
      id: generateId(),
      type,
      topic: topicStr,
      content,
      timestamp: Date.now(),
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('content_factory_history', JSON.stringify(updatedHistory));
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const prompt = `
        คุณคือผู้เชี่ยวชาญด้านการสร้างคอนเทนต์ (Content Creator Expert)
        ช่วยสร้างเนื้อหาประเภท: ${contentType}
        หัวข้อ: ${topic}
        โทนเสียง: ${tone}
        คำสำคัญที่ต้องมี: ${keywords}
        กรุณาสร้างเนื้อหาที่มีคุณภาพ น่าสนใจ และเหมาะสมกับแพลตฟอร์ม โดยใช้ภาษาไทยที่สละสลวย
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      const result = response.text || "ขออภัย ไม่สามารถสร้างเนื้อหาได้ในขณะนี้";
      setGeneratedContent(result);
      saveToHistory(result, topic, contentType);
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent("เกิดข้อผิดพลาดในการสร้างเนื้อหา กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsGenerating(false);
    }
  };

  // Control Desk Functions
  const addControlRow = () => {
    const newRow: ControlRow = {
      id: generateId(),
      productId: '',
      productName: '',
      usp: '',
      script: '',
      imagePrompt: '',
      hook: '',
      caption: '',
      hashtags: '',
      status: 'pending'
    };
    setControlRows([...controlRows, newRow]);
  };

  const updateControlRow = (id: string, field: keyof ControlRow, value: string) => {
    setControlRows(controlRows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const deleteControlRow = (id: string) => {
    if (controlRows.length === 1) return;
    setControlRows(controlRows.filter(row => row.id !== id));
  };

  const loadSongkranSamples = () => {
    const samples = SONGKRAN_SAMPLES.map((s) => ({
      id: generateId(),
      productId: s.productId || '',
      productName: s.productName || '',
      usp: s.usp || '',
      script: '',
      imagePrompt: '',
      hook: '',
      status: 'pending' as const
    }));
    setControlRows(samples);
  };

  const loadTshirtSamples = () => {
    const newRows: ControlRow[] = TSHIRT_SAMPLES.map((sample) => ({
      id: generateId(),
      productId: sample.productId || '',
      productName: sample.productName || '',
      usp: sample.usp || '',
      script: sample.script || '',
      imagePrompt: sample.imagePrompt || '',
      hook: sample.hook || '',
      status: sample.status || 'pending',
    }));
    setControlRows(newRows);
  };

  const generateImage = async (id: string) => {
    const row = controlRows.find(r => r.id === id);
    if (!row || !row.imagePrompt) return;

    setControlRows(prev => prev.map(r => r.id === id ? { ...r, imageStatus: 'generating' } : r));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              text: row.imagePrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
            imageSize: "1K"
          },
        },
      });

      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break;
        }
      }

      if (imageUrl) {
        setControlRows(prev => prev.map(r => r.id === id ? { ...r, imageUrl, imageStatus: 'completed' } : r));
      } else {
        throw new Error('No image generated');
      }

    } catch (error) {
      console.error("Error generating image:", error);
      setControlRows(prev => prev.map(r => r.id === id ? { ...r, imageStatus: 'error' } : r));
    }
  };

  const generateAllImages = async () => {
    for (const row of controlRows) {
      if (row.imagePrompt && row.imageStatus !== 'completed') {
        await generateImage(row.id);
      }
    }
  };

  const generateAllVideos = async () => {
    if (!hasApiKey) {
      await handleOpenSelectKey();
    }
    for (const row of controlRows) {
      if (row.script && row.videoStatus !== 'completed') {
        await generateVideo(row.id);
      }
    }
  };

  const generateVideo = async (id: string) => {
    if (!hasApiKey) {
      await handleOpenSelectKey();
    }
    const row = controlRows.find(r => r.id === id);
    if (!row || !row.script) return;

    setControlRows(prev => prev.map(r => r.id === id ? { ...r, videoStatus: 'generating' } : r));

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A high-quality TikTok video featuring ${characterAnchor}. The model is showcasing ${row.productName}. Action: ${row.script}. Visual style: ${row.imagePrompt}. Cinematic lighting, vibrant colors, 4k resolution.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '9:16'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setControlRows(prev => prev.map(r => r.id === id ? { ...r, videoUrl: downloadLink, videoStatus: 'completed' } : r));
      } else {
        throw new Error('No video generated');
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setControlRows(prev => prev.map(r => r.id === id ? { ...r, videoStatus: 'error' } : r));
    }
  };

  const generateRow = async (id: string) => {
    const row = controlRows.find(r => r.id === id);
    if (!row || !row.productName) return;

    updateControlRow(id, 'status', 'generating');

    try {
      const prompt = `
        คุณคือผู้เชี่ยวชาญด้านการสร้างคอนเทนต์สำหรับ TikTok และ Image Prompt ระดับมืออาชีพ
        
        ข้อมูลสินค้า:
        - ชื่อสินค้า: ${row.productName}
        - รหัสสินค้า: ${row.productId}
        - จุดขายสำคัญ (USP): ${row.usp}
        
        ภารกิจ: สร้างข้อมูล 5 ส่วนในรูปแบบ JSON โดยใช้กลยุทธ์ "พาดหัวแตกแตน" (Explosive Hook) และ "USP-Driven Closing"
        
        กลยุทธ์การเขียน (Writing Strategy):
        - Hook (3 วินาทีแรก): ต้อง "แตกแตน" ขั้นสุด! หยุดนิ้วคนดูให้ได้ใน 3 วิ! ใช้ประโยคกระแทกใจ เช่น "อย่าหาทำ!", "ความลับที่แบรนด์ไม่บอก...", "ถ้าไม่อยากหน้าพังฟังทางนี้!", "ใครไม่ตำคือพลาดมากแม่!"
        - Script: โครงสร้าง [Hook 3 วินาที] -> [ขยี้ปัญหา/Pain Point ให้เห็นภาพ] -> [Solution ด้วย USP: ${row.usp}] -> [Call to Action: ปิดการขายแบบตัวแม่ กระตุ้นให้กดตะกร้าด่วน!]
        - Tone: พลังล้นเหลือ (High Energy), ตื่นเต้นสุดขีด, ใช้ภาษาวัยรุ่น TikTok และสแลงไทยแบบจัดเต็ม (เช่น "จึ้งมากแม่", "ตัวแม่ต้องมี", "ตะโกน", "ปังไม่ไหว", "ของมันต้องมี", "ตำด่วน", "เลิศมาก")
        - Engagement: มีการตั้งคำถามหรือใช้ประโยคที่ทำให้คนดูรู้สึกร่วมด้วยตลอดทั้งคลิป
        
        กลยุทธ์ภาพ (Visual Strategy):
        - Image Prompt: ภาษาอังกฤษ สำหรับ Gemini (High-Quality, Photorealistic, 8k)
        - Character Anchor: [${characterAnchor}]
        - Instructions: The imagePrompt MUST start with the Character Anchor description to ensure visual consistency. Describe the model interacting with the product: ${row.productName}. 
        - Style: Cinematic lighting, vibrant colors, professional commercial photography, shallow depth of field.
        - Aspect Ratio: 9:16 (Portrait)
        
        1. script: สคริปต์ TikTok 30 วินาที (ภาษาไทย) - เน้นจังหวะการพูดที่กระชับ
        2. imagePrompt: Image Prompt ภาษาอังกฤษ
        3. hook: ข้อความพาดหัวตัวโตๆ (Subtitle) - ต้องสั้นและกระแทกใจที่สุด
        4. caption: แคปชั่นสำหรับโพสต์ TikTok (ภาษาไทย) พร้อมอิโมจิและโปรโมชั่น
        5. hashtags: แฮชแท็กที่เกี่ยวข้อง 5-7 อัน
        
        ตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอกเหนือจาก JSON:
        { "script": "...", "imagePrompt": "...", "hook": "...", "caption": "...", "hashtags": "..." }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      let text = response.text || '{}';
      // Clean up potential markdown or extra text
      if (text.includes('```json')) {
        text = text.split('```json')[1].split('```')[0];
      } else if (text.includes('```')) {
        text = text.split('```')[1].split('```')[0];
      }
      
      // Find the first { and last } to extract pure JSON
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.substring(firstBrace, lastBrace + 1);
      }

      const data = JSON.parse(text.trim());
      
      setControlRows(prev => prev.map(r => r.id === id ? {
        ...r,
        script: data.script || '',
        imagePrompt: data.imagePrompt || '',
        hook: data.hook || '',
        caption: data.caption || '',
        hashtags: data.hashtags || '',
        status: 'completed'
      } : r));

      // Also save to history for convenience
      saveToHistory(`${data.hook}\n\n${data.script}\n\nPrompt: ${data.imagePrompt}\n\nCaption: ${data.caption}\n\nHashtags: ${data.hashtags}`, row.productName, 'tiktok');

    } catch (error) {
      console.error("Error generating row:", error);
      updateControlRow(id, 'status', 'error');
    }
  };

  const generateAllRows = async () => {
    setIsBatchGenerating(true);
    for (const row of controlRows) {
      if (row.productName && row.status !== 'completed') {
        await generateRow(row.id);
      }
    }
    setIsBatchGenerating(false);
  };

  const exportToCSV = () => {
    const headers = ['Product ID', 'Product Name', 'USP', 'Hook', 'Script', 'Image Prompt', 'Caption', 'Hashtags'];
    const rows = controlRows.map(row => [
      row.productId,
      row.productName,
      row.usp,
      row.hook,
      row.script,
      row.imagePrompt,
      row.caption,
      row.hashtags
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `content_factory_batch_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-5 h-5" />;
      case 'social': return <Share2 className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'script': return <Video className="w-5 h-5" />;
      case 'tiktok': return <Zap className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-tight">Content</h1>
            <span className="text-indigo-600 font-bold text-lg leading-tight">Factory</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button 
            onClick={() => setActiveTab('generate')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeTab === 'generate' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>สร้างคอนเทนต์</span>
          </button>
          <button 
            onClick={() => setActiveTab('control-desk')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeTab === 'control-desk' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Table className="w-5 h-5" />
            <span>โต๊ะควบคุม (Batch)</span>
          </button>
          <button 
            onClick={() => setActiveTab('assembly-line')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeTab === 'assembly-line' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Layers className="w-5 h-5" />
            <span>สายพานการผลิต</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeTab === 'history' ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <History className="w-5 h-5" />
            <span>ประวัติการสร้าง</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Upgrade</p>
            <p className="text-sm font-bold mb-3">ปลดล็อกขีดจำกัด AI</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all">
              ดูแผนบริการ
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold">
            {activeTab === 'generate' ? 'สร้างคอนเทนต์ใหม่' : activeTab === 'control-desk' ? 'โต๊ะควบคุมอัจฉริยะ' : activeTab === 'assembly-line' ? 'สายพานการผลิต 6 ขั้นตอน' : 'ประวัติการสร้าง'}
          </h2>
          <div className="flex items-center gap-4">
            {activeTab === 'control-desk' && (
              <div className="flex items-center gap-2">
                {!hasApiKey && (
                  <button 
                    onClick={handleOpenSelectKey}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                  >
                    <Settings className="w-4 h-4" />
                    <span>ตั้งค่า API Key (Veo)</span>
                  </button>
                )}
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>ส่งออก CSV</span>
                </button>
                <button 
                  onClick={loadSongkranSamples}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>โหลดตัวอย่างสงกรานต์</span>
                </button>
                <button 
                  onClick={loadTshirtSamples}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  <Shirt className="w-4 h-4" />
                  <span>โหลดตัวอย่างเสื้อยืด</span>
                </button>
                <button 
                  onClick={generateAllRows}
                  disabled={isBatchGenerating}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  {isBatchGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>เจนสคริปต์ทั้งหมด</span>
                </button>
                <button 
                  onClick={generateAllVideos}
                  disabled={!hasApiKey}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50"
                >
                  <VideoIcon className="w-4 h-4" />
                  <span>เจนวิดีโอทั้งหมด</span>
                </button>
              </div>
            )}
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-full mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'generate' && (
              <motion.div 
                key="generate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                {/* Form Section */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">ตั้งค่าคอนเทนต์</h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2">ประเภทคอนเทนต์</label>
                        <div className="grid grid-cols-2 gap-2">
                          {CONTENT_TYPES.map(type => (
                            <button
                              key={type.id}
                              onClick={() => setContentType(type.id as ContentType)}
                              className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-center",
                                contentType === type.id 
                                  ? "border-indigo-600 bg-indigo-50 text-indigo-600" 
                                  : "border-gray-100 hover:border-gray-200 text-gray-500"
                              )}
                            >
                              {getIcon(type.id)}
                              <span className="text-[10px] mt-2 font-bold uppercase tracking-tighter">{type.label.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">หัวข้อหรือประเด็นหลัก</label>
                        <textarea 
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="เช่น วิธีดูแลต้นไม้ในร่ม, รีวิวสมาร์ทโฟนรุ่นใหม่..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">โทนเสียง (Tone of Voice)</label>
                        <select 
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm appearance-none bg-no-repeat bg-[right_1rem_center]"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
                        >
                          {TONES.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">คำสำคัญ (Keywords)</label>
                        <input 
                          type="text"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="คีย์เวิร์ด 1, คีย์เวิร์ด 2..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>

                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                        className={cn(
                          "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                          isGenerating || !topic 
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                        )}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>กำลังผลิต...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>เริ่มผลิตคอนเทนต์</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col min-h-[600px]">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">ผลลัพธ์จาก AI</h3>
                      </div>
                      {generatedContent && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative"
                          >
                            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto prose prose-indigo max-w-none">
                      {isGenerating ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                          <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <p className="animate-pulse font-medium">AI กำลังรังสรรค์เนื้อหาให้คุณ...</p>
                        </div>
                      ) : generatedContent ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <ReactMarkdown>{generatedContent}</ReactMarkdown>
                        </motion.div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 text-center space-y-6">
                          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <Plus className="w-10 h-10" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-400">ยังไม่มีเนื้อหา</p>
                            <p className="text-sm">กรอกข้อมูลทางด้านซ้ายเพื่อเริ่มสร้างคอนเทนต์</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'control-desk' && (
              <div className="space-y-6">
                {/* Character Anchor Setting */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Character Anchor (Brand Consistency)</h3>
                        <p className="text-xs text-gray-400">กำหนดรูปลักษณ์ของนางแบบเพื่อความสม่ำเสมอในทุกวิดีโอ</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!hasApiKey && (
                        <button 
                          onClick={handleOpenSelectKey}
                          className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition-all flex items-center gap-2"
                        >
                          <Settings size={14} /> ตั้งค่า API Key สำหรับ Video
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={characterAnchor}
                      onChange={(e) => setCharacterAnchor(e.target.value)}
                      placeholder="เช่น Thai female model, short stylish bob hair, trendy outfit..."
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                      Global Setting
                    </div>
                  </div>
                </div>

                {/* Strategy Guide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-orange-600">
                      <Zap size={18} />
                      <h3 className="font-bold text-[10px] uppercase tracking-wider">Hook Strategy</h3>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      ใช้ <span className="font-bold text-slate-900">Negative Hook</span> เพื่อเตือนปัญหา หรือ <span className="font-bold text-slate-900">Benefit Hook</span> เพื่อโชว์ผลลัพธ์ทันที
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                      <Layers size={18} />
                      <h3 className="font-bold text-[10px] uppercase tracking-wider">Visual Vibe</h3>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      เน้นความ <span className="font-bold text-slate-900">Vibrant & Joyful</span> สำหรับเทศกาล แสงแบบ <span className="font-bold text-slate-900">Golden Hour</span> เพื่อความพรีเมียม
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-green-600">
                      <CheckSquare size={18} />
                      <h3 className="font-bold text-[10px] uppercase tracking-wider">Conversion</h3>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      ใส่ <span className="font-bold text-slate-900">Urgency</span> (เช่น "สั่งก่อน 8 เม.ย.") และ <span className="font-bold text-slate-900">Bundle Deals</span> เพื่อเพิ่มยอดขาย
                    </p>
                  </div>
                </div>

                <motion.div 
                  key="control-desk"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-12">#</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-32">รหัสสินค้า</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-48">ชื่อสินค้า</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">จุดขาย (USP)</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-64">สคริปต์ / Hook</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-32 text-center">Image</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-32 text-center">Video</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24 text-center">สถานะ</th>
                        <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {controlRows.map((row, index) => (
                        <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all group">
                          <td className="p-4 text-xs text-gray-400 font-mono">{index + 1}</td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.productId}
                              onChange={(e) => updateControlRow(row.id, 'productId', e.target.value)}
                              placeholder="เช่น COLLA"
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="text" 
                              value={row.productName}
                              onChange={(e) => updateControlRow(row.id, 'productName', e.target.value)}
                              placeholder="ชื่อสินค้า..."
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <textarea 
                              value={row.usp}
                              onChange={(e) => updateControlRow(row.id, 'usp', e.target.value)}
                              placeholder="จุดเด่น 3-5 ข้อ..."
                              className="w-full bg-transparent border-none focus:ring-0 text-xs resize-none h-12 placeholder:text-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            {row.status === 'completed' ? (
                              <div className="space-y-2">
                                <button 
                                  onClick={() => setSelectedScript(row)}
                                  className="w-full p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-[10px] text-indigo-700 line-clamp-2 text-left transition-colors group/script"
                                >
                                  <span className="font-bold flex items-center gap-1 mb-1">
                                    <Zap className="w-3 h-3 text-orange-500" /> Hook:
                                  </span> 
                                  {row.hook}
                                  <div className="mt-1 text-[9px] text-indigo-400 opacity-0 group-hover/script:opacity-100 transition-opacity flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> ดูสคริปต์
                                  </div>
                                </button>
                                <div className="text-[9px] text-gray-400 line-clamp-1 italic">
                                  {row.imagePrompt}
                                </div>
                              </div>
                            ) : row.status === 'generating' ? (
                              <div className="flex items-center gap-2 text-indigo-600 text-xs animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>กำลังประมวลผล...</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-300 italic">รอการประมวลผล</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {row.imageUrl ? (
                              <div className="relative group/img">
                                <img 
                                  src={row.imageUrl} 
                                  alt="Generated" 
                                  className="w-16 h-24 object-cover rounded-lg shadow-sm mx-auto"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <button 
                                    onClick={() => generateImage(row.id)}
                                    className="p-1 bg-white rounded-full text-indigo-600 shadow-lg"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : row.imageStatus === 'generating' ? (
                              <div className="w-16 h-24 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-2 mx-auto">
                                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                <span className="text-[8px] text-indigo-400 font-bold uppercase">Generating</span>
                              </div>
                            ) : (
                              <button 
                                onClick={() => generateImage(row.id)}
                                disabled={row.status !== 'completed'}
                                className="w-16 h-24 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 mx-auto hover:border-indigo-200 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-gray-100"
                              >
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                                <span className="text-[8px] text-gray-300 font-bold uppercase">Generate</span>
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {row.videoUrl ? (
                              <div className="relative group/vid">
                                <video 
                                  src={row.videoUrl} 
                                  className="w-16 h-24 object-cover rounded-lg shadow-sm mx-auto"
                                  muted
                                  loop
                                  onMouseOver={(e) => e.currentTarget.play()}
                                  onMouseOut={(e) => e.currentTarget.pause()}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/vid:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <button 
                                    onClick={() => generateVideo(row.id)}
                                    className="p-1 bg-white rounded-full text-purple-600 shadow-lg"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : row.videoStatus === 'generating' ? (
                              <div className="w-16 h-24 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-2 mx-auto">
                                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                <span className="text-[8px] text-purple-400 font-bold uppercase">Generating</span>
                              </div>
                            ) : (
                              <button 
                                onClick={() => generateVideo(row.id)}
                                disabled={row.status !== 'completed' || !hasApiKey}
                                className="w-16 h-24 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 mx-auto hover:border-purple-200 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-gray-100"
                              >
                                <VideoIcon className="w-4 h-4 text-gray-300" />
                                <span className="text-[8px] text-gray-300 font-bold uppercase">Generate</span>
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {row.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.status === 'error' ? (
                              <AlertCircle className="w-5 h-5 text-red-500 mx-auto" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-200 mx-auto"></div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => generateRow(row.id)}
                                disabled={!row.productName || row.status === 'generating'}
                                title="Generate Script"
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              >
                                <RefreshCw className={cn("w-4 h-4", row.status === 'generating' && "animate-spin")} />
                              </button>
                              <button 
                                onClick={() => deleteControlRow(row.id)}
                                title="Delete Row"
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button 
                    onClick={addControlRow}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มแถวใหม่</span>
                  </button>
                  <p className="text-[10px] text-gray-400 font-medium">
                    * ข้อมูลจะถูกบันทึกอัตโนมัติลงในเบราว์เซอร์ของคุณ
                  </p>
                </div>
              </motion.div>
            </div>
          )}

            {activeTab === 'assembly-line' && (
              <motion.div
                key="assembly-line"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Layers className="w-6 h-6" />
                    สายพานการผลิตคอนเทนต์ 6 ขั้นตอน
                  </h3>
                  <p className="text-indigo-100 max-w-2xl">
                    เปลี่ยนข้อมูลสินค้าดิบให้เป็นวิดีโอสร้างรายได้บน TikTok อย่างเป็นระบบ รวดเร็ว และมีคุณภาพสูง
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Step 1: Input */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <Table className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">STEP 01</span>
                      <h4 className="font-bold text-lg">คัดกรอง (Input)</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      เลือกสินค้า Trending จาก Kalodata หรือ TikTok Shop ที่มีคะแนนร้านค้า 4.5+ และยอดขายพุ่งแรง
                    </p>
                    <button 
                      onClick={() => setActiveTab('control-desk')}
                      className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      ไปที่โต๊ะควบคุม <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Step 2: Scripting */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">STEP 02</span>
                      <h4 className="font-bold text-lg">เจนสมอง (Scripting)</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      ใช้ AI เขียนสคริปต์ที่เน้น "พาดหัวแบบแตกแตน" ใน 3 วินาทีแรก และปิดการขายด้วย USP ที่ชัดเจน
                    </p>
                    <div className="flex items-center gap-2 text-xs text-purple-600 font-medium mb-4">
                      <CheckCircle2 className="w-4 h-4" /> AI พร้อมทำงานใน Batch Mode
                    </div>
                    <button 
                      onClick={() => setActiveTab('control-desk')}
                      className="w-full py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-bold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                    >
                      ไปที่ Control Desk <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Step 3: Image Gen */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform">
                      <Video className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">STEP 03</span>
                      <h4 className="font-bold text-lg">ผลิตภาพ (Image Gen)</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      สร้าง Prompt แบบ Character Anchor (นางแบบผมบ๊อบ) เพื่อความสม่ำเสมอของแบรนด์ในทุกวิดีโอ
                    </p>
                    <div className="flex items-center gap-2 text-xs text-pink-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Prompt ภาษาอังกฤษแม่นยำ
                    </div>
                  </div>

                  {/* Step 4: Assembly */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">STEP 04</span>
                      <h4 className="font-bold text-lg">ประกอบร่าง (Assembly)</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      นำภาพและสคริปต์ไปประกอบเป็นวิดีโอด้วย Google Vids หรือ CapCut พร้อมใส่เสียงพากย์ AI
                    </p>
                    <a 
                      href="https://vids.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      เปิด Google Vids <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Step 5: Distribution */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">STEP 05</span>
                      <h4 className="font-bold text-lg">กระจายเสียง (Post)</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      โพสต์ลง TikTok พร้อมแคปชั่นและแฮชแท็กที่ AI เตรียมไว้ให้ เพื่อดึงดูดกลุ่มเป้าหมายที่ใช่
                    </p>
                    <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> แคปชั่น & แฮชแท็ก พร้อมใช้
                    </div>
                  </div>

                  {/* Step 6: Analysis */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                      <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">STEP 06</span>
                      <h4 className="font-bold text-lg">วิเคราะห์ (Analysis)</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      ติดตามยอดวิวและยอดขาย เพื่อนำข้อมูลกลับมาปรับปรุงการคัดเลือกสินค้าในรอบถัดไป
                    </p>
                    <button className="w-full py-2 bg-gray-50 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2">
                      Coming Soon
                    </button>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    สถานะปัจจุบันของสายพาน
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-700">ระบบ AI เจนสคริปต์ & พรอมต์ภาพ</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-700">ระบบ Batch Processing (โต๊ะควบคุม)</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        <span className="text-sm font-medium text-gray-700">ระบบเชื่อมต่อ Google Drive อัตโนมัติ</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">PLANNED</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-5xl mx-auto"
              >
                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                              {getIcon(item.type)}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm line-clamp-1">{item.topic}</h4>
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                {new Date(item.timestamp).toLocaleDateString('th-TH', { 
                                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const updatedHistory = history.filter(h => h.id !== item.id);
                              setHistory(updatedHistory);
                              localStorage.setItem('content_factory_history', JSON.stringify(updatedHistory));
                            }}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 h-32 overflow-hidden relative">
                          <div className="text-xs text-gray-500 line-clamp-5">
                            <ReactMarkdown>{item.content}</ReactMarkdown>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase">
                            {CONTENT_TYPES.find(t => t.id === item.type)?.label.split(' ')[0]}
                          </span>
                          <button 
                            onClick={() => {
                              setGeneratedContent(item.content);
                              setTopic(item.topic);
                              setContentType(item.type);
                              setActiveTab('generate');
                            }}
                            className="text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1 transition-all"
                          >
                            เปิดดูอีกครั้ง <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[500px] flex flex-col items-center justify-center text-gray-300 text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                      <History className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-400">ไม่มีประวัติการสร้าง</p>
                      <p className="text-sm">คอนเทนต์ที่คุณสร้างจะปรากฏที่นี่</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('generate')}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                      เริ่มสร้างคอนเทนต์แรก
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            {/* Script Preview Modal */}
            <AnimatePresence>
              {selectedScript && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                  >
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{selectedScript.productName}</h3>
                          <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-widest font-bold">Script Preview</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedScript(null)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Hook Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">
                          <Zap className="w-3 h-3" /> 3-Second Explosive Hook
                        </label>
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-900 font-bold text-xl leading-tight text-center">
                          "{selectedScript.hook}"
                        </div>
                      </div>

                      {/* Script Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                          <Video className="w-3 h-3" /> Full TikTok Script
                        </label>
                        <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-900 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedScript.script}
                        </div>
                      </div>

                      {/* USP Closing Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> USP Closing Strategy
                        </label>
                        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-900 text-xs italic">
                          <span className="font-bold block mb-1">USP: {selectedScript.usp}</span>
                          ปิดการขายด้วยการย้ำจุดขายหลักและกระตุ้นการตัดสินใจทันที
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedScript.script || '');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" /> {copied ? 'คัดลอกแล้ว!' : 'คัดลอกสคริปต์'}
                        </button>
                        <button 
                          onClick={() => {
                            generateVideo(selectedScript.id);
                            setSelectedScript(null);
                          }}
                          disabled={selectedScript.videoStatus === 'generating' || !hasApiKey}
                          className="flex-1 py-3 bg-purple-600 text-white rounded-2xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {selectedScript.videoStatus === 'generating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <VideoIcon className="w-4 h-4" />}
                          สร้างวิดีโอด้วย Veo
                        </button>
                      </div>
                      <button 
                        onClick={() => setSelectedScript(null)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                      >
                        ตกลง
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


