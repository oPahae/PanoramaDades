import styles from '@/styles/globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeaderAgent from '@/components/HeaderAgent'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const getHeader = () => {
        const path = router.pathname;
        if(path.includes('login')) return <></>;
        else if(path.includes('admin')) return <Sidebar />;
        else if(path.includes('agent')) return <HeaderAgent />;
        else return <Header />;
    }
    return (
        <>
            {getHeader()}
            <Component {...pageProps} />
            <Footer />
        </>
    )
}