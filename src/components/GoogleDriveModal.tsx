import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HardDrive,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  Image as ImageIcon,
  ExternalLink,
  Plus,
  Lock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  fetchDriveFiles,
  uploadFileToDrive,
  exportEventBackupToDrive,
  exportRSVPToDriveCSV,
  deleteDriveFile,
  DriveFile
} from '../lib/googleDriveService';
import { Language, WeddingEvent } from '../types';
import { ThemeMode } from './ThemeToggle';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: WeddingEvent;
  language: Language;
  theme: ThemeMode;
  onSelectDrivePhoto?: (photoUrl: string) => void;
}

export default function GoogleDriveModal({
  isOpen,
  onClose,
  event,
  language,
  theme,
  onSelectDrivePhoto,
}: GoogleDriveModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  const handleSignInGoogleDrive = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive');
      provider.addScope('https://www.googleapis.com/auth/drive.file');

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
        setStatusMessage(
          language === 'kh'
            ? 'បានភ្ជាប់ Google Drive ដោយជោគជ័យ!'
            : 'Google Drive connected successfully!'
        );
        await loadFiles(credential.accessToken);
      } else {
        throw new Error('Could not obtain access token from Google sign in');
      }
    } catch (err: any) {
      console.error('Google Drive Sign-in error:', err);
      setStatusMessage(err.message || 'Failed to authenticate with Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (token = accessToken) => {
    if (!token) return;
    setLoading(true);
    try {
      const driveFiles = await fetchDriveFiles(token, searchQuery ? `name contains '${searchQuery}'` : undefined);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setStatusMessage(err.message || 'Error listing Google Drive files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      loadFiles();
    }
  }, [isOpen]);

  const handleBackupEvent = async () => {
    if (!accessToken) return;
    setIsUploading(true);
    setStatusMessage(null);
    try {
      const created = await exportEventBackupToDrive(accessToken, event);
      setStatusMessage(
        language === 'kh'
          ? `បានរក្សាទុកទិន្នន័យពិធីលើ Google Drive រួចរាល់! (${created.name})`
          : `Event data backed up to Google Drive! (${created.name})`
      );
      await loadFiles();
    } catch (err: any) {
      setStatusMessage(err.message || 'Backup failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportRSVPs = async () => {
    if (!accessToken) return;
    setIsUploading(true);
    setStatusMessage(null);
    try {
      const rsvps = JSON.parse(localStorage.getItem(`wedding_wishes_${event.id}`) || '[]');
      const created = await exportRSVPToDriveCSV(accessToken, event.name || 'Wedding', rsvps);
      setStatusMessage(
        language === 'kh'
          ? `បានទាញយកបញ្ជីភ្ញៀវ RSVP ជា CSV លើ Google Drive រួចរាល់! (${created.name})`
          : `RSVP guest list exported to Google Drive CSV! (${created.name})`
      );
      await loadFiles();
    } catch (err: any) {
      setStatusMessage(err.message || 'RSVP export failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    setIsUploading(true);
    setStatusMessage(null);
    try {
      const uploaded = await uploadFileToDrive(accessToken, file, file.name, file.type);
      setStatusMessage(
        language === 'kh'
          ? `បានបង្ហោះរូបភាព/ឯកសារទៅ Google Drive ដោយជោគជ័យ! (${uploaded.name})`
          : `Uploaded file to Google Drive successfully! (${uploaded.name})`
      );
      await loadFiles();
    } catch (err: any) {
      setStatusMessage(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (file: DriveFile) => {
    if (!accessToken) return;
    try {
      const deleted = await deleteDriveFile(accessToken, file.id, file.name);
      if (deleted) {
        setStatusMessage(
          language === 'kh'
            ? `បានលុបឯកសារ "${file.name}" ចេញពី Google Drive រួចរាល់!`
            : `File "${file.name}" deleted from Google Drive!`
        );
        await loadFiles();
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Delete failed');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          onClick={e => e.stopPropagation()}
          className={`relative w-full max-w-2xl ${
            theme === 'light'
              ? 'bg-white text-neutral-900 border-neutral-300 shadow-amber-900/10'
              : 'bg-neutral-900 text-white border-amber-500/30'
          } border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-950 flex items-center justify-center shadow-md">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-moul text-amber-400">
                  {language === 'kh' ? 'គ្រប់គ្រង Google Drive' : 'Google Drive Integration'}
                </h3>
                <p className="text-xs text-neutral-400 font-khmer">
                  {language === 'kh'
                    ? 'រក្សាទុក រក្សាទុកបម្រុង និងទាញយករូបភាព/ឯកសារផ្ទាល់ពី Google Drive'
                    : 'Sync, backup event JSON data & import gallery photos from Google Drive'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Message Notification */}
          {statusMessage && (
            <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-khmer flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!accessToken ? (
            /* Auth Login Gate */
            <div className="py-10 text-center flex flex-col items-center justify-center my-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h4 className="text-base font-bold font-moul text-amber-300">
                  {language === 'kh' ? 'ភ្ជាប់ទៅកាន់ Google Drive' : 'Connect Your Google Drive'}
                </h4>
                <p className="text-xs text-neutral-400 font-khmer leading-relaxed">
                  {language === 'kh'
                    ? 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីអនុញ្ញាតឱ្យកម្មវិធីនេះរក្សាទុកទិន្នន័យធៀបអាពាហ៍ពិពាហ៍ និងទាញយករូបភាពចេញពី Google Drive របស់អ្នកដោយសុវត្ថិភាព។'
                    : 'Authenticate with your Google account to backup event details, export RSVP lists, and select pre-wedding album photos directly from Drive.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignInGoogleDrive}
                disabled={loading}
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-bold font-khmer text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>{language === 'kh' ? 'ចូល Google ផ្ទៀងផ្ទាត់សិទ្ធិ' : 'Sign In with Google'}</span>
              </button>
            </div>
          ) : (
            /* Connected Google Drive Workspace */
            <div className="space-y-5 flex-1 overflow-hidden flex flex-col">
              {/* Account Bar & Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-amber-200">{currentUser?.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBackupEvent}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-khmer text-xs flex items-center gap-1.5 border border-amber-400/30 transition-all disabled:opacity-50"
                  >
                    <FileJson className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'kh' ? 'រក្សាទុកបម្រុង' : 'Backup Event'}</span>
                  </button>

                  <button
                    onClick={handleExportRSVPs}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-khmer text-xs flex items-center gap-1.5 border border-emerald-400/30 transition-all disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'kh' ? 'ទាញយក CSV (RSVP)' : 'Export CSV'}</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold font-khmer text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-300 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'kh' ? 'បង្ហោះឯកសារ' : 'Upload File'}</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Search & Refresh */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && loadFiles()}
                    placeholder={language === 'kh' ? 'ស្វែងរកឯកសារក្នុង Google Drive...' : 'Search Google Drive files...'}
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border ${
                      theme === 'light'
                        ? 'bg-neutral-100 border-neutral-300 text-neutral-900'
                        : 'bg-black/50 border-amber-500/30 text-white'
                    } focus:outline-none focus:border-amber-400`}
                  />
                </div>
                <button
                  onClick={() => loadFiles()}
                  disabled={loading}
                  className="p-2 rounded-xl border border-amber-400/30 bg-white/5 hover:bg-white/10 text-amber-300"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Files Grid / List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px] max-h-[360px]">
                {loading && files.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-xs font-khmer flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                    <span>{language === 'kh' ? 'កំពុងទាញយកទិន្នន័យពី Google Drive...' : 'Fetching Google Drive files...'}</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-xs font-khmer space-y-1">
                    <p>{language === 'kh' ? 'មិនទាន់មានឯកសារក្នុង Google Drive នៅឡើយទេ' : 'No files found in Google Drive.'}</p>
                    <p className="text-[11px] text-neutral-500">
                      {language === 'kh' ? 'ចុចប៊ូតុងខាងលើដើម្បីរក្សាទុកបម្រុង ឬបង្ហោះរូបភាពដំបូងរបស់អ្នក' : 'Use the buttons above to backup event data or upload files.'}
                    </p>
                  </div>
                ) : (
                  files.map(file => {
                    const isImage = file.mimeType.startsWith('image/');
                    const isJson = file.mimeType.includes('json');
                    const isCsv = file.mimeType.includes('csv') || file.mimeType.includes('spreadsheet');

                    return (
                      <div
                        key={file.id}
                        className={`p-3 rounded-xl border ${
                          theme === 'light'
                            ? 'bg-neutral-50 border-neutral-200 hover:border-amber-400'
                            : 'bg-white/5 border-white/10 hover:border-amber-400/50'
                        } flex items-center justify-between gap-3 transition-colors`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                            {isImage ? (
                              file.thumbnailLink ? (
                                <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-amber-400" />
                              )
                            ) : isJson ? (
                              <FileJson className="w-4 h-4 text-amber-400" />
                            ) : isCsv ? (
                              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <HardDrive className="w-4 h-4 text-amber-300" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate text-amber-200">{file.name}</p>
                            <p className="text-[10px] text-neutral-400 truncate">
                              {file.mimeType.split('/').pop()} • {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isImage && onSelectDrivePhoto && (
                            <button
                              onClick={() => {
                                if (file.webContentLink || file.thumbnailLink) {
                                  onSelectDrivePhoto(file.webContentLink || file.thumbnailLink || '');
                                  onClose();
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[11px] font-khmer border border-amber-400/30"
                              title="ជ្រើសរើសរូបនេះសម្រាប់ Album/Gallery"
                            >
                              {language === 'kh' ? 'ជ្រើសរើស' : 'Select'}
                            </button>
                          )}

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
                              title="មើលលើ Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                            title="លុបឯកសារចេញពី Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
