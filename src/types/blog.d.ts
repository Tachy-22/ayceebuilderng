interface CommentT {
  id: string;
  blogId: string;
  blogTitle: string;
  content: string;
  userId: string; // IP-based identifier
  userName: string; // Random generated name
  createdAt: Date | string;
}

interface BlogT {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  description?: string; // For compatibility
  author: string;
  date: Date | string | number;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  category: string;
  tags?: string[];
  imageUrls?: string[];
  image?: string; // Main image for compatibility
  thumbnailUrl?: string;
  views?: number;
  isPublished: boolean;
}
