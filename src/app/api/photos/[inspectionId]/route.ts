import { deletePhoto, savePhoto } from '@/lib/photos/storage';
import { addCategoryPhoto, deleteCategoryPhoto } from '@/lib/db/queries/categoryPhotos';
import { getInspection, updateInspection } from '@/lib/db/queries/inspections';

export async function POST(request: Request, context: { params: Promise<{ inspectionId: string }> }) {
  const id = Number((await context.params).inspectionId);
  if (!getInspection(id)) return Response.json({ error: 'Inspection not found' }, { status: 404 });
  const form = await request.formData();
  const file = form.get('file');
  const slot = String(form.get('slot') ?? '');
  if (!(file instanceof File) || !['category', 'camper', 'price_board'].includes(slot)) return Response.json({ error: 'Invalid upload' }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return Response.json({ error: 'Photo exceeds 10MB' }, { status: 413 });
  const category = slot === 'category' ? String(form.get('category') ?? '') : undefined;
  if (slot === 'category' && !category) return Response.json({ error: 'Category is required' }, { status: 400 });
  const path = await savePhoto(id, file.name, Buffer.from(await file.arrayBuffer()), category);
  if (slot === 'category') addCategoryPhoto(id, category!, path);
  else updateInspection(id, { [slot === 'camper' ? 'camper_photo_path' : 'price_board_photo_path']: path });
  return Response.json({ filePath: path }, { status: 201 });
}

export async function DELETE(request: Request, context: { params: Promise<{ inspectionId: string }> }) {
  const id = Number((await context.params).inspectionId);
  const path = new URL(request.url).searchParams.get('path');
  const inspection = getInspection(id);
  if (!path || !inspection) return new Response(null, { status: 404 });
  await deletePhoto(path);
  const categoryPhoto = inspection.category_photos.find((photo) => photo.file_path === path);
  if (categoryPhoto) deleteCategoryPhoto(categoryPhoto.id);
  if (inspection.camper_photo_path === path) updateInspection(id, { camper_photo_path: null });
  if (inspection.price_board_photo_path === path) updateInspection(id, { price_board_photo_path: null });
  return new Response(null, { status: 204 });
}