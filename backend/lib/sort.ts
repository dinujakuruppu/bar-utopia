import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

type Client = SupabaseClient<Database>
type SortedTable = 'menu_items' | 'surf_packages' | 'gallery_images'

/**
 * Next position for a newly created row, so additions land at the end of the
 * list the way pushing onto the old hard-coded array did.
 */
export async function nextSortOrder(supabase: Client, table: SortedTable): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (data?.sort_order ?? 0) + 1
}
