import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'product-images'

// Map any image MIME type to a safe extension Supabase will accept
const extFor = (mime = '', name = '') => {
  const mimeMap = {
    'image/jpeg':      'jpg',
    'image/jpg':       'jpg',
    'image/png':       'png',
    'image/webp':      'webp',
    'image/gif':       'gif',
    'image/heic':      'jpg',   // treat HEIC as JPEG for compatibility
    'image/heif':      'jpg',
    'image/tiff':      'jpg',
    'image/bmp':       'png',
    'image/svg+xml':   'svg',
    'image/avif':      'webp',
  }
  if (mimeMap[mime]) return mimeMap[mime]
  // Fall back to file extension
  const nameParts = name.split('.')
  return nameParts.length > 1 ? nameParts.pop().toLowerCase() : 'jpg'
}

// Use the content type that Supabase is happy with
const safeContentType = (mime = '') => {
  if (mime === 'image/heic' || mime === 'image/heif' || mime === 'image/bmp' || mime === 'image/tiff') {
    return 'image/jpeg'   // remap to JPEG – browser converts on read anyway
  }
  if (mime === 'image/avif') return 'image/webp'
  return mime || 'image/jpeg'
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file')
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Reject non-image types
    const mime = file.type || ''
    if (!mime.startsWith('image/')) {
      return NextResponse.json({ error: `${mime || 'Unknown type'} is not an image` }, { status: 400 })
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const ext      = extFor(mime, file.name)
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path     = `products/${fileName}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    const { error } = await sb.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: safeContentType(mime),
        upsert:      false,
      })

    if (error) throw new Error(error.message)

    const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('Upload error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
