import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, Globe, Bell, Save, User, UploadCloud, X } from 'lucide-react';
import api from "@/lib/api";
import Swal from 'sweetalert2';
import { useAuth } from "@/context/AuthContext";
import Cropper from 'react-easy-crop';
import getCroppedImg from "@/utils/cropImage";

const AdminSettings = () => {
  const { user, updateProfile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePic: user?.profilePic || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const subTabs = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleProfileDataChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || '');
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageToCrop(url);
      setIsCropping(true);
      setCroppedFile(null);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const file = new File([croppedImageBlob], "profile.jpg", { type: "image/jpeg" });
      setCroppedFile(file);
      setPreviewUrl(URL.createObjectURL(croppedImageBlob));
      setIsCropping(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Error cropping image', 'error');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('phone', profileData.phone);
    if (croppedFile) {
      formData.append('profilePic', croppedFile);
    }

    const success = await updateProfile(formData);
    if (success) {
      Swal.fire('Success', 'Profile updated successfully', 'success');
    } else {
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
    setIsUpdatingProfile(false);
  };

  const handlePasswordDataChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return Swal.fire('Error', 'New passwords do not match', 'error');
    }
    setIsChangingPassword(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      Swal.fire('Success', 'Password updated successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
      {/* Sub Navigation */}
      <div className="space-y-2">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`w-full flex items-center gap-3 px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-2xl ${
              activeSubTab === tab.id 
                ? 'bg-white shadow-sm border border-black/5 text-primary' 
                : 'text-secondary/40 hover:text-primary hover:bg-white/50'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-10 md:p-12">

        {activeSubTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <header className="mb-10">
              <h4 className="text-2xl font-heading mb-2">Admin Profile</h4>
              <p className="text-secondary/50 text-[10px] uppercase tracking-widest font-bold">Manage your personal admin information</p>
            </header>
            
            <form onSubmit={handleProfileUpdate} className="space-y-8 max-w-lg">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/30">Name</label>
                <input 
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileDataChange}
                  className="w-full bg-light/50 border-b border-black/5 py-3 focus:outline-none focus:border-primary transition-colors text-sm" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/30">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full bg-light/50 border-b border-black/5 py-3 focus:outline-none transition-colors text-sm opacity-50 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/30">Phone</label>
                <input 
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileDataChange}
                  className="w-full bg-light/50 border-b border-black/5 py-3 focus:outline-none focus:border-primary transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/30">Profile Picture</label>
                <div className="relative border-2 border-dashed border-black/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors w-32 h-32 bg-light/30">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary/40 group-hover:text-primary transition-colors">
                      <UploadCloud size={24} className="mb-2" />
                      <span className="text-[9px] uppercase tracking-widest font-bold">Upload</span>
                    </div>
                  )}
                  {previewUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white pointer-events-none">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Change</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-3 bg-primary text-on-primary px-10 py-4 uppercase tracking-widest text-[11px] font-bold hover:bg-primary/90 transition-all rounded-full shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <User size={14} /> 
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {activeSubTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <header className="mb-10">
              <h4 className="text-2xl font-heading mb-2">Password Management</h4>
              <p className="text-secondary/50 text-[10px] uppercase tracking-widest font-bold">Update your admin account password</p>
            </header>
            
            <form onSubmit={handlePasswordChange} className="space-y-8 max-w-lg">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/30">Current Password</label>
                <input 
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordDataChange}
                  className="w-full bg-light/50 border-b border-black/5 py-3 focus:outline-none focus:border-primary transition-colors text-sm" 
                  placeholder="Enter current password" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/30">New Password</label>
                <input 
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordDataChange}
                  className="w-full bg-light/50 border-b border-black/5 py-3 focus:outline-none focus:border-primary transition-colors text-sm" 
                  placeholder="Enter new password" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-primary/30">Confirm New Password</label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordDataChange}
                  className="w-full bg-light/50 border-b border-black/5 py-3 focus:outline-none focus:border-primary transition-colors text-sm" 
                  placeholder="Confirm new password" 
                  required
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center gap-3 bg-primary text-on-primary px-10 py-4 uppercase tracking-widest text-[11px] font-bold hover:bg-primary/90 transition-all rounded-full shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <Shield size={14} /> 
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        )}


      </div>

      {/* Cropper Modal */}
      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => { setIsCropping(false); setImageToCrop(null); }}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg relative z-[101] p-6 flex flex-col h-[70vh]"
            >
              <h3 className="text-xl font-heading mb-4">Crop Profile Picture</h3>
              <div className="relative flex-grow bg-black rounded-2xl overflow-hidden mb-6">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // 1:1 Aspect ratio for profile pics
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-primary"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => { setIsCropping(false); setImageToCrop(null); }} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold text-secondary/60 hover:text-primary transition-colors">Cancel</button>
                <button onClick={showCroppedImage} className="px-6 py-3 bg-primary text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-colors">Apply Crop</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;
