'use client'
import { useCurrencyStore } from '../store/currency'

export default function Price({ gbp, className = '', style = {} }) {
  const format = useCurrencyStore(s => s.format)
  return (
    <span className={className} style={style}>
      {format(gbp)}
    </span>
  )
}
