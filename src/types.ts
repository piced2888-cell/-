export type ContentType = 'article' | 'social' | 'email' | 'script' | 'tiktok' | 'tshirt' | 'assembly';

export interface GeneratedContent {
  id: string;
  type: ContentType;
  topic: string;
  content: string;
  timestamp: number;
}

export interface ControlRow {
  id: string;
  productId: string;
  productName: string;
  usp: string;
  script?: string;
  imagePrompt?: string;
  imageUrl?: string;
  videoUrl?: string;
  hook?: string;
  caption?: string;
  hashtags?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  imageStatus?: 'pending' | 'generating' | 'completed' | 'error';
  videoStatus?: 'pending' | 'generating' | 'completed' | 'error';
}

export const CONTENT_TYPES = [
  { id: 'article', label: 'บทความ (Article)', icon: 'FileText' },
  { id: 'social', label: 'โซเชียลมีเดีย (Social Media)', icon: 'Share2' },
  { id: 'email', label: 'อีเมล (Email)', icon: 'Mail' },
  { id: 'script', label: 'สคริปต์วิดีโอ (Video Script)', icon: 'Video' },
  { id: 'tiktok', label: 'TikTok Script', icon: 'Zap' },
] as const;

export const TONES = [
  { id: 'professional', label: 'เป็นทางการ' },
  { id: 'friendly', label: 'เป็นกันเอง' },
  { id: 'creative', label: 'สร้างสรรค์' },
  { id: 'persuasive', label: 'โน้มน้าวใจ' },
  { id: 'humorous', label: 'ตลกขบขัน' },
] as const;

export const TSHIRT_SAMPLES: Partial<ControlRow>[] = [
  { productId: 'TS_WHITE', productName: 'เสื้อยืดสีขาว มินิมอล', usp: 'ผ้าคอตตอนพรีเมียม, ทรงสวย, ใส่ไปคาเฟ่รอดทุกชุด' },
  { productId: 'TS_BLACK', productName: 'เสื้อยืดสีดำ สายสตรีท', usp: 'พรางหุ่นดีมาก, เท่ ดูแพง, ซักแล้วไม่ย้วย' },
  { productId: 'TS_BEIGE', productName: 'เสื้อยืดสีเบจ เอิร์ธโทน', usp: 'สีละมุนขับผิว, เนื้อผ้าหนานุ่ม, สไตล์เกาหลี' },
  { productId: 'TS_NAVY', productName: 'เสื้อยืดสีกรมท่า', usp: 'ใส่แล้วออร่าพุ่ง, คัตติ้งเนี้ยบ, คอไม่แคบ' },
  { productId: 'TS_OVERSIZE', productName: 'เสื้อยืดทรง Oversize', usp: 'ทรงที่ถูกต้อง, ใส่สบาย, แมทช์ง่าย' },
];

export const SONGKRAN_SAMPLES: Partial<ControlRow>[] = [
  { 
    productId: 'WATER_BAG', 
    productName: 'ซองกันน้ำใส่มือถือ', 
    usp: 'กันน้ำ 100%, ทัชสกรีนได้, สายคล้องคอปรับได้',
    hook: 'มือถือหลักหมื่น พังเพราะน้ำหลักสิบ ไม่คุ้ม! 📱💦',
    script: 'สงกรานต์นี้ใครกลัวมือถือพังต้องดู! ซองกันน้ำ 100% ทัชสกรีนลื่นปรื๊ด ถ่ายรูปใต้น้ำชัดแจ๋ว สายคล้องปรับได้ ไม่ต้องกลัวหาย พิกัดในตะกร้าเลย!',
    imagePrompt: 'Same Thai female model, short stylish bob hair, holding a transparent waterproof phone pouch around her neck, wet hair, laughing while being splashed with water, festive Silom street background, cinematic water droplets, 4k, 9:16.',
    caption: 'สงกรานต์นี้เล่นน้ำสบายใจ มือถือไม่พังแน่นอน! 💦 ทัชลื่น ถ่ายรูปชัด พิกัดตะกร้าเลย #สงกรานต์2026 #ซองกันน้ำ #รีวิวของดี',
    hashtags: '#สงกรานต์2026 #ซองกันน้ำ #รีวิวของดี #TikTokShop #ของมันต้องมี',
    status: 'completed'
  },
  { 
    productId: 'FLORAL_SHIRT', 
    productName: 'เสื้อลายดอกสงกรานต์', 
    usp: 'ผ้าเรยอนใส่สบาย, แห้งไว, สีสันสดใสไม่ตก',
    hook: 'อยากเด่นที่สุดในสยามต้องตัวนี้! 🌸✨',
    script: 'แฟชั่นสงกรานต์ที่ต้องมี! เสื้อลายดอกสีสดใส ผ้าเรยอนใส่สบาย แห้งไวมาก โดนฉีดน้ำแค่ไหนก็ยังสวย พิกัดเสื้อลายดอกจิ้มเลย!',
    imagePrompt: 'Same Thai female model, short stylish bob hair, wearing a vibrant colorful floral Songkran shirt, smiling brightly, standing in a crowd with water guns, sunny outdoor festival, golden hour lighting, 4k, 9:16.',
    caption: 'เสื้อลายดอกที่จริงใจ! 🌸 ใส่สบาย แห้งไว สีสดใสสุดๆ #เสื้อลายดอก #แฟชั่นสงกรานต์ #แต่งตัวไปเล่นน้ำ',
    hashtags: '#เสื้อลายดอก #แฟชั่นสงกรานต์ #แต่งตัวไปเล่นน้ำ #สงกรานต์ #TikTokFashion',
    status: 'completed'
  },
  { 
    productId: 'SUNSCREEN', 
    productName: 'ครีมกันแดดเนื้อน้ำ', 
    usp: 'SPF50+ PA++++, บางเบาไม่เหนอะหนะ, กันน้ำกันเหงื่อ',
    hook: 'ระวังหน้าไหม้! สงกรานต์ปีนี้แดดแรงกว่าทุกปี ☀️🔥',
    script: 'ทาปุ๊บ ออกแดดปั๊บ ไม่เหนียว ไม่วอก! กันแดดเนื้อน้ำ SPF50+ บางเบาขั้นสุด กันน้ำกันเหงื่อ หน้าเป๊ะตลอดวัน ไม่เป็นคราบขาวแน่นอน สงกรานต์นี้ต้องพก!',
    imagePrompt: 'Same Thai female model, short stylish bob hair, applying sunscreen on her glowing face, glass skin effect, bright natural sunlight, modern outdoor cafe background, 4k, 9:16.',
    caption: 'กันแดดที่คนเล่นน้ำต้องรัก! ☀️ หน้าไม่เยิ้ม ไม่เป็นคราบ #กันแดดกันน้ำ #รีวิวบิวตี้ #สงกรานต์หน้าเป๊ะ',
    hashtags: '#กันแดดกันน้ำ #รีวิวบิวตี้ #สงกรานต์หน้าเป๊ะ #กันแดดเนื้อน้ำ #สกินแคร์',
    status: 'completed'
  },
  { 
    productId: 'WATER_GUN', 
    productName: 'ปืนฉีดน้ำแรงดันสูง', 
    usp: 'ยิงไกล 10 เมตร, จุน้ำเยอะ, วัสดุ ABS ทนทาน',
    hook: 'ยิงไกลถึงหน้าปากซอย! สายบวกต้องมี 🔫🔥',
    script: 'สายบวกต้องมี! ปืนฉีดน้ำแรงดันสูง ยิงไกล 10 เมตร จุน้ำได้เยอะสะใจ วัสดุเกรดพรีเมียม ทนทานไม่ก๊องแก๊ง ใครอยากชนะสงกรานต์นี้จัดเลย!',
    imagePrompt: 'Same Thai female model, short stylish bob hair, holding a large colorful futuristic water gun, aiming playfully at the camera, dynamic motion blur, 4k, 9:16.',
    caption: 'ปืนฉีดน้ำแรงดันสูง ยิงไกลสะใจ! 🔫 ใครสายบวกต้องจัด #ปืนฉีดน้ำ #สงกรานต์ #ของเล่นสงกรานต์',
    hashtags: '#ปืนฉีดน้ำ #สงกรานต์ #ของเล่นสงกรานต์ #สายบวก #ไอเทมสงกรานต์',
    status: 'completed'
  },
  { 
    productId: 'GOGGLES', 
    productName: 'แว่นตากันน้ำแฟชั่น', 
    usp: 'กันน้ำเข้าตา, เลนส์ใสไม่เป็นฝ้า, ดีไซน์ล้ำสมัย',
    hook: 'กันน้ำเข้าตาแต่ไม่กันความสวย! 😎✨',
    script: 'เล่นน้ำสงกรานต์ยังไงให้ตาไม่แดง? แว่นกันน้ำแฟชั่น เลนส์ใสไม่เป็นฝ้า ดีไซน์ล้ำใส่แล้วเท่สุดๆ ป้องกันน้ำเข้าตา 100% สั่งด่วนก่อนของหมด!',
    imagePrompt: 'Same Thai female model, short stylish bob hair, wearing trendy transparent waterproof goggles, wet face with water droplets, festive urban background, 4k, 9:16.',
    caption: 'แว่นกันน้ำที่ใส่แล้วรอด! 😎 กันน้ำ 100% เลนส์ใสไม่เป็นฝ้า #แว่นกันน้ำ #แฟชั่นสงกรานต์ #ไอเทมเด็ด',
    hashtags: '#แว่นกันน้ำ #แฟชั่นสงกรานต์ #ไอเทมเด็ด #สงกรานต์2026 #รีวิวของดี',
    status: 'completed'
  },
  { productId: 'LIP_TINT', productName: 'ลิปทินท์กันน้ำติดทน', usp: 'สีชัด, กันน้ำ 100%, ไม่ติดแมสก์' },
  { productId: 'SHORTS', productName: 'กางเกงขาสั้นแห้งไว', usp: 'ผ้ายืดหยุ่น, แห้งเร็วมาก, มีกระเป๋าซิปกันของหาย' },
  { productId: 'SUN_SPRAY', productName: 'สเปรย์กันแดดตัว', usp: 'ฉีดทับเมคอัพได้, เย็นสบายผิว, กันน้ำ' },
  { productId: 'NECK_FAN', productName: 'พัดลมพกพาคล้องคอ', usp: 'ลมแรง 3 ระดับ, แบตอึด 10 ชม., ดีไซน์สวย' },
  { productId: 'POWDER', productName: 'แป้งพัฟกันน้ำ', usp: 'คุมมัน 12 ชม., กันน้ำกันเหงื่อ, ปกปิดเรียบเนียน' },
  { productId: 'DRY_BAG', productName: 'กระเป๋าเป้กันน้ำ 100%', usp: 'ความจุ 10L, ลอยน้ำได้, วัสดุ PVC หนาพิเศษ' },
  { productId: 'MASCARA', productName: 'มาสคาร่ากันน้ำ', usp: 'ขนตางอนเด้ง, ไม่แพนด้าแม้โดนน้ำฉีด, ล้างออกง่ายด้วยออยล์' },
  { productId: 'SANDALS', productName: 'รองเท้าแตะกันลื่น', usp: 'พื้นยางยึดเกาะดี, นุ่มสบายเท้า, แห้งไว' },
  { productId: 'WET_WIPE', productName: 'ทิชชู่เปียกสูตรเย็น', usp: 'ลดอุณหภูมิผิว, กลิ่นหอมสดชื่น, ยับยั้งแบคทีเรีย' },
  { productId: 'UV_CAP', productName: 'หมวกแก๊ปกันรังสียูวี', usp: 'สะท้อน UV 99%, ปรับขนาดได้, ระบายอากาศดี' },
  { productId: 'COOL_TANK', productName: 'เสื้อกล้ามผ้าเย็น', usp: 'นวัตกรรมผ้าเย็น, ระบายเหงื่อดี, ทรงสวย' },
  { productId: 'PHONE_CASE', productName: 'เคสโทรศัพท์กันกระแทก', usp: 'กันกระแทกระดับทหาร, ขอบสูงกันเลนส์กล้อง, ดีไซน์เท่' },
  { productId: 'TOWEL', productName: 'ผ้าเช็ดตัวไมโครไฟเบอร์', usp: 'ซับน้ำดีกว่า 5 ท่า, ผืนใหญ่แต่พับเล็ก, แห้งไว' },
  { productId: 'BIKINI_SET', productName: 'ชุดเซ็ตบิกินี่+เสื้อคลุม', usp: 'ดีไซน์เซ็กซี่, ผ้าว่ายน้ำเกรดพรีเมียม, มาพร้อมเสื้อคลุมเข้าชุด' },
  { productId: 'AFTER_SUN', productName: 'มาส์กหน้ากู้ผิวหลังแดด', usp: 'ลดรอยแดง, เติมความชุ่มชื้น, สารสกัดว่านหางจระเข้เข้มข้น' },
];
