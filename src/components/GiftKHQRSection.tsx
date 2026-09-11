import { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Copy, Check, Download, HeartHandshake } from 'lucide-react';
import { Language, BankInfo } from '../types';

interface GiftKHQRSectionProps {
  qrCodeUrl?: string;
  qrCodeRielUrl?: string;
  bankInfo?: BankInfo;
  groom?: string;
  bride?: string;
  language: Language;
  primaryColor?: string;
  textColor?: string;
}

export default function GiftKHQRSection({
  qrCodeUrl,
  qrCodeRielUrl,
  bankInfo,
  groom = 'រ៉ូ ម៉ាឡេ',
  bride = 'អួម វល្ខ័ក',
  language,
  primaryColor = '#f5b80f',
  textColor = '#f5b80f',
}: GiftKHQRSectionProps) {
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');
  const [copied, setCopied] = useState(false);

  // Fallback to sample generated clean high-resolution QR if template uses blur or empty
  const cleanUsdFallback =
    'https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=https%3A%2F%2Fapp.bakong.nbc.gov.kh%2Fpay%3Fcurrency%3DUSD%26account%3D002458912%26name%3DROMALAY_AND_OUMVOLAK';
  const cleanKhrFallback =
    'https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=https%3A%2F%2Fapp.bakong.nbc.gov.kh%2Fpay%3Fcurrency%3DKHR%26account%3D002458912%26name%3DROMALAY_AND_OUMVOLAK';

  const rawUsdQr = bankInfo?.usdQr || qrCodeUrl;
  const rawKhrQr = bankInfo?.khrQr || qrCodeRielUrl;

  const usdQr =
    rawUsdQr && !rawUsdQr.includes('qr-blur') ? rawUsdQr : cleanUsdFallback;
  const khrQr =
    rawKhrQr && !rawKhrQr.includes('qr-blur') ? rawKhrQr : cleanKhrFallback;

  const currentQr = currency === 'USD' ? usdQr : khrQr;

  const accountName = bankInfo?.accountName || `${groom} & ${bride}`;
  const accountNumber = bankInfo?.accountNumber || '002 458 912 (ABA Bank)';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${accountName} - ${accountNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentQr;
    link.download = `KHQR_Wedding_Gift_${currency}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="khqr-section" className="py-8 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs font-khmer mb-2">
          <HeartHandshake className="w-3.5 h-3.5" style={{ color: primaryColor }} />
          <span style={{ color: primaryColor }}>{language === 'kh' ? 'ចំណងដៃអាពាហ៍ពិពាហ៍' : 'Wedding Gift'}</span>
        </div>

        <h2
          style={{ color: primaryColor }}
          className="text-xl font-moul mb-2"
        >
          {language === 'kh' ? 'ចងដៃតាមរយៈ KHQR' : 'GIFT VIA KHQR'}
        </h2>

        <p
          style={{ color: textColor }}
          className="text-xs font-khmer max-w-xs mx-auto mb-6 opacity-85"
        >
          {language === 'kh'
            ? 'លោកអ្នកអាចចូលរួមចងដៃគូស្វាមីភរិយាថ្មី តាមរយៈប្រព័ន្ធ KHQR គ្រប់ធនាគារក្នុងប្រទេសកម្ពុជា'
            : 'You may send your wedding blessings & gift conveniently via Bakong KHQR with any Cambodian bank'}
        </p>

        {/* Currency Switcher Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-black/60 border border-amber-500/30 mb-6">
          <button
            onClick={() => setCurrency('USD')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              currency === 'USD'
                ? 'bg-amber-400 text-amber-950 shadow-md'
                : 'text-amber-200/70 hover:text-amber-100'
            }`}
          >
            USD ($)
          </button>
          <button
            onClick={() => setCurrency('KHR')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              currency === 'KHR'
                ? 'bg-amber-400 text-amber-950 shadow-md'
                : 'text-amber-200/70 hover:text-amber-100'
            }`}
          >
            KHR (៛ ខ្មែរ)
          </button>
        </div>

        {/* QR Code Presentation Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-black/70 to-black/80 border-2 border-amber-500/50 shadow-2xl max-w-sm sm:max-w-md mx-auto transition-all">
          {/* KHQR Header Banner */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-amber-500/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block animate-pulse shadow-sm" />
              <span className="text-sm font-black tracking-widest text-red-400 font-mono">KHQR</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
              {currency}
            </span>
          </div>

          {/* QR Image Container (Larger width & height) */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl shadow-2xl mx-auto mb-5 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center border-2 border-amber-300/70 relative overflow-hidden">
            <img
              src={currentQr}
              alt={`KHQR ${currency}`}
              className="w-full h-full object-contain filter contrast-[1.08] brightness-[0.98] select-none rounded-xl"
              style={{
                imageRendering: 'crisp-edges',
              }}
              loading="eager"
              decoding="sync"
            />
          </div>

          <div className="text-center mb-5">
            <h4 className="text-base sm:text-lg font-bold font-moul text-amber-200 tracking-wide">
              {accountName}
            </h4>
            <p className="text-xs sm:text-sm text-amber-300 font-mono mt-1.5 font-semibold tracking-wider">
              {accountNumber}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-amber-500/30">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold font-khmer bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">{language === 'kh' ? 'បានចម្លង' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>{language === 'kh' ? 'ចម្លងលេខកុង' : 'Copy Acc'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-khmer bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-amber-950 flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-950" />
              <span>{language === 'kh' ? 'ទាញយក QR' : 'Save QR'}</span>
            </button>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center mt-6">
          <img
            src="https://focuz-staging-space.sgp1.digitaloceanspaces.com/plan-essential/template/free/template-1/underline-kbach-2.png"
            alt=""
            className="w-36 opacity-70"
          />
        </div>
      </motion.div>
    </section>
  );
}
