
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import InteractiveButton from '@/components/interactive/InteractiveButton';

interface SocialButtonProps {
  provider: 'google' | 'twitter';
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ 
  provider, 
  onClick, 
  loading = false, 
  className 
}) => {
  const providerConfig = {
    google: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      label: 'Continue with Google',
      hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    twitter: {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      label: 'Continue with X',
      hoverColor: 'hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  };

  const config = providerConfig[provider];

  return (
    <InteractiveButton
      onClick={onClick}
      disabled={loading}
      variant="outline"
      hapticType="light"
      className={cn(
        'w-full h-12 border-2 transition-all duration-300',
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
        'border-gray-200 dark:border-gray-700',
        config.hoverColor,
        'hover:border-gray-300 dark:hover:border-gray-600',
        'hover:shadow-lg hover:shadow-black/10',
        'active:scale-[0.98] transform',
        className
      )}
    >
      {loading ? (
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-3">
          {config.icon}
          <span className="font-medium">{config.label}</span>
        </div>
      )}
    </InteractiveButton>
  );
};

export default SocialButton;
