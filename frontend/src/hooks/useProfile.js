import { useState, useEffect } from 'react';
import { getMyProfile, upsertProfile, uploadResume, toggleVisibility } from '../api/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      setProfile(res.data);
    } catch (err) {
      // 404 = no profile yet, that's fine
      if (err.response?.status !== 404) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async (data) => {
    try {
      setSaving(true);
      const res = await upsertProfile(data);
      setProfile(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Save failed' };
    } finally {
      setSaving(false);
    }
  };

  const uploadResumeFile = async (file) => {
    try {
      const res = await uploadResume(file);
      setProfile(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Resume upload failed' };
    }
  };

  const toggleProfileVisibility = async () => {
    try {
      const res = await toggleVisibility();
      setProfile(res.data);
    } catch (err) {
      setError('Failed to update visibility');
    }
  };

  return { profile, loading, saving, error, saveProfile, uploadResumeFile, toggleProfileVisibility, refetch: fetchProfile };
};