// src/components/FileUpload.tsx
import React, { useState } from 'react';
import { styles } from '../styles.ts';

interface FileUploadProps {
  onFileUpload: (file: File, email?: string) => Promise<void>;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) return true; // Email vide est valide car optionnel
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (email && !validateEmail(email)) {
      setEmailError('Veuillez entrer un email address valide');
      return;
    }
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      await handleFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (email && !validateEmail(email)) {
      setEmailError('Veuillez entrer un email address valide');
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      await onFileUpload(file, email || undefined);
      setEmailError('');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  return (
    <div>
      <div style={styles.emailContainer}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Veuillez entrer une adresse mail pour recevoir votre analyse (optionnel)"
          style={styles.emailInput}
        />
        {emailError && <div style={styles.emailError}>{emailError}</div>}
      </div>
      
      <div
        style={{
          ...styles.uploadContainer,
          ...(isDragging ? styles.uploadContainerDragging : {})
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-upload"
        />
        {isUploading ? (
          <div style={styles.uploadText}>Uploading...</div>
        ) : (
          <>
            <div style={styles.uploadText}>Glissez et déposez votre fichier CSV ici</div>
            <div style={styles.uploadText}>or</div>
            <button 
              onClick={() => document.getElementById('file-upload')?.click()}
              style={styles.uploadButton}
            >
              Sélectionnez un fichier
            </button>
          </>
        )}
      </div>
    </div>
  );
};