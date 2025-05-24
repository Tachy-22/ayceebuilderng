interface EventT {
  id: string;
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  mediaUrl?: string;
  images: string[];
  category?: string;
  status: "upcoming" | "past" | "cancelled";
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Sermon {
  id: string;
  title: string;
  description: string;
  date: string;
  times: string[];
  location: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SermonT {
  id?: string;

  title?: string;

  description?: string;

  date?: string;

  preacher?: string;

  videoUrl?: string;

  audioUrl?: string;

  category?: string;

  isPublished?: boolean;

  thumbnailUrl?: string;

  [key: string]: unknown;
}

interface BlogT {
  id?: string;
  title: string;
  author: string;
  date: Date | string | number;
  content: string;
  category: string;
  imageUrls: string[];
  excerpt: string;
  views?: number;
  tags?: string[];
  isPublished?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  slug?: string;
  [key: string]: any;
}

interface FileMetadata {
  url: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface ParticipantT {
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
}

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  query: string;
  message: string;
  submissionDate: string;
  replied: boolean;
}

interface SubscriberData {
  email: string;
  subscribedAt: string;
  status: "active" | "pending" | "unsubscribed";
}

// ...existing code...

type TestimonyT = {
  id?: string;
  author: string;
  content: string;
  title?: string;
  date: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  approved?: boolean;
};

interface SubscriberT {
  id: string;
  email: string;
  name?: string;
  status: "active" | "unsubscribed";
  createdAt: string;
}

interface NewsletterHistoryT {
  id: string;
  subject: string;
  content: string;
  sentAt: string;
  recipientCount: number;
}

type BranchT = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  distance?: string;
};

interface FileMetadata {
  url: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface FileInputProps {
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxFileSize?: number; // in MB
  onUploadComplete?: (files: FileMetadata[]) => void;
  onError?: (error: string) => void;
  className?: string;
  initialFiles?: string[];
}

interface FileWithProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}
