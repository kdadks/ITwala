import { publicSupabase } from './cms';
import { supabaseAdmin } from './supabaseClient';
import { RESOURCES_DATA } from '@/data/resourcesData';
import { ResourceArticle } from '@/types/resources';

const CMS_SECTION_KEY = 'page_resources_all_blogs';

/**
 * Normalizes a database row or JSON object into a strongly-typed ResourceArticle
 */
export function normalizeResource(raw: any): ResourceArticle {
  return {
    id: raw.id ?? raw.slug,
    slug: raw.slug,
    title: raw.title ?? '',
    description: raw.description ?? '',
    quickAnswer: raw.quickAnswer ?? raw.quick_answer ?? '',
    primaryGoal: raw.primaryGoal ?? raw.primary_goal ?? '',
    category: raw.category ?? 'AI & Business Strategy',
    readTime: raw.readTime ?? raw.read_time ?? '5 min read',
    publishDate: raw.publishDate ?? raw.publish_date ?? new Date().toISOString().split('T')[0],
    updatedDate: raw.updatedDate ?? raw.updated_date ?? new Date().toISOString().split('T')[0],
    difficulty: raw.difficulty ?? 'Beginner',
    status: raw.status ?? 'published',
    featuredImage: raw.featuredImage ?? raw.featured_image ?? '',
    keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
    schemaType: raw.schemaType ?? raw.schema_type ?? 'TechArticle',
    author: typeof raw.author === 'object' && raw.author !== null ? raw.author : {
      name: 'ITWala Team',
      role: 'AI Specialist',
      avatar: '/images/IT - WALA_logo (1).png',
    },
    cta: typeof raw.cta === 'object' && raw.cta !== null ? raw.cta : {
      title: 'Get Started with AI',
      text: 'Transform your business with ITWala.',
      linkText: 'Contact Us',
      linkUrl: '/contact',
      variant: 'consulting',
    },
    keyTakeaways: Array.isArray(raw.keyTakeaways ?? raw.key_takeaways)
      ? (raw.keyTakeaways ?? raw.key_takeaways)
      : [],
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    sections: Array.isArray(raw.sections) ? raw.sections : [],
  };
}

/**
 * Converts a ResourceArticle object into PostgreSQL `resources` table column format
 */
export function toDatabaseRow(article: ResourceArticle) {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    quick_answer: article.quickAnswer,
    primary_goal: article.primaryGoal,
    category: article.category,
    read_time: article.readTime,
    difficulty: article.difficulty,
    status: article.status,
    featured_image: article.featuredImage || '',
    keywords: article.keywords,
    schema_type: article.schemaType,
    author: article.author,
    cta: article.cta,
    key_takeaways: article.keyTakeaways,
    faqs: article.faqs,
    sections: article.sections,
    publish_date: article.publishDate,
    updated_date: article.updatedDate || new Date().toISOString().split('T')[0],
  };
}

/**
 * Fetch all resources (published only or include drafts).
 * Queries PostgreSQL `resources` table first; falls back to `content_sections` & static data.
 */
export async function getAllResources(includeDrafts = false): Promise<ResourceArticle[]> {
  const client = supabaseAdmin || publicSupabase;

  try {
    const { data: dbData, error: dbError } = await client
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (!dbError && dbData && dbData.length > 0) {
      const parsed = dbData.map(normalizeResource);
      return includeDrafts ? parsed : parsed.filter((r) => r.status !== 'draft');
    }
  } catch (err) {
    console.warn('Could not read from resources table, trying content_sections fallback:', err);
  }

  try {
    const { data: cmsData, error: cmsError } = await client
      .from('content_sections')
      .select('*')
      .eq('name', CMS_SECTION_KEY)
      .single();

    if (!cmsError && cmsData?.content) {
      const list: ResourceArticle[] = typeof cmsData.content === 'string'
        ? JSON.parse(cmsData.content)
        : cmsData.content;

      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map(normalizeResource);
        return includeDrafts ? normalized : normalized.filter((r) => r.status !== 'draft');
      }
    }
  } catch (err) {
    console.warn('Could not read from content_sections fallback:', err);
  }

  const staticList = RESOURCES_DATA.map((item) => normalizeResource({
    ...item,
    status: 'published',
  }));

  await seedStaticResources();
  return includeDrafts ? staticList : staticList.filter((r) => r.status !== 'draft');
}

/**
 * Fetch single resource by ID or Slug
 */
export async function getResourceByIdOrSlug(idOrSlug: string): Promise<ResourceArticle | null> {
  const client = supabaseAdmin || publicSupabase;

  try {
    // 1. Check by slug
    const { data: bySlug } = await client
      .from('resources')
      .select('*')
      .eq('slug', idOrSlug)
      .maybeSingle();

    if (bySlug) return normalizeResource(bySlug);

    // 2. Check by UUID / ID
    const { data: byId } = await client
      .from('resources')
      .select('*')
      .eq('id', idOrSlug)
      .maybeSingle();

    if (byId) return normalizeResource(byId);
  } catch (err) {
    console.warn('DB lookup notice:', err);
  }

  // 3. Search memory list fallback
  const all = await getAllResources(true);
  const found = all.find((r) => String(r.id) === String(idOrSlug) || r.slug === idOrSlug);
  return found ? normalizeResource(found) : null;
}

/**
 * Alias for backward compatibility
 */
export async function getResourceBySlug(slug: string): Promise<ResourceArticle | null> {
  return getResourceByIdOrSlug(slug);
}

/**
 * Saves or updates a resource article in both PostgreSQL `resources` table and `content_sections`
 */
export async function saveResource(article: ResourceArticle): Promise<boolean> {
  const client = supabaseAdmin || publicSupabase;
  const row = toDatabaseRow(article);

  try {
    const { error: dbError } = await client
      .from('resources')
      .upsert(row, { onConflict: 'slug' });

    if (dbError) {
      console.warn('Upsert into resources table notice:', dbError.message);
    }
  } catch (err) {
    console.warn('Exception upserting into resources table:', err);
  }

  try {
    const all = await getAllResources(true);
    const existingIdx = all.findIndex((r) => r.slug === article.slug || String(r.id) === String(article.id));
    if (existingIdx >= 0) {
      all[existingIdx] = article;
    } else {
      all.unshift(article);
    }

    await client
      .from('content_sections')
      .upsert(
        {
          name: CMS_SECTION_KEY,
          content: JSON.stringify(all),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'name' }
      );
  } catch (err) {
    console.error('Error saving to content_sections:', err);
  }

  return true;
}

/**
 * Deletes a resource by ID or Slug from both `resources` table and `content_sections`
 */
export async function deleteResource(slugOrId: string): Promise<boolean> {
  const client = supabaseAdmin || publicSupabase;

  try {
    await client.from('resources').delete().eq('slug', slugOrId);
    await client.from('resources').delete().eq('id', slugOrId);
  } catch {
    // ignore
  }

  try {
    const all = await getAllResources(true);
    const remaining = all.filter((r) => r.slug !== slugOrId && String(r.id) !== String(slugOrId));
    await client.from('content_sections').upsert(
      {
        name: CMS_SECTION_KEY,
        content: JSON.stringify(remaining),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'name' }
    );
  } catch (err) {
    console.error('Error deleting from content_sections:', err);
  }

  return true;
}

/**
 * Seeds all 20+ static guides from RESOURCES_DATA into PostgreSQL `resources` table AND `content_sections`
 */
export async function seedStaticResources(): Promise<{ success: boolean; count: number }> {
  const client = supabaseAdmin || publicSupabase;

  const staticArticles = RESOURCES_DATA.map((item) => normalizeResource({
    ...item,
    status: 'published',
  }));

  try {
    const rows = staticArticles.map(toDatabaseRow);
    const { error: dbError } = await client
      .from('resources')
      .upsert(rows, { onConflict: 'slug' });

    if (dbError) {
      console.warn('Notice seeding resources table:', dbError.message);
    }
  } catch (err) {
    console.warn('Exception seeding resources table:', err);
  }

  try {
    await client.from('content_sections').upsert(
      {
        name: CMS_SECTION_KEY,
        content: JSON.stringify(staticArticles),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'name' }
    );
  } catch (err) {
    console.error('Error seeding content_sections:', err);
  }

  return { success: true, count: staticArticles.length };
}
