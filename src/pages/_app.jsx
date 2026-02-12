import '@/styles/globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeaderAgent from '@/components/HeaderAgent'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { hotelInfos } from '@/utils/constants'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const getHeader = () => {
    const path = router.pathname
    if (path.includes('login')) return <></>
    else if (path.includes('admin')) return <Sidebar />
    else if (path.includes('agent')) return <HeaderAgent />
    else return <Header />
  }

  const siteUrl = `https://${hotelInfos.domaine}`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": hotelInfos.name,
    "description": hotelInfos.description,
    "url": siteUrl,
    "email": hotelInfos.email,
    "telephone": hotelInfos.phones,
    "image": `${siteUrl}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hotelInfos.location,
      "addressCountry": "MA"
    },
    "sameAs": [
      hotelInfos.instagram,
      hotelInfos.facebook,
      hotelInfos.linkedin
    ]
  }

  return (
    <>
      <Head>
        <title>{hotelInfos.name} | Official Website</title>
        <meta name="description" content={hotelInfos.description} />
        <meta name="keywords" content="Panorama Dades, Dades Valley hotel, hotel in Boumalne Dades, Morocco hotel, luxury hotel Morocco, stay in Dades Gorge" />
        <meta name="author" content={hotelInfos.name} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <link rel="icon" href="/logo.png" />
        <link rel="canonical" href={siteUrl + router.asPath} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${hotelInfos.name} | Official Website`} />
        <meta property="og:description" content={hotelInfos.description} />
        <meta property="og:url" content={siteUrl + router.asPath} />
        <meta property="og:site_name" content={hotelInfos.name} />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${hotelInfos.name} | Official Website`} />
        <meta name="twitter:description" content={hotelInfos.description} />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {getHeader()}
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
