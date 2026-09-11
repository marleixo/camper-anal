import { toCsv } from '@/lib/export/toCsv';
import { toJson } from '@/lib/export/toJson';

export function GET(request: Request) {
  const format = new URL(request.url).searchParams.get('format');
  if (format !== 'json' && format !== 'csv') return new Response('format must be json or csv', { status: 400 });
  const timestamp = new Date().toISOString().replaceAll(':', '-');
  return new Response(format === 'json' ? toJson() : toCsv(), { headers: { 'Content-Type': format === 'json' ? 'application/json' : 'text/csv', 'Content-Disposition': `attachment; filename="camper-inspections-${timestamp}.${format}"` } });
}