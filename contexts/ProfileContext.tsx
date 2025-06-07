import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profileImage: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfile: (data: ProfileData) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Keshav singh',
    email: 'rajesh.hamal@gmail.com',
    phone: '+977-9824897066',
    address: 'Kathmandu, Nepal',
    dateOfBirth: '1990-05-15',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200'
  });

  const updateProfile = (data: ProfileData) => {
    setProfileData(data);
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}