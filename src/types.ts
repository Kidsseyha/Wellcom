export type Language = 'kh' | 'en';

export interface TimelineItem {
  id: string;
  time: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  icon?: string;
}

export interface Shift {
  id: string;
  name: string;
  nameEn?: string;
  date: string;
  timeLine: TimelineItem[];
}

export interface Schedule {
  id: string;
  eventId: string;
  shifts: Shift[];
}

export interface InvitationContent {
  location: string;
  subtitle: string;
  date_time: string;
  main_title: string;
  details_title: string;
  invitation_title: string;
  invitation_message: string;
  gratitude_title?: string;
  gratitude_message?: string;
  groom?: string;
  bride?: string;
}

export interface BankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
  usdQr?: string;
  khrQr?: string;
}

export interface TemplateConfig {
  map_url: string;
  primaryColor: string;
  textColor: string;
  guestNameColor: string;
  guest_name_font_family?: string;
  guest_name_font_size?: string;
  main_background: string;
  hide_main_background?: boolean;
  cover_background: string;
  hide_cover_background?: boolean;
  cover_subtitle_kh?: string;
  cover_subtitle_en?: string;
  anniversary_milestone?: string;
  anniversary_milestone_en?: string;
  cover_en_name_color?: string;
  cover_en_font_family?: string;
  groom_name_kh?: string;
  groom_name_en?: string;
  bride_name_kh?: string;
  bride_name_en?: string;
  portrait_shape?: 'circle' | 'rounded' | 'arch' | 'oval' | 'heart' | 'capsule' | 'leaf' | 'square';
  details_background: string;
  envelope_frame?: string;
  envelope_header_image?: string;
  guest_frame_style?: string;
  guest_label_text?: string;
  background_music: string;
  event_location: string;
  galleryPhotos?: string[];
  photo_gallary: {
    photo1: string;
    photo2: string;
    photo3: string;
    photo4: string;
  };
  qr_code?: string;
  qr_code_riel?: string;
  bankInfo?: BankInfo;
  invitation_kh: InvitationContent;
  invitation_en: InvitationContent;
}

export interface WeddingEvent {
  id: string;
  name: string;
  slug: string;
  bride: string;
  groom: string;
  brideEn?: string;
  groomEn?: string;
  singlePerson?: boolean;
  anniversary_milestone?: string;
  anniversary_milestone_en?: string;
  eventType?: 'wedding' | 'engagement' | 'housewarming' | 'birthday';
  updatedAt?: string;
  location: string;
  locationEn?: string;
  eating_time: string;
  startTime: string;
  date?: string;
  cover_image?: string;
  image: string;
  schedules: Schedule[];
  config: TemplateConfig;
}

export interface GuestInfo {
  id: string;
  name: string;
  nameEn?: string;
  phone?: string;
  status?: 'confirmed' | 'declined' | 'pending';
  guestCount?: number;
  tableNumber?: string;
}

export interface WishMessage {
  id: string;
  name: string;
  relationship?: string;
  message: string;
  createdAt: string;
  likes: number;
}
