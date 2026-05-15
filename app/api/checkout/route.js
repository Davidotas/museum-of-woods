import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe not configured. Add STRIPE_SECRET_KEY to environment variables.' },
      { status: 503 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })

  try {
    const { items, customerEmail, deliveryMethod, deliveryFee } = await req.json()

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.material || undefined,
          images: item.image ? [
            item.image.startsWith('http')
              ? item.image
              : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://museumofwood.com'}${item.image}`
          ] : [],
          metadata: {
            engraving: item.engravingText || item.options?.engraving || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // pence
      },
      quantity: item.qty || 1,
    }))

    // Add delivery as a line item if there's a fee
    if (deliveryFee && deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: deliveryMethod === 'express' ? 'Express Delivery (7–10 days)' : 'Standard Delivery (14–21 days)',
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'NG', 'AU', 'IE', 'DE', 'FR', 'NL', 'ZA', 'GH', 'KE'],
      },
      metadata: {
        delivery_method: deliveryMethod || 'standard',
        source: 'museum-of-woods',
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://museumofwood.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://museumofwood.com'}/checkout`,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
