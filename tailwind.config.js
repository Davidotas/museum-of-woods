/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // All colors reference CSS variables so both themes auto-update
        forest:   'rgb(var(--cr-forest)   / <alpha-value>)',
        bark:     'rgb(var(--cr-bark)     / <alpha-value>)',
        amber:    'rgb(var(--cr-amber)    / <alpha-value>)',
        grain:    'rgb(var(--cr-grain)    / <alpha-value>)',
        moss:     'rgb(var(--cr-moss)     / <alpha-value>)',
        fog:      'rgb(var(--cr-fog)      / <alpha-value>)',
        fog2:     'rgb(var(--cr-fog2)     / <alpha-value>)',
        fog3:     'rgb(var(--cr-fog3)     / <alpha-value>)',
        ember:    'rgb(var(--cr-ember)    / <alpha-value>)',
        charcoal: 'rgb(var(--cr-charcoal) / <alpha-value>)',
        card:     'rgb(var(--cr-card)     / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
