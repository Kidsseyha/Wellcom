import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Send,
  Sparkles,
  User,
  MailOpen,
  Link2,
  ExternalLink,
  ChevronDown,
  Users,
  Edit3,
  Trash2,
  Plus,
  RotateCcw,
  RefreshCw,
  Cloud,
  Upload,
  HardDrive,
} from 'lucide-react';
import { Language } from '../types';
import * as XLSX from 'xlsx';
import { getPublicShareUrl, shortenUrl } from '../lib/shareUrl';
import {
  getSavedGuests,
  DEFAULT_GUEST_PRESETS,
  GuestPreset,
} from '../data/guests';
import {
  subscribeToGuests,
  fetchGuestsFromFirebase,
  saveGuestToFirebase,
  deleteGuestFromFirebase,
  seedDefaultGuestsToFirebase,
  clearAllGuestsFromFirebase,
} from '../lib/firebaseGuests';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuestName: string;
  onSaveGuestName: (name: string) => void;
  onOpenEnvelopeWithName: (name: string) => void;
  language: Language;
  eventId?: string;
  groom?: string;
  bride?: string;
  theme?: 'light' | 'dark';
}

export default function AddGuestModal({
  isOpen,
  onClose,
  currentGuestName,
  onSaveGuestName,
  onOpenEnvelopeWithName,
  language,
  eventId = 'cmgrawhnk0003le0434762j7n',
  groom = 'រ៉ូ ម៉ាឡេ',
  bride = 'លីន វល្ខ័ក',
  theme = 'dark',
}: AddGuestModalProps) {
  const isLight = theme === 'light';
  const [guestInput, setGuestInput] = useState(currentGuestName || '');
  const [copied, setCopied] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [category, setCategory] = useState<'family' | 'vip' | 'friends' | 'colleagues' | 'general'>('general');
  const [note, setNote] = useState('');
  const [savedGuests, setSavedGuests] = useState<GuestPreset[]>(() => getSavedGuests());
  const [isManagingList, setIsManagingList] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editingGuestName, setEditingGuestName] = useState('');
  const [editingGuestCategory, setEditingGuestCategory] = useState<'family' | 'vip' | 'friends' | 'colleagues' | 'general'>('general');
  const [newGuestQuickName, setNewGuestQuickName] = useState('');
  const [newGuestQuickCategory, setNewGuestQuickCategory] = useState<'family' | 'vip' | 'friends' | 'colleagues' | 'general'>('general');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isSyncingWithCloud, setIsSyncingWithCloud] = useState(false);

  // Sync with Firestore in real-time
  useEffect(() => {
    const unsubscribe = subscribeToGuests((guests) => {
      setSavedGuests(guests);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (audio) {
      setIsPlayingMusic(!audio.paused);
      const handlePlay = () => setIsPlayingMusic(true);
      const handlePause = () => setIsPlayingMusic(false);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [isOpen]);

  const triggerAutoPlayMusic = () => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (audio && audio.paused) {
      audio.muted = false;
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {
        // autoplay restriction fallback
      });
    }
  };

  const toggleMusicPlay = () => {
    const audio = document.getElementById('wedding-audio') as HTMLAudioElement | null;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => {
        setIsPlayingMusic(true);
        showFeedback(language === 'kh' ? 'កំពុងចាក់តន្ត្រីមង្គលការ...' : 'Playing wedding music...');
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    } else {
      audio.pause();
      setIsPlayingMusic(false);
      showFeedback(language === 'kh' ? 'បានផ្អាកតន្ត្រី' : 'Paused music');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setGuestInput(currentGuestName || '');
      setPrefix('');
      const match = savedGuests.find(g => g.name.toLowerCase() === (currentGuestName || '').toLowerCase());
      if (match) {
        setCategory(match.category || 'general');
        setNote(match.note || '');
      }
    }
  }, [isOpen, currentGuestName, savedGuests]);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const prefixes = [
    'ឯកឧត្តម',
    'លោកជំទាវ',
    'លោក',
    'លោកស្រី',
    'អ្នកនាង',
    'កញ្ញា',
    'លោកពូ',
    'អ្នកមីង',
    'មិត្តភក្តិ',
  ];

  const handleSelectFromDropbox = (selectedGuestName: string) => {
    if (!selectedGuestName) return;

    if (selectedGuestName === '__MANAGE_LIST__') {
      setIsManagingList(true);
      return;
    }
    if (selectedGuestName === '__ADD_NEW_ITEM__') {
      setIsManagingList(true);
      setNewGuestQuickName('');
      return;
    }

    const matched = savedGuests.find(g => g.name === selectedGuestName);
    setGuestInput(selectedGuestName);
    setPrefix('');

    if (matched) {
      setCategory(matched.category);
      setNote(matched.note || '');
    }
    showFeedback(language === 'kh' ? `បានជ្រើសរើស "${selectedGuestName}"` : `Selected "${selectedGuestName}"`);
  };

  const handlePrefixClick = (p: string) => {
    const current = guestInput.trim();
    let baseName = current;

    for (const item of prefixes) {
      if (current.startsWith(item)) {
        baseName = current.slice(item.length).trim();
        break;
      }
    }

    if (prefix === p) {
      setPrefix('');
      setGuestInput(baseName);
    } else {
      setPrefix(p);
      setGuestInput(baseName ? `${p} ${baseName}` : `${p} `);
    }
  };

  const getFullName = () => {
    const trimmed = guestInput.trim();
    return trimmed || currentGuestName || 'ភ្ញៀវកិត្តិយស';
  };

  const fullName = getFullName();

  const getCategoryLabel = (cat: 'vip' | 'friends' | 'family' | 'general' | 'colleagues') => {
    switch (cat) {
      case 'vip':
        return { kh: 'ភ្ញៀវ VIP', en: 'VIP Guest' };
      case 'friends':
        return { kh: 'មិត្តភក្តិ', en: 'Friends' };
      case 'family':
        return { kh: 'សាច់ញាតិ', en: 'Relatives' };
      case 'general':
        return { kh: 'ភ្ញៀវទូទៅ', en: 'General Guest' };
      case 'colleagues':
        return { kh: 'មិត្តរួមការងារ', en: 'Colleagues' };
      default:
        return { kh: 'ភ្ញៀវទូទៅ', en: 'General Guest' };
    }
  };

  // Add guest to dropbox list (Syncs to Firebase)
  const handleAddNewGuestToDropbox = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!newGuestQuickName.trim()) return;
    const catLabels = getCategoryLabel(newGuestQuickCategory);
    setIsSyncingWithCloud(true);
    try {
      await saveGuestToFirebase({
        name: newGuestQuickName.trim(),
        category: newGuestQuickCategory,
        categoryLabelKh: catLabels.kh,
        categoryLabelEn: catLabels.en,
      });
      setGuestInput(newGuestQuickName.trim());
      setCategory(newGuestQuickCategory);
      setNewGuestQuickName('');
      showFeedback(language === 'kh' ? 'បានរក្សាទុកភ្ញៀវថ្មីចូល Firebase Database!' : 'Guest saved to Firebase Database!');
    } catch (err) {
      showFeedback(language === 'kh' ? 'បានបន្ថែមភ្ញៀវ' : 'Guest added');
    } finally {
      setIsSyncingWithCloud(false);
    }
  };

  // Save/Update selected guest directly in dropbox list (Syncs to Firebase)
  const handleUpdateCurrentInDropbox = async () => {
    const nameToSave = fullName;
    if (!nameToSave.trim()) return;
    const catLabels = getCategoryLabel(category);
    setIsSyncingWithCloud(true);
    try {
      const existing = savedGuests.find(g => g.name.toLowerCase() === nameToSave.toLowerCase());
      await saveGuestToFirebase({
        id: existing?.id,
        name: nameToSave,
        category,
        categoryLabelKh: catLabels.kh,
        categoryLabelEn: catLabels.en,
        note: note.trim() || undefined,
      });
      showFeedback(language === 'kh' ? 'បានរក្សាទុកឈ្មោះក្នុង Firebase Database!' : 'Saved to Firebase Database!');
    } catch (err) {
      showFeedback(language === 'kh' ? 'បានរក្សាទុកឈ្មោះក្នុង Drop box!' : 'Saved to drop box!');
    } finally {
      setIsSyncingWithCloud(false);
    }
  };

  // Start inline editing a guest from management list
  const handleStartEdit = (g: GuestPreset) => {
    setEditingGuestId(g.id);
    setEditingGuestName(g.name);
    setEditingGuestCategory(g.category);
  };

  // Save inline edit (Syncs to Firebase)
  const handleSaveInlineEdit = async (id: string) => {
    if (!editingGuestName.trim()) return;
    const catLabels = getCategoryLabel(editingGuestCategory);
    setIsSyncingWithCloud(true);
    try {
      await saveGuestToFirebase({
        id,
        name: editingGuestName.trim(),
        category: editingGuestCategory,
        categoryLabelKh: catLabels.kh,
        categoryLabelEn: catLabels.en,
      });
      setEditingGuestId(null);
      showFeedback(language === 'kh' ? 'បានកែប្រែឈ្មោះក្នុង Firebase!' : 'Updated in Firebase!');
    } catch (err) {
      showFeedback(language === 'kh' ? 'បានកែប្រែឈ្មោះភ្ញៀវ' : 'Guest updated');
    } finally {
      setIsSyncingWithCloud(false);
    }
  };

  // Delete guest from list (Syncs to Firebase)
  const handleDeleteGuest = async (id: string, name: string) => {
    setIsSyncingWithCloud(true);
    try {
      await deleteGuestFromFirebase(id);
      showFeedback(language === 'kh' ? `បានលុប "${name}" ពី Firebase` : `Deleted "${name}" from Firebase`);
    } catch (err) {
      showFeedback(language === 'kh' ? `បានលុប "${name}"` : `Deleted "${name}"`);
    } finally {
      setIsSyncingWithCloud(false);
    }
  };

  // Delete all guests
  const handleClearAllGuests = async () => {
    setIsSyncingWithCloud(true);
    try {
      const guestIds = savedGuests.map(g => g.id);
      setSavedGuests([]);
      await clearAllGuestsFromFirebase(guestIds);
      showFeedback(language === 'kh' ? 'បានលុបបញ្ជីភ្ញៀវទាំងអស់ជោគជ័យ' : 'All guests deleted successfully');
    } catch (err) {
      showFeedback(language === 'kh' ? 'មានបញ្ហាក្នុងការលុប' : 'Error deleting guests');
    } finally {
      setIsSyncingWithCloud(false);
    }
  };
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncingWithCloud(true);
    try {
      let importedGuests: Array<{
        name: string;
        category: string;
        categoryLabelKh: string;
        categoryLabelEn: string;
      }> = [];

      const parseCategory = (catStr: string) => {
        const lower = (catStr || '').toLowerCase().trim();
        if (lower.includes('vip') || lower.includes('វីអាយភី')) {
          return { category: 'vip', categoryLabelKh: 'ភ្ញៀវ VIP', categoryLabelEn: 'VIP' };
        }
        if (lower.includes('friend') || lower.includes('មិត្តភក្តិ') || lower.includes('មិត្ត')) {
          return { category: 'friends', categoryLabelKh: 'មិត្តភក្តិ', categoryLabelEn: 'Friends' };
        }
        if (lower.includes('family') || lower.includes('សាច់ញាតិ') || lower.includes('សាច់ញាត្តិ') || lower.includes('ញាតិ') || lower.includes('គ្រួសារ')) {
          return { category: 'family', categoryLabelKh: 'សាច់ញាតិ', categoryLabelEn: 'Relatives' };
        }
        if (lower.includes('colleague') || lower.includes('ការិយាល័យ') || lower.includes('បុគ្គលិក') || lower.includes('ការងារ') || lower.includes('រួមការងារ')) {
          return { category: 'colleagues', categoryLabelKh: 'មិត្តរួមការងារ', categoryLabelEn: 'Colleagues' };
        }
        return { category: 'general', categoryLabelKh: 'ភ្ញៀវទូទៅ', categoryLabelEn: 'General' };
      };

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        
        // Start from i = 1 to skip row number 1 (header row)
        for (let i = 1; i < jsonRows.length; i++) {
          const row = jsonRows[i];
          if (!Array.isArray(row)) continue;
          
          const colB = String(row[1] || '').trim(); // Guest Name
          const colC = String(row[2] || '').trim(); // Category
          
          const isHeader = (val: string) => {
            const v = val.toLowerCase();
            return ['name', 'guest', 'ឈ្មោះភ្ញៀវ', 'khmer', 'phone', 'tel', 'status', 'no', 'លរ', 'ល.រ', 'category', 'ប្រភេទ'].includes(v);
          };

          if (colB && !isHeader(colB)) {
            const catInfo = parseCategory(colC);
            importedGuests.push({
              name: colB,
              ...catInfo,
            });
          } else if (!colB && colC && !isHeader(colC)) {
            // If col B is empty but col C has text, check if col C is name
            const catInfo = parseCategory('');
            importedGuests.push({
              name: colC,
              ...catInfo,
            });
          } else if (!colB && !colC) {
            // Fallback scan other cells in row
            for (const cell of row) {
              const clean = String(cell || '').trim();
              if (clean && clean.length > 0 && !isHeader(clean)) {
                importedGuests.push({
                  name: clean,
                  category: 'general',
                  categoryLabelKh: 'ភ្ញៀវទូទៅ',
                  categoryLabelEn: 'General',
                });
                break;
              }
            }
          }
        }
      } else {
        const text = await file.text();
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            // Skip first element if it looks like header or just take all
            const dataItems = json.slice(1); // skip row 1 equivalent
            for (const item of dataItems.length > 0 ? dataItems : json) {
              const name = typeof item === 'string' ? item : (item.name || item.guestName);
              const catStr = typeof item === 'object' ? (item.category || item.type || '') : '';
              if (name && !['name', 'guest', 'ឈ្មោះភ្ញៀវ'].includes(String(name).toLowerCase())) {
                const catInfo = parseCategory(catStr);
                importedGuests.push({ name, ...catInfo });
              }
            }
          }
        } else {
          // Plain text / CSV line-by-line (Format: Name, Category or just Name)
          const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('#'));
          // Skip first line (row 1 header)
          const dataLines = lines.slice(1);
          for (const line of dataLines.length > 0 ? dataLines : lines) {
            const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
            const name = parts[0];
            const catStr = parts[1] || '';
            const isHeader = (val: string) => ['name', 'guest', 'ឈ្មោះភ្ញៀវ', 'khmer', 'no', 'លរ', 'ល.រ'].includes(val.toLowerCase());
            
            if (name && !isHeader(name)) {
              const catInfo = parseCategory(catStr);
              importedGuests.push({ name, ...catInfo });
            }
          }
        }
      }

      if (importedGuests.length === 0) {
        showFeedback(language === 'kh' ? 'រកមិនឃើញឈ្មោះភ្ញៀវក្នុងឯកសារនេះទេ' : 'No guest names found in file');
        setIsSyncingWithCloud(false);
        return;
      }

      let count = 0;
      for (const guest of importedGuests) {
        await saveGuestToFirebase({
          name: guest.name,
          category: guest.category as any,
          categoryLabelKh: guest.categoryLabelKh,
          categoryLabelEn: guest.categoryLabelEn,
        });
        count++;
      }

      showFeedback(
        language === 'kh'
          ? `បានបញ្ចូលភ្ញៀវ ${count} នាក់ (រួមទាំងប្រភេទ) ពីឯកសារជោគជ័យ!`
          : `Successfully imported ${count} guests with categories from file!`
      );
    } catch (err) {
      console.error(err);
      showFeedback(language === 'kh' ? 'មានបញ្ហាក្នុងការអានឯកសារ' : 'Error reading file');
    } finally {
      setIsSyncingWithCloud(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Handle importing from Google Drive / Google Sheets link or file ID
  const handleGoogleSheetsImport = async () => {
    const urlPrompt = prompt(
      language === 'kh'
        ? 'សូមបញ្ចូលតំណភ្ជាប់ ឬ File ID របស់ Google Drive / Google Sheets (ឧទាហរណ៍: https://docs.google.com/spreadsheets/d/... ឬ File ID):\n(ចំណាំ: ឯកសារត្រូវតែកំណត់ជា Anyone with the link can view)'
        : 'Enter Google Drive / Google Sheets sharing link or File ID:\n(Note: File must be shared as "Anyone with the link can view")',
      ''
    );
    if (!urlPrompt) return;

    setIsSyncingWithCloud(true);
    try {
      let fetchUrl = urlPrompt.trim();
      
      // If user provided a pure Google Drive File ID (alphanumeric string without spaces/slashes)
      if (/^[a-zA-Z0-9-_]{25,}$/.test(fetchUrl)) {
        fetchUrl = `https://docs.google.com/spreadsheets/d/${fetchUrl}/export?format=csv`;
      } else if (fetchUrl.includes('drive.google.com')) {
        // Extract file id from drive sharing link e.g. /file/d/ID/view or /open?id=ID
        const matchDrive = fetchUrl.match(/(?:\/d\/|id=)([a-zA-Z0-9-_]+)/);
        if (matchDrive && matchDrive[1]) {
          fetchUrl = `https://docs.google.com/spreadsheets/d/${matchDrive[1]}/export?format=csv`;
        }
      } else if (fetchUrl.includes('/spreadsheets/d/')) {
        const matchKey = fetchUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (matchKey && matchKey[1]) {
          const sheetId = matchKey[1];
          const gidMatch = fetchUrl.match(/[#&]gid=([0-9]+)/);
          const gid = gidMatch ? gidMatch[1] : '0';
          fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        }
      }

      // Try fetching directly or via CORS proxy if direct fails
      let csvText = '';
      try {
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error('Direct fetch failed');
        csvText = await res.text();
      } catch (err) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fetchUrl)}`;
        const resProxy = await fetch(proxyUrl);
        if (!resProxy.ok) throw new Error('Proxy fetch failed');
        csvText = await resProxy.text();
      }

      if (!csvText || csvText.includes('<!DOCTYPE html>') || csvText.includes('<html')) {
        throw new Error('Invalid CSV response (Ensure Google Drive file is shared publicly)');
      }

      const rows = csvText.split(/\r?\n/);
      let importedNames: string[] = [];

      for (const row of rows) {
        if (!row.trim()) continue;
        const cells: string[] = [];
        let inQuotes = false;
        let currentCell = '';
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            cells.push(currentCell.trim().replace(/^["']|["']$/g, ''));
            currentCell = '';
          } else {
            currentCell += char;
          }
        }
        cells.push(currentCell.trim().replace(/^["']|["']$/g, ''));

        for (const cell of cells) {
          const clean = cell.trim();
          if (
            clean &&
            clean.length > 1 &&
            isNaN(Number(clean)) &&
            !['name', 'guest', 'ឈ្មោះភ្ញៀវ', 'khmer', 'phone', 'tel', 'status'].includes(clean.toLowerCase())
          ) {
            importedNames.push(clean);
            break;
          }
        }
      }

      if (importedNames.length === 0) {
        showFeedback(language === 'kh' ? 'រកមិនឃើញឈ្មោះភ្ញៀវក្នុង Google Drive ឯកសារនេះទេ' : 'No guest names found in Google Drive file');
        setIsSyncingWithCloud(false);
        return;
      }

      let count = 0;
      for (const name of importedNames) {
        await saveGuestToFirebase({
          name,
          category: 'general',
          categoryLabelKh: 'ភ្ញៀវទូទៅ',
          categoryLabelEn: 'General',
        });
        count++;
      }

      showFeedback(
        language === 'kh'
          ? `បានទាញយកភ្ញៀវ ${count} នាក់ពី Google Drive ជោគជ័យ!`
          : `Successfully imported ${count} guests from Google Drive!`
      );
    } catch (err) {
      console.error(err);
      showFeedback(
        language === 'kh'
          ? 'មិនអាចទាញយកពី Google Drive បានទេ (សូមពិនិត្យមើលសិទ្ធិ Sharing ជា "Anyone with the link can view")'
          : 'Failed to import from Google Drive (Ensure file is shared: Anyone with the link can view)'
      );
    } finally {
      setIsSyncingWithCloud(false);
    }
  };

  // Restore default preset guests in Firebase
  const handleResetList = async () => {
    setIsSyncingWithCloud(true);
    try {
      await seedDefaultGuestsToFirebase();
      showFeedback(language === 'kh' ? 'បានស្ដារបញ្ជីដើមឡើងវិញដោយជោគជ័យ' : 'Restored default guests successfully');
    } catch (err) {
      showFeedback(language === 'kh' ? 'មានបញ្ហាក្នុងការស្ដារបញ្ជីដើម' : 'Error restoring default guests');
    } finally {
      setIsSyncingWithCloud(false);
    }
  };

  const guestLink = getPublicShareUrl(fullName, eventId);

  const handleSaveAndApply = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const finalName = fullName;
    onSaveGuestName(finalName);

    // Save to Firebase asynchronously
    const catLabels = getCategoryLabel(category);
    saveGuestToFirebase({
      name: finalName,
      category,
      categoryLabelKh: catLabels.kh,
      categoryLabelEn: catLabels.en,
      note: note.trim() || undefined,
    }).catch(() => {
      // offline fallback handled by cache
    });

    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('name', finalName);
      if (eventId) url.searchParams.set('id', eventId);
      window.history.replaceState({}, '', url.toString());
    }
    onClose();
  };

  const handlePreviewEnvelope = () => {
    const finalName = fullName;
    onSaveGuestName(finalName);
    
    // Save to Firebase
    const catLabels = getCategoryLabel(category);
    saveGuestToFirebase({
      name: finalName,
      category,
      categoryLabelKh: catLabels.kh,
      categoryLabelEn: catLabels.en,
      note: note.trim() || undefined,
    }).catch(() => {
      // offline fallback
    });

    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('name', finalName);
      if (eventId) url.searchParams.set('id', eventId);
      window.history.replaceState({}, '', url.toString());
    }
    onOpenEnvelopeWithName(finalName);
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTelegram = () => {
    const text = `សូមគោរពអញ្ជើញ ${fullName} ចូលរួមពិធីសិរីមង្គលអាពាហ៍ពិពាហ៍ ${groom} & ${bride} | Plan Essential Digital Invitation`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(guestLink)}&text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="add-guest-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className={`relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl ${
              isLight
                ? 'bg-white border-amber-500/40 text-neutral-900 shadow-[0_10px_40px_rgba(245,158,11,0.15)]'
                : 'bg-black border-amber-500/40 text-white shadow-2xl'
            } border rounded-2xl p-5 sm:p-7 md:p-8 text-left max-h-[92vh] overflow-y-auto`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between pb-3 mb-3 border-b ${isLight ? 'border-amber-500/30' : 'border-amber-500/20'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-amber-100 border-amber-400 text-amber-600' : 'bg-amber-400/20 border-amber-400/40 text-amber-300'} border flex items-center justify-center`}>
                  <Users className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className={`text-sm sm:text-base font-moul ${isLight ? 'text-amber-900' : 'text-amber-300'} flex items-center gap-2`}>
                    <span>{language === 'kh' ? 'បញ្ជីឈ្មោះភ្ញៀវកិត្តិយស' : 'Honored Guest List'}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-sans font-normal px-2 py-0.5 rounded-full ${isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'} border`}>
                      <Cloud className="w-2.5 h-2.5" />
                      <span>Firebase Sync</span>
                    </span>
                  </h3>
                  <p className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'} font-khmer`}>
                    {language === 'kh'
                      ? 'ជ្រើសរើស ឬ បញ្ចូលឈ្មោះភ្ញៀវ ដើម្បីបង្ហាញលើលិខិត និងស្រោមសំបុត្រ (រក្សាទុកក្នុង Cloud)'
                      : 'Select or enter guest name to customize envelope & digital card (Synced to Firebase)'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-full ${
                  isLight
                    ? 'text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200'
                    : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
                } transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Toast */}
            {feedbackMsg && (
              <div className={`mb-3 py-1.5 px-3 rounded-lg ${isLight ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-amber-400/20 border-amber-400/40 text-amber-200'} border text-xs font-khmer text-center flex items-center justify-center gap-1.5 animate-fade-in`}>
                <Check className="w-3.5 h-3.5 text-amber-500" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {!isManagingList ? (
              <>
                {/* Prefix suggestions */}
                <div className="mb-3">
                  <label className={`block text-[11px] font-khmer ${isLight ? 'text-amber-900' : 'text-amber-300/80'} mb-1.5 flex items-center gap-1`}>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{language === 'kh' ? 'ជ្រើសរើសងារ / បុព្វបទ (Prefix):' : 'Select Title / Prefix:'}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {prefixes.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePrefixClick(p)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-khmer transition-all border ${
                          prefix === p
                            ? 'bg-amber-400 text-amber-950 font-bold border-amber-400 shadow-sm scale-105'
                            : isLight
                            ? 'bg-amber-50 text-neutral-700 border-amber-300 hover:border-amber-400 hover:bg-amber-100'
                            : 'bg-black/40 text-neutral-300 border-amber-500/20 hover:border-amber-400/50 hover:text-amber-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSaveAndApply} className="space-y-3">
                  {/* Manual / Custom Guest Name Input */}
                  <div>
                    <label className={`block text-[11px] font-khmer ${isLight ? 'text-amber-950' : 'text-amber-300'} font-bold mb-1 flex items-center gap-1.5`}>
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវផ្ទាល់ខ្លួន (Guest Name):' : 'Guest Name:'}</span>
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        id="custom-guest-name-input"
                        type="text"
                        value={guestInput}
                        onChange={e => setGuestInput(e.target.value)}
                        placeholder={language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវ...' : 'Enter guest name...'}
                        className={`flex-1 px-3 py-2 rounded-xl border text-xs font-khmer focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                            : 'bg-black/70 border-amber-500/40 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                        }`}
                      />
                      <button
                        id="add-custom-guest-dropbox-btn"
                        type="button"
                        onClick={handleUpdateCurrentInDropbox}
                        disabled={isSyncingWithCloud || !guestInput.trim()}
                        title={language === 'kh' ? 'រក្សាទុកឈ្មោះនេះចូលក្នុង Firebase Database' : 'Save to Firebase Database'}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 disabled:opacity-50 text-amber-950 font-khmer font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer shrink-0"
                      >
                        {isSyncingWithCloud ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                            <span>{language === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...'}</span>
                          </>
                        ) : (
                          <>
                            <Cloud className="w-3.5 h-3.5 text-amber-950" />
                            <span>{language === 'kh' ? 'រក្សាទុកចូល Drop box' : 'Save to Drop box'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Drop box Names of Guest with Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-[11px] font-khmer ${isLight ? 'text-amber-950' : 'text-amber-300'} font-bold flex items-center gap-1.5`}>
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        <span>{language === 'kh' ? 'ឬ ជ្រើសរើសពីបញ្ជី Drop box (Guest Names):' : 'Or Select from Drop box:'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsManagingList(true)}
                        className={`text-[11px] font-khmer ${isLight ? 'text-amber-700 hover:text-amber-950' : 'text-amber-400 hover:text-amber-300'} underline flex items-center gap-1`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{language === 'kh' ? 'គ្រប់គ្រងបញ្ជី' : 'Manage List'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <select
                        id="guest-dropbox-select"
                        value={savedGuests.some(g => g.name === guestInput.trim()) ? guestInput.trim() : ''}
                        onChange={e => handleSelectFromDropbox(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-khmer focus:outline-none focus:ring-1 focus:ring-amber-400 appearance-none pr-8 cursor-pointer ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 focus:border-amber-500'
                            : 'bg-black/80 border-amber-500/40 text-amber-100 focus:border-amber-400'
                        }`}
                      >
                        <option value="" disabled className="font-khmer">
                          {language === 'kh' ? '-- ចុចទីនេះដើម្បីជ្រើសរើសឈ្មោះភ្ញៀវក្នុង Drop box --' : '-- Select guest from drop box --'}
                        </option>

                        {/* Group by category in user's exact order */}
                        {['vip', 'friends', 'family', 'general', 'colleagues'].map(catKey => {
                          const list = savedGuests.filter(g => g.category === catKey);
                          if (list.length === 0) return null;
                          const catLabel =
                            catKey === 'vip'
                              ? (language === 'kh' ? '👑 ភ្ញៀវ VIP' : '👑 VIP')
                              : catKey === 'friends'
                              ? (language === 'kh' ? '🤝 មិត្តភក្តិ' : '🤝 Friends')
                              : catKey === 'family'
                              ? (language === 'kh' ? '👨‍👩‍👧‍👦 សាច់ញាតិ' : '👨‍👩‍👧‍👦 Relatives')
                              : catKey === 'general'
                              ? (language === 'kh' ? '✨ ភ្ញៀវទូទៅ' : '✨ General')
                              : (language === 'kh' ? '💼 មិត្តរួមការងារ' : '💼 Colleagues');
                          return (
                            <optgroup key={catKey} label={catLabel} className={isLight ? 'bg-amber-100 text-amber-950 font-bold font-khmer' : 'bg-neutral-900 text-amber-300 font-bold font-khmer'}>
                              {list.map(g => (
                                <option key={g.id} value={g.name} className={isLight ? 'bg-white text-neutral-900 py-1 font-normal font-khmer' : 'bg-black text-amber-100 py-1 font-normal font-khmer'}>
                                  {g.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}

                        <optgroup label={language === 'kh' ? '⚙️ កំណត់បញ្ជីឈ្មោះ' : '⚙️ Actions'} className={isLight ? 'bg-amber-200 text-amber-950 font-khmer' : 'bg-neutral-900 text-amber-400 font-khmer'}>
                          <option value="__ADD_NEW_ITEM__" className={isLight ? 'bg-white text-amber-950 font-khmer' : 'bg-black text-amber-300 font-khmer'}>
                            ➕ {language === 'kh' ? 'បន្ថែមឈ្មោះថ្មីចូល Drop box...' : 'Add new guest to drop box...'}
                          </option>
                          <option value="__MANAGE_LIST__" className={isLight ? 'bg-white text-amber-950 font-khmer' : 'bg-black text-amber-300 font-khmer'}>
                            ✏️ {language === 'kh' ? 'កែប្រែ ឬ លុបឈ្មោះក្នុង Drop box...' : 'Edit or delete guest list...'}
                          </option>
                        </optgroup>
                      </select>
                      <ChevronDown className="w-4 h-4 text-amber-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Category & Note Helper row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-[11px] font-khmer ${isLight ? 'text-amber-900' : 'text-amber-300/80'} mb-1`}>
                        {language === 'kh' ? 'ក្រុម / ប្រភេទភ្ញៀវ:' : 'Guest Category:'}
                      </label>
                      <select
                        id="guest-category-select"
                        value={category}
                        onChange={e => setCategory(e.target.value as any)}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-khmer focus:outline-none ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/30 text-amber-200 focus:border-amber-400'
                        }`}
                      >
                        <option value="vip">{language === 'kh' ? 'ភ្ញៀវ VIP' : 'VIP'}</option>
                        <option value="friends">{language === 'kh' ? 'មិត្តភក្តិ' : 'Friends'}</option>
                        <option value="family">{language === 'kh' ? 'សាច់ញាតិ' : 'Relatives'}</option>
                        <option value="general">{language === 'kh' ? 'ភ្ញៀវទូទៅ' : 'General'}</option>
                        <option value="colleagues">{language === 'kh' ? 'មិត្តរួមការងារ' : 'Colleagues'}</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-[11px] font-khmer ${isLight ? 'text-amber-900' : 'text-amber-300/80'} mb-1`}>
                        {language === 'kh' ? 'ចំណាំ / តុលេខ (Note / Table):' : 'Note / Table No:'}
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder={language === 'kh' ? 'ឧទាហរណ៍: តុលេខ ៨...' : 'e.g. Table 8...'}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-khmer focus:outline-none ${
                          isLight
                            ? 'bg-white border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                            : 'bg-black/60 border-amber-500/30 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className={`p-2 rounded-xl border flex items-center justify-between ${isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-amber-950/30 border-amber-500/20'}`}>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsManagingList(true);
                            setNewGuestQuickName('');
                          }}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-khmer flex items-center gap-1 transition-all ${
                            isLight
                              ? 'bg-amber-200 hover:bg-amber-300 border-amber-400 text-amber-950 font-bold'
                              : 'bg-amber-400/25 hover:bg-amber-400/35 border-amber-400/50 text-amber-300'
                          }`}
                        >
                          <Plus className="w-3 h-3 text-amber-500" />
                          <span>{language === 'kh' ? '+ បន្ថែមច្រើនទៀត' : '+ Add More Guests'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Box with live Guest Info */}
                  <div className={`p-3 rounded-xl border text-center ${
                    isLight
                      ? 'bg-gradient-to-r from-amber-100/70 via-amber-50 to-amber-100/70 border-amber-300'
                      : 'bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border-amber-500/30'
                  }`}>
                    <span className={`text-[10px] ${isLight ? 'text-amber-800 font-bold' : 'text-amber-400/70'} font-khmer block uppercase tracking-wider`}>
                      {language === 'kh' ? 'ព័ត៌មានបង្ហាញលើសំបុត្រ Envelope' : 'Preview on Envelope'}
                    </span>
                    <span className={`text-base sm:text-lg font-moul ${isLight ? 'text-amber-950' : 'text-amber-100'} mt-1 block drop-shadow`}>
                      {fullName}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1">
                    <button
                      id="preview-guest-envelope-btn"
                      type="button"
                      onClick={handlePreviewEnvelope}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-khmer font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <MailOpen className="w-3.5 h-3.5 text-amber-950" />
                      <span>{language === 'kh' ? 'បើកមើលសំបុត្រ' : 'Open Envelope'}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Drop box List Manager View (Edit names, Add more guests, Delete) */
              <div className="space-y-3">
                {/* Add New Guest to Drop box Form */}
                <div className={`p-3 rounded-xl border space-y-2 ${isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-amber-950/40 border-amber-500/40'}`}>
                  <span className={`block text-xs font-khmer font-bold ${isLight ? 'text-amber-950' : 'text-amber-300'} flex items-center gap-1.5`}>
                    <Plus className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'kh' ? 'បន្ថែមភ្ញៀវថ្មីទៅក្នុង Firebase Database:' : 'Add New Guest to Firebase:'}</span>
                  </span>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newGuestQuickName}
                      onChange={e => setNewGuestQuickName(e.target.value)}
                      placeholder={language === 'kh' ? 'បញ្ចូលឈ្មោះភ្ញៀវ...' : 'Enter guest name...'}
                      className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-khmer focus:outline-none ${
                        isLight
                          ? 'bg-white border-amber-300 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500'
                          : 'bg-black/70 border-amber-500/30 text-amber-100 placeholder:text-neutral-600 focus:border-amber-400'
                      }`}
                    />
                    <select
                      value={newGuestQuickCategory}
                      onChange={e => setNewGuestQuickCategory(e.target.value as any)}
                      className={`px-2 py-1.5 rounded-lg border text-xs font-khmer focus:outline-none ${
                        isLight
                          ? 'bg-white border-amber-300 text-neutral-900 focus:border-amber-500'
                          : 'bg-black/70 border-amber-500/30 text-amber-200 focus:border-amber-400'
                      }`}
                    >
                      <option value="vip">{language === 'kh' ? 'ភ្ញៀវ VIP' : 'VIP'}</option>
                      <option value="friends">{language === 'kh' ? 'មិត្តភក្តិ' : 'Friends'}</option>
                      <option value="family">{language === 'kh' ? 'សាច់ញាតិ' : 'Relatives'}</option>
                      <option value="general">{language === 'kh' ? 'ភ្ញៀវទូទៅ' : 'General'}</option>
                      <option value="colleagues">{language === 'kh' ? 'មិត្តរួមការងារ' : 'Colleagues'}</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddNewGuestToDropbox}
                      disabled={isSyncingWithCloud || !newGuestQuickName.trim()}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-khmer font-bold text-xs shadow transition-all disabled:opacity-50"
                    >
                      {language === 'kh' ? 'បន្ថែម' : 'Add'}
                    </button>
                  </div>
                </div>

                {/* List of Current Guests in Drop box */}
                <div className={`border rounded-xl overflow-hidden ${isLight ? 'border-amber-300 bg-white shadow-inner' : 'border-amber-500/30 bg-black/40'}`}>
                  <div className={`px-3 py-2 border-b flex items-center justify-between text-xs font-khmer flex-wrap gap-2 ${isLight ? 'bg-amber-100 border-amber-300' : 'bg-amber-950/60 border-amber-500/30'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`${isLight ? 'text-amber-950' : 'text-amber-200'} font-bold`}>
                        {language === 'kh' ? `បញ្ជីភ្ញៀវបច្ចុប្បន្ន (${savedGuests.length} នាក់)` : `Current Guests (${savedGuests.length})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <label className={`cursor-pointer px-2.5 py-1.5 rounded-lg border text-[11px] font-khmer flex items-center gap-1.5 transition-all ${
                        isLight
                          ? 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-900'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-200'
                      }`}>
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'kh' ? '📊 បញ្ចូលពី Excel / CSV' : 'Upload Excel / CSV'}</span>
                        <input
                          type="file"
                          accept=".txt,.json,.csv,.xlsx,.xls"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8,No,Guest Name,Category\n1,លោក ហុក សុខា,ភ្ញៀវ VIP\n2,លោក កែវ វុទ្ធី,មិត្តភក្តិ\n3,អ្នកស្រី ចាន់ ថាវី,សាច់ញាតិ\n4,កញ្ញា ម៉ៅ រតនា,ភ្ញៀវទូទៅ\n5,លោក សេង វិសាល,មិត្តរួមការងារ";
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", "wedding_guest_template.csv");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className={`cursor-pointer px-2 py-1.5 rounded-lg border text-[10px] font-khmer flex items-center gap-1 transition-all ${
                          isLight
                            ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                            : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/30 text-amber-300'
                        }`}
                        title={language === 'kh' ? 'ទាញយកគំរូឯកសារ Excel/CSV' : 'Download sample template'}
                      >
                        <span>📥 គំរូ CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClearAllGuests}
                        disabled={isSyncingWithCloud || savedGuests.length === 0}
                        className={`cursor-pointer px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-khmer font-bold flex items-center gap-1.5 transition-all duration-150 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed group/delbtn ${
                          isLight
                            ? 'bg-rose-100 hover:bg-rose-200 border-rose-300 text-rose-800'
                            : 'bg-rose-500/25 hover:bg-rose-500/40 border-rose-400/50 text-rose-200 hover:text-white'
                        }`}
                        title={language === 'kh' ? 'ចុចទីនេះដើម្បីលុបបញ្ជីភ្ញៀវទាំងអស់' : 'Click to delete all guests'}
                      >
                        {isSyncingWithCloud ? (
                          <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 text-rose-500 group-hover/delbtn:scale-110 transition-transform duration-150" />
                        )}
                        <span>{language === 'kh' ? '🗑️ លុបទាំងអស់' : 'Delete All'}</span>
                      </button>
                    </div>
                  </div>

                  <div className={`max-h-72 sm:max-h-96 overflow-y-auto divide-y ${isLight ? 'divide-amber-200/50' : 'divide-white/5'}`}>
                    {savedGuests.map(g => (
                      <div key={g.id} className={`p-2.5 flex items-center justify-between gap-2 ${isLight ? 'hover:bg-amber-50/70' : 'hover:bg-white/5'} transition-colors`}>
                        {editingGuestId === g.id ? (
                          <div className="flex-1 flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingGuestName}
                              onChange={e => setEditingGuestName(e.target.value)}
                              className={`flex-1 px-2 py-1 rounded border text-xs font-khmer ${
                                isLight
                                  ? 'bg-white border-amber-400 text-neutral-900'
                                  : 'bg-black border-amber-400 text-amber-100'
                              }`}
                            />
                            <select
                              value={editingGuestCategory}
                              onChange={e => setEditingGuestCategory(e.target.value as any)}
                              className={`px-2 py-1 rounded border text-xs font-khmer ${
                                isLight
                                  ? 'bg-white border-amber-400 text-neutral-900'
                                  : 'bg-black border-amber-400 text-amber-200'
                              }`}
                            >
                              <option value="vip">{language === 'kh' ? 'ភ្ញៀវ VIP' : 'VIP'}</option>
                              <option value="friends">{language === 'kh' ? 'មិត្តភក្តិ' : 'Friends'}</option>
                              <option value="family">{language === 'kh' ? 'សាច់ញាតិ' : 'Relatives'}</option>
                              <option value="general">{language === 'kh' ? 'ភ្ញៀវទូទៅ' : 'General'}</option>
                              <option value="colleagues">{language === 'kh' ? 'មិត្តរួមការងារ' : 'Colleagues'}</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleSaveInlineEdit(g.id)}
                              className="p-1 rounded bg-emerald-500/30 text-emerald-600 hover:bg-emerald-500/50"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingGuestId(null)}
                              className={`p-1 rounded ${isLight ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300' : 'bg-white/10 text-neutral-400 hover:bg-white/20'}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-khmer font-medium truncate block ${isLight ? 'text-neutral-900' : 'text-amber-100'}`}>
                                  {g.name}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full border shrink-0 font-khmer ${
                                  isLight
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                }`}>
                                  {language === 'kh' ? g.categoryLabelKh : g.categoryLabelEn}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setGuestInput(g.name);
                                  setCategory(g.category);
                                  setIsManagingList(false);
                                  showFeedback(language === 'kh' ? `បានជ្រើសរើស "${g.name}"` : `Selected "${g.name}"`);
                                }}
                                className={`px-2 py-1 rounded text-[11px] font-khmer transition-all ${
                                  isLight
                                    ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold'
                                    : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300'
                                }`}
                              >
                                {language === 'kh' ? 'ជ្រើស' : 'Use'}
                              </button>
                              <a
                                href={getPublicShareUrl(g.name, eventId)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 rounded transition-all ${
                                  isLight
                                    ? 'text-neutral-600 hover:text-amber-800 hover:bg-amber-100'
                                    : 'text-neutral-400 hover:text-amber-300 hover:bg-white/10'
                                }`}
                                title={language === 'kh' ? 'បើកមើលសាកល្បង' : 'Test Open'}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={async () => {
                                  const link = getPublicShareUrl(g.name, eventId);
                                  const short = await shortenUrl(link);
                                  navigator.clipboard.writeText(short);
                                  showFeedback(language === 'kh' ? `បានចម្លងតំណភ្ជាប់ខ្លីសម្រាប់ "${g.name}"` : `Copied short link for "${g.name}"`);
                                }}
                                className={`p-1 rounded transition-all ${
                                  isLight
                                    ? 'text-neutral-600 hover:text-amber-800 hover:bg-amber-100'
                                    : 'text-neutral-400 hover:text-amber-300 hover:bg-white/10'
                                }`}
                                title={language === 'kh' ? 'ចម្លងតំណភ្ជាប់ខ្លី' : 'Copy short link'}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(g)}
                                className={`p-1 rounded transition-all ${
                                  isLight
                                    ? 'text-neutral-600 hover:text-amber-800 hover:bg-amber-100'
                                    : 'text-neutral-400 hover:text-amber-300 hover:bg-white/10'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteGuest(g.id, g.name)}
                                className={`p-1 rounded transition-all ${
                                  isLight
                                    ? 'text-neutral-500 hover:text-rose-600 hover:bg-rose-100'
                                    : 'text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsManagingList(false)}
                  className={`w-full py-2 px-3 rounded-xl font-khmer text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isLight
                      ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                      : 'bg-white/10 hover:bg-white/15 text-neutral-200'
                  }`}
                >
                  <span>{language === 'kh' ? '← ត្រឡប់ទៅការជ្រើសរើសភ្ញៀវ' : '← Back to Selection'}</span>
                </button>
              </div>
            )}

            {/* Quick Share Link for this Guest */}
            <div className={`mt-3 pt-3 border-t ${isLight ? 'border-amber-300/80' : 'border-amber-500/20'} space-y-2`}>
              <label className={`block text-[11px] font-khmer ${isLight ? 'text-neutral-700' : 'text-neutral-300'} flex items-center justify-between`}>
                <span className="flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-amber-500" />
                  <span>{language === 'kh' ? 'តំណភ្ជាប់ផ្ទាល់សម្រាប់ភ្ញៀវនេះ:' : 'Personalized Link:'}</span>
                </span>
              </label>

              <div className="flex gap-2">
                <a
                  href={guestLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={language === 'kh' ? 'ចុចដើម្បីបើកមើលតំណភ្ជាប់ផ្ទាល់' : 'Click to open live invitation'}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono truncate select-all flex items-center justify-between gap-1 group ${
                    isLight
                      ? 'bg-white border-amber-300 hover:border-amber-500 text-amber-950'
                      : 'bg-black/70 border-white/10 hover:border-amber-400/60 text-amber-200/90'
                  }`}
                >
                  <span className="truncate">{guestLink}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-amber-500 shrink-0" />
                </a>
                <a
                  href={guestLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-khmer flex items-center gap-1 transition-all shrink-0 ${
                    isLight
                      ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                      : 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/40 text-amber-200'
                  }`}
                  title={language === 'kh' ? 'បើកមើលសាកល្បង' : 'Test Open'}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{language === 'kh' ? 'បើក' : 'Open'}</span>
                </a>
                <button
                  id="copy-guest-link-btn"
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-khmer flex items-center gap-1 transition-all shrink-0 ${
                    isLight
                      ? 'bg-amber-200 hover:bg-amber-300 border-amber-300 text-amber-950 font-bold'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-300'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">{language === 'kh' ? 'បានចម្លង' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'kh' ? 'ចម្លង' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                id="telegram-guest-share-btn"
                type="button"
                onClick={handleShareTelegram}
                className={`w-full py-2 px-3 rounded-xl border font-khmer text-xs flex items-center justify-center gap-1.5 transition-all mt-1 ${
                  isLight
                    ? 'bg-sky-100 hover:bg-sky-200 border-sky-300 text-sky-900 font-semibold'
                    : 'bg-sky-600/20 hover:bg-sky-600/30 border-sky-400/40 text-sky-300'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-sky-500" />
                <span>{language === 'kh' ? 'ផ្ញើទៅកាន់ Telegram' : 'Send via Telegram'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
