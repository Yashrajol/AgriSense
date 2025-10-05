import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleClose = () => {
    setMode(initialMode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === 'login' ? 'Welcome Back' : 'Join AgriSense'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          {mode === 'login' ? (
            <LoginForm onToggleMode={handleToggleMode} />
          ) : (
            <SignUpForm onToggleMode={handleToggleMode} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
