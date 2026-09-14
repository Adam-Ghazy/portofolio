/**
 * Server-side auto-translation utility using Google Translate engine.
 * Converts text between Indonesian ('id') and English ('en') reliably without external paid API keys.
 */
export async function autoTranslate(
  text: string,
  from: string = 'id',
  to: string = 'en'
): Promise<string> {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return '';
  }

  // If source and target are the same, return as is
  if (from.toLowerCase() === to.toLowerCase()) {
    return text;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      from
    )}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.warn(`Translation service HTTP ${response.status}`);
      return text;
    }

    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translatedParts = data[0].map((part: any) => (part && part[0] ? part[0] : ''));
      return translatedParts.join('').trim();
    }

    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

/**
 * Translates a JSON string of systems / subprojects
 */
export async function autoTranslateSystemsJson(
  systemsJson: string,
  from: string = 'id',
  to: string = 'en'
): Promise<string> {
  if (!systemsJson) return '';
  try {
    const parsed = JSON.parse(systemsJson);
    if (!Array.isArray(parsed)) return systemsJson;

    const translated = await Promise.all(
      parsed.map(async (item: any) => {
        const title = item.title ? await autoTranslate(item.title, from, to) : '';
        const tagline = item.tagline ? await autoTranslate(item.tagline, from, to) : '';
        const description = item.description ? await autoTranslate(item.description, from, to) : '';
        return {
          ...item,
          title: title || item.title,
          tagline: tagline || item.tagline,
          description: description || item.description,
        };
      })
    );

    return JSON.stringify(translated);
  } catch {
    return systemsJson;
  }
}
