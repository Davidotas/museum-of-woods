import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'product-images'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Ensure bucket exists (runs on first upload)
async function ensureBucket(sb) {
  const { data: buckets } = await sb.storage.listBuckets()
  if (buckets?.find(b => b.id === BUCKET)) return true
  const { error } = await sb.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  })
  return !error
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file')
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const sb = getSupabase()
    await ensureBucket(sb)

    // Unique filename: timestamp + original name
    const ext      = file.name.split('.').pop().toLowerCase()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path     = `products/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)

    const { data, error } = await sb.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
