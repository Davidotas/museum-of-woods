import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service-side env (no NEXT_PUBLIC_ prefix is fine server-side too)
const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// GET /api/products — return all products
export async function GET() {
  try {
    const { data, error } = await supabase()
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ products: data || [] })
  } catch (err) {
    console.error('GET /api/products:', err)
    return NextResponse.json({ products: [] })
  }
}

// POST /api/products — create a product
export async function POST(req) {
  try {
    const body = await req.json()
    const product = normalise(body)
    const { data, error } = await supabase()
      .from('products')
      .upsert(product, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ product: data })
  } catch (err) {
    console.error('POST /api/products:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/products — update a product
export async function PUT(req) {
  try {
    const body = await req.json()
    const product = normalise(body)
    const { data, error } = await supabase()
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', product.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ product: data })
  } catch (err) {
    console.error('PUT /api/products:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/products?id=xxx
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { error } = await supabase()
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/products:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Normalise a product object to match the DB schema
function normalise(p) {
  return {
    id:          String(p.id || `prod_${Date.now()}`),
    name:        p.name        || '',
    price:       Number(p.price) || 0,
    description: p.description || '',
    category:    p.category    || 'gifts',
    images:      Array.isArray(p.images) ? p.images : [p.image].filter(Boolean),
    badge:       p.badge       || null,
    wood_type:   p.woodType || p.wood_type || null,
    size:        p.size        || null,
    lead_time:   p.leadTime || p.lead_time || null,
    rating:      Number(p.rating)  || 5,
    reviews:     Number(p.reviews) || 0,
    featured:    Boolean(p.featured),
  }
}
