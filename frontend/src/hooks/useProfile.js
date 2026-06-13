import { useState, useEffect, useCallback } from 'react';
import { getMyProfile, upsertProfile, uploadResume } from '../api/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch Profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyProfile();
      setProfile(res?.data || res);

    } catch (err) {
      console.error("Fetch Profile Error:", err);

      if (err?.response?.status !== 404) {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Load on mount
  useEffect(() => {
  const load = async () => {
    await fetchProfile();
  };
  load();
}, [fetchProfile]);

  // 🔹 Save / Update Profile
  const saveProfile = async (data) => {
    try {
      setSaving(true);
      setError(null);

      const res = await upsertProfile(data);
      setProfile(res?.data || res);

      return { success: true };

    } catch (err) {
      console.error("Save Profile Error:", err);

      return {
        success: false,
        message: err.response?.data?.message || 'Save failed'
      };
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Upload Resume
  const uploadResumeFile = async (file) => {
    try {
      setUploading(true);
      setError(null);

      const res = await uploadResume(file);
      // Merge returned resume data into existing profile to avoid overwriting
      // fields (like `skills`) when the upload endpoint returns only partial data.
      setProfile(prev => ({ ...(prev || {}), ...(res?.data || res) }));

      return { success: true };

    } catch (err) {
      console.error("Upload Resume Error:", err);

      return {
        success: false,
        message: err.response?.data?.message || 'Resume upload failed'
      };
    } finally {
      setUploading(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    uploading,
    error,
    saveProfile,
    uploadResumeFile,
    refetch: fetchProfile
  };
};