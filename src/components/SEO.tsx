import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
}) => {
  const siteUrl = window.location.origin;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : window.location.href;
  const fullOgImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title} | Ayceebuilder</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:site_name" content="Ayceebuilder" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:alt" content={`Ayceebuilder - ${title}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      
      {/* Other Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </>
  );
};

export default SEO;
