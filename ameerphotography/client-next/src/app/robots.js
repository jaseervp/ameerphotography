export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/booking-success'],
    },
    sitemap: 'https://ameerphotography.in/sitemap.xml',
  }
}
