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
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  date: Date | string;
  category: string;
  tags?: string[];
  imageUrls?: string[];
  thumbnailUrl?: string;
  views?: number;
  isPublished: boolean;
}
