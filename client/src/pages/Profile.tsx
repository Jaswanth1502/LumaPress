import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfileApi, updateMyProfileApi } from '../api/users.api';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { EmptyState } from '../components/EmptyState';
import { ImageInput } from '../components/ImageInput';
import { toast } from 'sonner';
import { User, Calendar, Edit, Save, Camera, Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const { id: paramUserId } = useParams<{ id: string }>();
  const { user: currentUser, updateCurrentUserState } = useAuth();
  const queryClient = useQueryClient();

  const isOwnProfile = !paramUserId || (currentUser && paramUserId === currentUser.id);
  const targetUserId = isOwnProfile ? currentUser?.id : paramUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Fetch target profile & their published posts
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-profile', targetUserId],
    queryFn: () => getUserProfileApi(targetUserId!),
    enabled: !!targetUserId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updateData: { name?: string; bio?: string; avatarUrl?: string }) =>
      updateMyProfileApi(updateData),
    onSuccess: (updatedUser) => {
      updateCurrentUserState(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user-profile', updatedUser.id] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update profile');
    },
  });

  const startEdit = () => {
    if (data?.user) {
      setName(data.user.name);
      setBio(data.user.bio || '');
      setAvatarUrl(data.user.avatarUrl || '');
      setIsEditing(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    updateProfileMutation.mutate({ name, bio, avatarUrl });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-40 bg-slate-200/70 rounded-3xl w-full"></div>
        <div className="h-10 bg-slate-200/70 rounded-lg w-1/3"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="User Profile Not Found"
          description="The user profile you are looking for does not exist."
        />
      </div>
    );
  }

  const { user, posts } = data;
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Profile Header Card */}
      <div className="relative glass-card p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={
                user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=e0e7ff&color=4338ca&size=128`
              }
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-indigo-50"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-serif text-3xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 justify-center sm:justify-start">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {joinedDate}</span>
                </p>
              </div>

              {isOwnProfile && !isEditing && (
                <button
                  onClick={startEdit}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5 self-center sm:self-auto shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
              {user.bio || 'No biography provided yet.'}
            </p>
          </div>
        </div>

        {/* Edit Form Modal/Inline section */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-6 border-t border-slate-200/80 space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">Update Your Profile</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <ImageInput
                value={avatarUrl}
                onChange={(val) => setAvatarUrl(val)}
                label="Avatar Image (Optional)"
                placeholder="Paste avatar image URL or upload from device..."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Biography (max 500 characters)
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Published Articles by User */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-200/60 pb-3">
          Published Articles ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-6">
            This author hasn't published any articles yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
