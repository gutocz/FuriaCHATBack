import fs from 'fs';
import path from 'path';
import { scrapeFuria } from '../utils/scrape';

const cachePath = path.resolve(__dirname, '../utils/furia_data.json');

export async function updateFuriaCache(): Promise<void> {
  const data = await scrapeFuria();
  if (typeof data === 'string' || !data) return;

  fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
  console.log('[CACHE] Dados da FURIA atualizados.');
}
