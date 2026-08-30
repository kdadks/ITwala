import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { CMSHeroData, CMSSEOData, CMSItemData, PageCMSData } from '@/types/cms';

export type { CMSHeroData, CMSSEOData, CMSItemData, PageCMSData };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const publicSupabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch dynamic page CMS content from Supabase content_sections table
 * with fallback default data if database records do not exist yet.
 * Supports arbitrary section keys via dynamic key mapping.
 */
export async function getPageCMSContent(pageKey: string, defaultData: PageCMSData): Promise<PageCMSData> {
  try {
    const { data, error } = await publicSupabase
      .from('content_sections')
      .select('*')
      .like('name', `page_${pageKey}_%`);

    if (error || !data || data.length === 0) {
      return defaultData;
    }

    const result: PageCMSData = JSON.parse(JSON.stringify(defaultData));

    data.forEach((row) => {
      try {
        const parsed = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
        const sectionType = row.name.replace(`page_${pageKey}_`, '');

        // Merge objects (hero, seo) vs replace arrays/primitives
        if (sectionType === 'hero') {
          result.hero = { ...defaultData.hero, ...parsed };
        } else if (sectionType === 'seo') {
          result.seo = { ...defaultData.seo, ...parsed };
        } else {
          // All other section types are stored directly
          result[sectionType] = parsed;
        }
      } catch (e) {
        // Fallback for non-JSON content
      }
    });

    return result;
  } catch (err) {
    console.warn(`[CMS] Error fetching content for ${pageKey}, using defaults:`, err);
    return defaultData;
  }
}

/**
 * React hook to consume CMS page content dynamically in public pages & components
 */
export function useCMSData(pageKey: string, defaultData: PageCMSData) {
  const [cmsData, setCmsData] = useState<PageCMSData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPageCMSContent(pageKey, defaultData).then((res) => {
      if (isMounted) {
        setCmsData(res);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return { cmsData, isLoading };
}
