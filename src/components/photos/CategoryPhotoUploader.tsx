'use client';
import { useState } from 'react';
import type { CategoryPhoto } from '@/types/inspection';

export default function CategoryPhotoUploader({ inspectionId, category, initialPhotos }: { inspectionId: number; category: string; initialPhotos: CategoryPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [error, setError] = useState('');
  async function upload(file: File) {
    setError('');
    try { const form = new FormData(); form.append('file', file); form.append('slot', 'category'); form.append('category', category); const response = await fetch(`/api/photos/${inspectionId}`, { method: 'POST', body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error ?? 'Photo upload failed'); setPhotos((current) => [...current, { id: Date.now(), inspection_id: inspectionId, category, file_path: result.filePath, created_at: new Date().toISOString() }]); } catch { setError('Photo could not be attached. The checklist is still usable without photos.'); }
  }
  async function remove(photo: CategoryPhoto) { const response = await fetch(`/api/photos/${inspectionId}?path=${encodeURIComponent(photo.file_path)}`, { method: 'DELETE' }); if (response.ok) setPhotos((current) => current.filter((item) => item.id !== photo.id)); }
  return <div className="mt-3 border-t border-[var(--line)] pt-3"><div className="flex items-center justify-between"><span className="font-sans text-sm font-bold">Category photos</span><label className="min-h-10 cursor-pointer rounded-lg border border-[var(--line)] px-3 py-2 text-sm">Add photo<input className="sr-only" type="file" accept="image/*" capture="environment" multiple onChange={(event) => { for (const file of Array.from(event.target.files ?? [])) void upload(file); }} /></label></div>{error && <p className="mt-2 text-sm text-[var(--accent-dark)]">{error}</p>}<div className="mt-2 flex flex-wrap gap-2">{photos.map((photo) => <div key={photo.id} className="relative"><img className="h-20 w-24 rounded object-cover" src={`/api/photos/${inspectionId}/${photo.file_path.split('/').pop()}`} alt={`${category} detail`} /><button type="button" aria-label={`Remove ${category} photo`} className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-xs text-white" onClick={() => void remove(photo)}>×</button></div>)}</div></div>;
}