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
  return <div className="mt-4 border-t border-[var(--line)] pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-sans text-sm font-bold">Photo evidence {photos.length > 0 && <span className="font-normal text-[var(--muted)]">({photos.length})</span>}</span><label className="photo-add-button" aria-label="Add category photo" title="Add category photo">+<input className="photo-input" type="file" accept="image/*" capture="environment" multiple onChange={(event) => { for (const file of Array.from(event.target.files ?? [])) void upload(file); }} /></label></div>{error && <p className="mt-2 text-sm text-[var(--accent-dark)]">{error}</p>}<div className="mt-3 flex flex-wrap gap-2">{photos.map((photo) => <div key={photo.id} className="group relative"><img className="photo-thumbnail" src={`/api/photos/${inspectionId}/${photo.file_path.split('/').pop()}`} alt={`${category} detail thumbnail`} /><button type="button" aria-label={`Remove ${category} photo`} className="photo-remove-button absolute -right-2 -top-2" onClick={() => void remove(photo)}>×</button></div>)}</div></div>;
}