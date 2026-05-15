import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// POST /api/stripe/sync-product
// Creates or updates a Stripe Product + Price for a given product
export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })

  try {
    const { id, name, price, description, images, stripeProductId } = await req.json()

    if (!name || !price) {
      return NextResponse.json({ error: 'name and price required' }, { status: 400 })
    }

    const priceInPence = Math.round(Number(price) * 100)

    let stripeProduct

    if (stripeProductId) {
      // Update existing Stripe product
      stripeProduct = await stripe.products.update(stripeProductId, {
        name,
        description: description || undefined,
        images:      images?.length ? images.slice(0, 8) : undefined,
        metadata:    { mow_id: String(id) },
      })
    } else {
      // Create new Stripe product
      stripeProduct = await stripe.products.create({
        name,
        description: description || undefined,
        images:      images?.length ? images.slice(0, 8) : [],
        metadata:    { mow_id: String(id) },
      })
    }

    // Always create a new Price (Stripe prices are immutable once created)
    const stripePrice = await stripe.prices.create({
      product:     stripeProduct.id,
      unit_amount: priceInPence,
      currency:    'gbp',
      metadata:    { mow_id: String(id) },
    })

    return NextResponse.json({
      stripeProductId: stripeProduct.id,
      stripePriceId:   stripePrice.id,
    })
  } catch (err) {
    console.error('Stripe sync error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
