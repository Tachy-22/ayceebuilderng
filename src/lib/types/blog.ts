// Types for blog interactions (comments, claps, etc.)

export interface CommentT {
  id: string;
  blogId: string;
  blogTitle: string;
  parentId?: string; // For nested comments (replies)
  content: string;
  author: string; // Name provided by commenter (random name)
  userId: string; // Anonymous user identifier based on IP
  createdAt: any; // Firestore timestamp
  likes: number;
  // For anonymous identification, we'll use a visitorId
  visitorId: string;
}

export interface ClapT {
  id: string;
  blogId: string;
  count: number; // Number of claps (users can clap multiple times)
  createdAt: any; // Firestore timestamp
  visitorId: string;
}

export interface LikeT {
  id: string;
  targetId: string; // ID of the comment being liked
  createdAt: any; // Firestore timestamp
  visitorId: string;
}
