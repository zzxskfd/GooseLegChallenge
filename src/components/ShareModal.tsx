/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Sparkles, Award, RotateCcw, Home, Check } from 'lucide-react';
import { sfx } from '../utils/audio';

interface ShareModalProps {
  score: number;
  correctAnswers: number;
  collapsedCount: number;
  playerName: string;
  onRestart: () => void;
  onGoHome: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  score,
  correctAnswers,
  collapsedCount,
  playerName,
  onRestart,
  onGoHome,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [copiedImage, setCopiedImage] = React.useState(false);
  const [sharingStatus, setSharingStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    sfx.playLevelUp();
  }, []);

  const getRankAndQuote = (currentScore: number) => {
    if (currentScore <= 100) {
      return {
        rank: '🍗 烤肉青铜学徒',
        quote: '“孩子们都在群里排队，阿姨数不过来有多谢谢你们……”',
        achievementDesc: '由于业务不熟，阿姨可能需要回村里冷静两天。',
        color: 'from-amber-700 to-amber-900 border-amber-600',
        starCount: 1,
      };
    } else if (currentScore <= 400) {
      return {
        rank: '👑 黄金辩腿副店长',
        quote: '“阿姨绝对是刚开始是鹅腿的！以后会清清楚楚写分明，绝不做假账！”',
        achievementDesc: '你成功捍卫了阿姨的一半清白，五道口与中关村各大校园论坛为你点赞。',
        color: 'from-yellow-600 to-amber-700 border-yellow-500',
        starCount: 2,
      };
    } else if (currentScore <= 800) {
      return {
        rank: '🎓 高校联盟专供烤腿特工',
        quote: '“五道口与中关村的学长学姐他们也就是孩子，吃饱了才有精力为国科研奋斗嘛！”',
        achievementDesc: '你是五道口与中关村各大校门最受欢迎的人物！学子们纷纷给你发帖顶贴。',
        color: 'from-indigo-600 to-indigo-900 border-indigo-400',
        starCount: 3,
      };
    } else {
      return {
        rank: '🌟 鹅腿殿堂至尊元勋',
        quote: '“阿姨今天给你们每个人排三十只黄金大壮腿！绝不限量，孩子们随便吃！”',
        achievementDesc: '名垂高校鹅腿保卫史！连各大理工和文理学院著名的教授们和万千学子都奉你为「鹅腿之神」！',
        color: 'from-purple-600 to-pink-700 border-purple-400',
        starCount: 5,
      };
    }
  };

  const info = getRankAndQuote(score);

  // Cached QR image generator for canvas reuse
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;
  const qrImageRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = qrImageUrl;
    img.onload = () => {
      qrImageRef.current = img;
    };
  }, [qrImageUrl]);

  // Shared offscreen drawing poster engine
  const drawSharePoster = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 960;
    const ctx = canvas.getContext('2d')!;

    // 1. Draw gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    let colors = ['#1e293b', '#0f172a']; // Fallback
    if (score <= 100) colors = ['#7c2d12', '#451a03']; // Bronze
    else if (score <= 400) colors = ['#ca8a04', '#78350f']; // Gold
    else if (score <= 800) colors = ['#4f46e5', '#312e81']; // Elite
    else colors = ['#7c3aed', '#831843']; // Legendary

    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Decorative outer border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // 3. Document watermark title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 15px "Inter", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('真假鹅腿大挑战 · 官方认可防塌房证书', canvas.width / 2, 90);

    // 4. Draw Rank Header block
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px "Inter", "Microsoft YaHei", sans-serif';
    ctx.fillText(info.rank, canvas.width / 2, 160);

    // 5. Stars rendering
    const starsStr = '⭐'.repeat(info.starCount);
    ctx.font = '32px sans-serif';
    ctx.fillText(starsStr, canvas.width / 2, 215);

    // 6. Draw Player/Auntie Guardian Name
    ctx.fillStyle = '#fef08a'; // yellow-200
    ctx.font = 'bold 22px "Inter", "Microsoft YaHei", sans-serif';
    ctx.fillText(`【 烤腿护法：${playerName.trim() || '匿名正义游侠'} 】`, canvas.width / 2, 275);

    // 7. Stats segment divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(80, 310);
    ctx.lineTo(canvas.width - 80, 310);
    ctx.stroke();

    // 8. Draw boxes for scores & statistics
    const boxWidth = 140;
    const boxHeight = 100;
    const itemsGap = 20;
    const startX = (canvas.width - (boxWidth * 3 + itemsGap * 2)) / 2;
    const statsY = 340;

    const statSpecs = [
      { label: '最终得分', value: `${score} 分`, color: '#fbbf24' },
      { label: '识腿成功', value: `${correctAnswers} 腿`, color: '#34d399' },
      { label: '塌房次数', value: `${collapsedCount} 次`, color: '#f87171' }
    ];

    statSpecs.forEach((spec, index) => {
      const x = startX + index * (boxWidth + itemsGap);
      
      // Box backdrop
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x, statsY, boxWidth, boxHeight);
      ctx.strokeRect(x, statsY, boxWidth, boxHeight);

      // Label text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '13px sans-serif';
      ctx.fillText(spec.label, x + boxWidth / 2, statsY + 32);

      // Inner stats value
      ctx.fillStyle = spec.color;
      ctx.font = 'bold 24px "Inter", "Microsoft YaHei", sans-serif';
      ctx.fillText(spec.value, x + boxWidth / 2, statsY + 70);
    });

    // 9. Unlocked Quote card box
    ctx.fillStyle = 'rgba(251, 191, 36, 0.06)';
    ctx.fillRect(80, 480, canvas.width - 160, 160);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 480, canvas.width - 160, 160);

    ctx.fillStyle = '#fef3c7'; // amber-100
    ctx.font = 'bold italic 18px "Inter", "Microsoft YaHei", sans-serif';
    
    // Auto wrap text function
    const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const chars = text.split('');
      let currentLine = '';
      for (let n = 0; n < chars.length; n++) {
        const testLine = currentLine + chars[n];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(currentLine, x, y);
          currentLine = chars[n];
          y += lineHeight;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, x, y);
    };

    drawWrappedText(info.quote, canvas.width / 2, 530, canvas.width - 200, 26);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '13px sans-serif';
    drawWrappedText(`🎖️ ${info.achievementDesc}`, canvas.width / 2, 605, canvas.width - 200, 20);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(80, 675);
    ctx.lineTo(canvas.width - 80, 675);
    ctx.stroke();

    // 10. Draw QR Code and Scan guidance message
    const qrX = 110;
    const qrY = 710;
    const qrSize = 130;

    if (qrImageRef.current) {
      // Draw white background block for QR code
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
      ctx.drawImage(qrImageRef.current, qrX, qrY, qrSize, qrSize);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#0f172a';
      ctx.font = '13px sans-serif';
      ctx.fillText('二维码载入中', qrX + qrSize / 2, qrY + qrSize / 2 + 5);
    }

    // Text instructions
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Inter", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('真假鹅腿大挑战', qrX + qrSize + 25, qrY + 45);

    ctx.fillStyle = '#94a3b8'; // Slate 400
    ctx.font = '13px "Inter", "Microsoft YaHei", sans-serif';
    ctx.fillText('扫描以上二维码一同护法烤腿', qrX + qrSize + 25, qrY + 80);
    ctx.fillText('戳亮眼力，为阿姨名誉保驾护航！', qrX + qrSize + 25, qrY + 110);

    return canvas;
  };

  const copyScreenshotToClipboard = async () => {
    try {
      setSharingStatus('正在生成战绩海报...');
      const canvas = await drawSharePoster();
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Canvas conversion failed');
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          setCopiedImage(true);
          setSharingStatus('战绩图片已成功复制到剪贴板！');
          sfx.playSuccess();
          setTimeout(() => {
            setCopiedImage(false);
            setSharingStatus(null);
          }, 3000);
        } catch (clipErr) {
          console.warn('Direct image clipboard API not allowed: ', clipErr);
          // If direct clipboard fails, offer instant image download as perfect fallback!
          triggerFileDownload(canvas);
          setSharingStatus('由于浏览器限制剪贴板，已为您自动下载战绩海报图片！');
          setTimeout(() => setSharingStatus(null), 4000);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to capture screenshot', err);
      setSharingStatus('海报制作失败，已为您复制分享文字！');
      copyTextToClipboard();
    }
  };

  const savePosterFile = async () => {
    try {
      setSharingStatus('正在烘焙海报并打包...');
      const canvas = await drawSharePoster();
      triggerFileDownload(canvas);
      setSharingStatus('防塌房战绩证书已保存到本地！');
      sfx.playSuccess();
      setTimeout(() => setSharingStatus(null), 3000);
    } catch(err) {
      setSharingStatus('海报保存失败');
      setTimeout(() => setSharingStatus(null), 2000);
    }
  };

  const triggerFileDownload = (canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `真假鹅腿防塌房证书_${score}分.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Text fallback sharing
  const shareText = `【真假鹅腿大挑战】我帮鹅腿阿姨辨别了 ${correctAnswers} 只大腿，只塌房了 ${collapsedCount} 次！获得了「${info.rank}」守护荣誉！阿姨直呼：“${info.quote.slice(1, -1)}” 快来一秒识别防塌房开烤！😂🍗 👉 ${window.location.href}`;

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      sfx.playSuccess();
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.warn('Failed to copy text: ', err);
    });
  };

  return (
    <div className="w-full bg-slate-900/5 px-2 py-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl overflow-hidden shadow-xl max-w-lg mx-auto border border-slate-100"
      >
        {/* Certificate Style Banner Header */}
        <div className={`p-8 bg-gradient-to-br ${info.color} text-white relative overflow-hidden`}>
          {/* Sparkles backdrop */}
          <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 opacity-10 blur-sm pointer-events-none">
            <Award size={200} />
          </div>

          <div className="relative text-center">
            {/* Stars rendering */}
            <div className="flex gap-1 justify-center mb-2">
              {Array.from({ length: info.starCount }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  className="text-yellow-300 fill-yellow-300"
                >
                  <Sparkles size={20} fill="currentColor" />
                </motion.div>
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-widest text-orange-200 font-bold mb-1">
              阿姨的店招荣誉评估证书
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
              {info.rank}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistics Circles */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">最终得分</span>
              <strong className="text-2xl font-black text-slate-800 font-mono block">
                {score}
              </strong>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-emerald-600 block mb-1">识腿成功</span>
              <strong className="text-2xl font-black text-emerald-700 font-mono block">
                {correctAnswers} 腿
              </strong>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-rose-500 block mb-1">塌房次数</span>
              <strong className="text-2xl font-black text-rose-600 font-mono block">
                {collapsedCount} 次
              </strong>
            </div>
          </div>

          {/* Locked/Unlocked Auntie Quote Card */}
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-3 left-3 bg-amber-700 text-white font-bold text-[9px] px-2 py-0.5 rounded-full tracking-wider">
              阿姨独家真诚回应台词 (已解锁)
            </div>

            <div className="text-center pt-5 pb-1 px-2">
              <p className="text-base font-bold text-amber-900 leading-relaxed italic">
                {info.quote}
              </p>
              <p className="text-xs text-slate-500 mt-4 font-sans font-medium">
                🎖️ {info.achievementDesc}
              </p>
            </div>
          </div>

          {/* QR Code Scan and Save Card Layout */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="bg-white p-1 rounded-xl shadow-inner border border-slate-200 shrink-0">
              <img 
                src={qrImageUrl} 
                alt="扫码加入挑战" 
                className="w-16 h-16 block"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold text-slate-800">扫码或长按识别加入挑战</h4>
              <p className="text-[10px] text-slate-500 leading-normal">
                分享此专属二维码，和更多大学校友一起戳亮眼力，为阿姨名誉防塌房保驾护航！
              </p>
            </div>
          </div>

          {/* Copy Share Area */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Share2 size={14} className="text-indigo-500" />
              <span>制作并分享你的防塌房战绩</span>
            </div>

            {sharingStatus && (
              <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 animate-pulse text-center">
                {sharingStatus}
              </div>
            )}

            {/* Sharing buttons grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyScreenshotToClipboard}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all w-full ${
                  copiedImage 
                    ? 'bg-emerald-600 text-white shadow shadow-emerald-600/10'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                }`}
              >
                {copiedImage ? <Check size={13} /> : <Share2 size={13} />}
                <span>{copiedImage ? '截图已复制！' : '复制战绩卡截图'}</span>
              </button>

              <button
                onClick={savePosterFile}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 border border-slate-700 text-slate-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all w-full active:scale-[0.98]"
              >
                <Award size={13} className="text-yellow-400" />
                <span>保存战绩证书</span>
              </button>
            </div>

            {/* Flat share text backup */}
            <div className="border-t border-slate-200/80 pt-3">
              <p className="text-[10px] text-slate-500 mb-1.5">或复制分享文本给群友：</p>
              <p className="text-[10px] text-slate-400 bg-white border border-slate-100 rounded-lg p-2 truncate leading-relaxed font-mono">
                {shareText}
              </p>
              <button
                onClick={copyTextToClipboard}
                className="w-full mt-2 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                <span>{copied ? '纯文本复制成功！' : '复制分享文案 (纯文本版)'}</span>
              </button>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onRestart}
              className="w-full border-2 border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all text-slate-800 font-bold py-3.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-sans"
            >
              <RotateCcw size={16} />
              <span>重新挑战</span>
            </button>

            <button
              onClick={onGoHome}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs font-sans"
            >
              <Home size={16} />
              <span>回首页</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
