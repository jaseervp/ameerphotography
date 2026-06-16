import React from 'react';


const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = 'https://ameerphotography.in/icon-512.png',
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  schema
}) => {
  const defaultKeywords = 'wedding photography Kerala, wedding cinematography Kerala, Kerala wedding photographers, Candid wedding photography, Save the date photography, Wedding reels, Bridal photography, Pre wedding shoot Kerala, Best wedding photography company Kerala, Luxury wedding photography, Wedding studio Kerala, Destination wedding photography Kerala';
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    
  );
};

export default SEO;
