
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Mail, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCircle, 
  RefreshCw,
  ExternalLink,
  X,
  Download,
  FileText,
  Image,
  Music,
  Video,
  FileIcon,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
  read_at?: string;
  replied_at?: string;
  file_attachments?: any[];
}

const AdminContactManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { isAdmin } = useEnhancedAuth();
  const { toast } = useToast();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  const fetchSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      console.log('📧 Fetching contact submissions...');
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) {
        throw error;
      }

      console.log('✅ Contact submissions fetched:', data?.length || 0);
      const typedSubmissions = data?.map(submission => ({
        ...submission,
        status: submission.status as 'new' | 'read' | 'replied' | 'closed',
        file_attachments: Array.isArray(submission.file_attachments) 
          ? submission.file_attachments 
          : submission.file_attachments 
            ? [submission.file_attachments] 
            : []
      })) || [];
      
      setSubmissions(typedSubmissions);
      setError(null);
    } catch (error: any) {
      console.error('❌ Error fetching contact submissions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: 'read', 
          read_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, status: 'read' as const, read_at: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "Success",
        description: "Contact submission marked as read.",
      });
    } catch (error: any) {
      console.error('Error marking as read:', error);
      toast({
        title: "Error",
        description: "Failed to update submission status.",
        variant: "destructive",
      });
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: 'replied', 
          replied_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, status: 'replied' as const, replied_at: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "Success",
        description: "Contact submission marked as replied.",
      });
    } catch (error: any) {
      console.error('Error marking as replied:', error);
      toast({
        title: "Error",
        description: "Failed to update submission status.",
        variant: "destructive",
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    setDeletingIds(prev => new Set([...prev, id]));
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      
      toast({
        title: "Success",
        description: "Contact submission deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission.",
        variant: "destructive",
      });
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!isAdmin || isSubscribedRef.current || channelRef.current) {
      console.log('📧 Contact manager already subscribed or not admin, skipping...');
      return;
    }

    fetchSubmissions();

    console.log('🔄 Setting up real-time subscription for contact submissions...');
    const channelName = `contact_submissions_${Math.random().toString(36).substr(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        (payload) => {
          console.log('📧 Real-time contact submission change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newSubmission = {
              ...payload.new,
              status: payload.new.status as 'new' | 'read' | 'replied' | 'closed',
              file_attachments: Array.isArray(payload.new.file_attachments) 
                ? payload.new.file_attachments 
                : payload.new.file_attachments 
                  ? [payload.new.file_attachments] 
                  : []
            } as ContactSubmission;
            
            setSubmissions(prev => [newSubmission, ...prev.slice(0, 14)]);
            
            toast({
              title: "New Contact Submission",
              description: `From ${newSubmission.name}: ${newSubmission.subject}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedSubmission = {
              ...payload.new,
              status: payload.new.status as 'new' | 'read' | 'replied' | 'closed',
              file_attachments: Array.isArray(payload.new.file_attachments) 
                ? payload.new.file_attachments 
                : payload.new.file_attachments 
                  ? [payload.new.file_attachments] 
                  : []
            } as ContactSubmission;
            setSubmissions(prev => 
              prev.map(sub => 
                sub.id === updatedSubmission.id ? updatedSubmission : sub
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setSubmissions(prev => prev.filter(sub => sub.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        console.log('📧 Contact subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          isSubscribedRef.current = false;
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🔄 Cleaning up contact submissions subscription...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [isAdmin, toast]);

  // Enhanced file access handling
  const handleFileAccess = async (file: any, index: number) => {
    try {
      console.log('📎 Attempting to access file:', file);
      
      // Try to access the file URL directly first
      const response = await fetch(file.url, { method: 'HEAD' });
      
      if (response.ok) {
        // File is accessible, open it
        window.open(file.url, '_blank');
      } else {
        throw new Error(`File not accessible: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ File access error:', error);
      toast({
        title: "File Access Error",
        description: `Unable to access file "${file.filename}". It may have been moved or deleted.`,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'read': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'replied': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.new}>
        {status}
      </Badge>
    );
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-nature-forest" />
                Contact Submissions
              </CardTitle>
              <CardDescription>
                Recent contact form submissions and inquiries
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSubmissions}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : error ? (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Error loading submissions:</strong> {error}
              </AlertDescription>
            </Alert>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No contact submissions yet. When users submit the contact form, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div 
                  key={submission.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md relative"
                >
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSubmission(submission.id)}
                    disabled={deletingIds.has(submission.id)}
                    className="absolute top-2 right-2 h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    {deletingIds.has(submission.id) ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>

                  <div className="flex items-start justify-between mb-3 pr-10">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{submission.name}</span>
                      <span className="text-gray-500 text-sm">({submission.email})</span>
                    </div>
                    {getStatusBadge(submission.status)}
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {submission.subject}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {submission.message}
                    </p>
                  </div>
                  
                  {/* Enhanced File Attachments Display */}
                  {submission.file_attachments && submission.file_attachments.length > 0 && (
                    <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center mb-2">
                        <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          File Attachments ({submission.file_attachments.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {submission.file_attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file.type || '')}
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {file.filename || `File ${index + 1}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {file.type || 'Unknown type'}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileAccess(file, index)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      {/* File Access Warning */}
                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded text-xs">
                        <div className="flex items-center text-amber-700 dark:text-amber-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span>If files don't open, they may be in a private bucket or have been moved.</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(submission.created_at).toLocaleDateString()} {new Date(submission.created_at).toLocaleTimeString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      {submission.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(submission.id)}
                          className="text-xs h-6"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      {submission.status === 'read' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsReplied(submission.id)}
                          className="text-xs h-6"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Mark Replied
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}&body=Hello ${submission.name},%0A%0AThank you for contacting Terra Echo Studios. I received your message about "${submission.subject}".%0A%0A---Original Message---%0A${encodeURIComponent(submission.message)}`, '_blank')}
                        className="text-xs h-6"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default AdminContactManager;
