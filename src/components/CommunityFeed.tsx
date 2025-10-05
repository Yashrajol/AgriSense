import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ThumbsUp, MessageCircle, Share2, Loader2 } from "lucide-react";
import { CommunityPost } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import databaseService from "@/services/database";
import { useToast } from "@/hooks/use-toast";

const CommunityFeed = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const { user } = useAuth();
  const { toast } = useToast();

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const communityPosts = await databaseService.getCommunityPosts();
      setPosts(communityPosts);
    } catch (error) {
      console.error('Failed to load community posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load community posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !user) {
      if (!user) {
        toast({
          title: 'Error',
          description: 'Please sign in to post to the community',
          variant: 'destructive',
        });
      }
      return;
    }

    try {
      setSubmitting(true);
      const savedPost = await databaseService.createCommunityPost(user.id, newPost);
      
      if (savedPost) {
        setPosts([savedPost, ...posts]);
        setNewPost('');
        toast({
          title: 'Success',
          description: 'Post shared successfully!',
        });
      }
    } catch (error) {
      console.error('Failed to create community post:', error);
      toast({
        title: 'Error',
        description: 'Failed to share post',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please sign in to like posts',
        variant: 'destructive',
      });
      return;
    }

    try {
      const isLiked = likedPosts.has(postId);
      
      if (isLiked) {
        await databaseService.unlikePost(postId, user.id);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        ));
      } else {
        await databaseService.likePost(postId, user.id);
        setLikedPosts(prev => new Set(prev).add(postId));
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Community Tips</h2>

      {/* New Post */}
      <div className="mb-6 p-4 border border-border rounded-lg">
        <Textarea
          placeholder="Share your farming tips with the community..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="mb-3"
          disabled={submitting}
        />
        <Button 
          onClick={handlePost} 
          disabled={!newPost.trim() || submitting || !user}
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {user ? 'Post to Community' : 'Sign in to post'}
        </Button>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No community posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border border-border rounded-lg hover:border-primary transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {post.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(post.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm mt-2">{post.content}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pl-12">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleLike(post.id)}
                  disabled={!user}
                >
                  <ThumbsUp className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current text-primary' : ''}`} />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" disabled>
                  <MessageCircle className="h-4 w-4" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" disabled>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommunityFeed;
