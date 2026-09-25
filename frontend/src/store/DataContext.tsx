'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  ContactInfo,
  GalleryImage,
  MenuItem,
  SiteContent,
  SiteSettings,
  SurfPackage,
} from '@backend/types'

export type { ContactInfo, SiteSettings }

/**
 * Client-side mirror of the site content.
 *
 * The server renders the page with content already fetched from Supabase and
 * hands it in as `initialContent`, so there is no loading flash and no
 * client-side fetch on first paint. Mutations POST/PUT/DELETE through the /api
 * routes (which enforce admin auth) and then fold the server's response back
 * into state, so what you see is always what the database actually stored.
 */

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  // Only JSON bodies get a Content-Type; FormData must keep the browser's own
  // multipart header so the boundary is preserved.
  const isJsonBody = typeof init?.body === 'string'

  const response = await fetch(url, {
    ...init,
    headers: isJsonBody ? { 'Content-Type': 'application/json', ...init?.headers } : init?.headers,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (payload as { error?: string } | null)?.error ??
      `Request failed (${response.status}). Please try again.`
    throw new Error(message)
  }

  return payload as T
}

interface DataContextValue extends SiteContent {
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>
  updateMenuItem: (id: number, item: Omit<MenuItem, 'id'>) => Promise<void>
  deleteMenuItem: (id: number) => Promise<void>

  addSurfPackage: (pkg: Omit<SurfPackage, 'id'>) => Promise<void>
  updateSurfPackage: (id: number, pkg: Omit<SurfPackage, 'id'>) => Promise<void>
  deleteSurfPackage: (id: number) => Promise<void>

  addGalleryImage: (img: Omit<GalleryImage, 'id'>) => Promise<void>
  updateGalleryImage: (id: number, img: Omit<GalleryImage, 'id'>) => Promise<void>
  deleteGalleryImage: (id: number) => Promise<void>

  updateSettings: (settings: SiteSettings) => Promise<void>

  resetToDefaults: () => Promise<void>
  exportData: () => string
  importData: (json: string) => Promise<void>

  /** Uploads an image to Supabase Storage and resolves to its public URL. */
  uploadImage: (file: File) => Promise<string>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({
  initialContent,
  children,
}: {
  initialContent: SiteContent
  children: ReactNode
}) {
  const [data, setData] = useState<SiteContent>(initialContent)

  const replaceAll = useCallback((content: SiteContent) => setData(content), [])

  const value = useMemo<DataContextValue>(() => {
    // Insert / update / delete share the same shape across all three
    // collections, so the list surgery lives here once.
    const add =
      <K extends 'menuItems' | 'surfPackages' | 'galleryImages'>(key: K, url: string) =>
      async (item: unknown) => {
        const created = await request<SiteContent[K][number]>(url, {
          method: 'POST',
          body: JSON.stringify(item),
        })
        setData((d) => ({ ...d, [key]: [...d[key], created] } as SiteContent))
      }

    const update =
      <K extends 'menuItems' | 'surfPackages' | 'galleryImages'>(key: K, url: string) =>
      async (id: number, item: unknown) => {
        const saved = await request<SiteContent[K][number]>(`${url}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(item),
        })
        setData(
          (d) =>
            ({
              ...d,
              [key]: d[key].map((existing) => (existing.id === id ? saved : existing)),
            }) as SiteContent,
        )
      }

    const remove =
      <K extends 'menuItems' | 'surfPackages' | 'galleryImages'>(key: K, url: string) =>
      async (id: number) => {
        await request(`${url}/${id}`, { method: 'DELETE' })
        setData(
          (d) => ({ ...d, [key]: d[key].filter((existing) => existing.id !== id) }) as SiteContent,
        )
      }

    return {
      ...data,

      addMenuItem: add('menuItems', '/api/menu'),
      updateMenuItem: update('menuItems', '/api/menu'),
      deleteMenuItem: remove('menuItems', '/api/menu'),

      addSurfPackage: add('surfPackages', '/api/surf-packages'),
      updateSurfPackage: update('surfPackages', '/api/surf-packages'),
      deleteSurfPackage: remove('surfPackages', '/api/surf-packages'),

      addGalleryImage: add('galleryImages', '/api/gallery'),
      updateGalleryImage: update('galleryImages', '/api/gallery'),
      deleteGalleryImage: remove('galleryImages', '/api/gallery'),

      updateSettings: async (settings) => {
        const saved = await request<SiteSettings>('/api/settings', {
          method: 'PUT',
          body: JSON.stringify(settings),
        })
        setData((d) => ({ ...d, settings: saved }))
      },

      resetToDefaults: async () => {
        replaceAll(await request<SiteContent>('/api/content/reset', { method: 'POST' }))
      },

      exportData: () => JSON.stringify(data, null, 2),

      importData: async (json: string) => {
        let parsed: unknown
        try {
          parsed = JSON.parse(json)
        } catch {
          throw new Error('That file is not valid JSON.')
        }
        replaceAll(
          await request<SiteContent>('/api/content', {
            method: 'PUT',
            body: JSON.stringify(parsed),
          }),
        )
      },

      uploadImage: async (file: File) => {
        const body = new FormData()
        body.append('file', file)
        // No Content-Type header: the browser must set the multipart boundary.
        const { url } = await request<{ url: string }>('/api/upload', { method: 'POST', body })
        return url
      },
    }
  }, [data, replaceAll])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}
