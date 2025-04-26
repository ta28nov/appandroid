export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // Optional avatar URL
  bio?: string; // Optional biography
  privacySettings?: {
    showEmail: boolean;
    showActivityStatus: boolean;
    // Add more privacy settings as needed
  };
  // Add other relevant profile fields
} 