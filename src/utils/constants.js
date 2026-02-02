import { Home as HomeIcon, Bed, UtensilsCrossed, Umbrella, Mail, HelpCircle, BookOpen, Car, Utensils, BellRing, Clock, Cigarette, Dog, Users, PlusCircle, Paperclip, MessageCircle, Briefcase  } from 'lucide-react';

export const headerItems = [
    { icon: HomeIcon, label: 'Home', href: '/' },
    { icon: Bed, label: 'Rooms', href: '/rooms' },
    { icon: UtensilsCrossed, label: 'Restaurant', href: '/restaurant' },
    { icon: Umbrella, label: 'Pool', href: '/swimming' },
    { icon: Mail, label: 'Contact', href: '/contact' },
    { icon: HelpCircle, label: 'FAQ', href: '/faq' },
    { icon: BookOpen, label: 'Blog', href: '/blogs' },
];

export const headerAdminItems = [
    { icon: HomeIcon, label: 'Home', href: '/admin/' },
    { icon: Briefcase , label: 'Agents', href: '/admin/agents' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: PlusCircle, label: 'Reservations', href: '/admin/reservations' },
    { icon: Paperclip, label: 'Invoices', href: '/admin/invoices' },
    { icon: Bed, label: 'Rooms', href: '/admin/rooms' },
    { icon: BookOpen, label: 'Blog', href: '/admin/blogs' },
    { icon: HelpCircle, label: 'FAQ', href: '/admin/faqs' },
    { icon: MessageCircle, label: 'Contact', href: '/admin/contacts' },
];

export const headerAgentItems = [
    { icon: Users, label: 'Customers', href: '/agent/' },
    { icon: PlusCircle, label: 'Reservations', href: '/agent/reservations' },
];

export const hotelInfos = {
    name: 'Panorama Dades',
    email: 'test@test.com',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    whatsapp: '+212-668762022',
    phones: [
        '+212-667159941',
        '+212-668762022',
    ],
    location: 'Panorama dades Ait Ibrirne, (Ait Youl), Boumalen Dades',
    description: 'Experience the beauty of Panorama Dades Hotel, nestled in the heart of the Dades Valley. Immerse yourself in breathtaking views, elegant rooms, and exceptional hospitality. Book now and create unforgettable memories.',
}

export const testimonials = [
    {
        name: 'Sarah Johnson',
        text: 'Absolutely stunning! From the moment we arrived, we were treated like royalty. The rooms are impeccably designed, and the service is beyond exceptional. The infinity pool with sunset views was a dream come true.',
        stars: 5,
    },
    {
        name: 'Michael Chen',
        text: 'Our honeymoon at {hotelInfos.name} was perfect. The attention to detail, the romantic ambiance, and the world-class dining made it an experience we will cherish forever. Highly recommend the presidential suite!',
        stars: 5,
    },
    {
        name: 'Emma Rodriguez',
        text: 'I have stayed at {hotelInfos.name} hotels around the world, but {hotelInfos.name} stands out. The blend of modern elegance and warm hospitality is unmatched. The spa treatments and beach access were incredible. Coming back for sure!',
        stars: 5,
    },
];

export const hotelAmenities = [
    { icon: Car, title: 'Free Parking', desc: 'Secure parking space' },
    { icon: Utensils, title: 'Restaurant', desc: 'On-site dining' },
    { icon: BellRing, title: 'Room Service', desc: 'Available 24/7' },
    { icon: Clock, title: '24h Concierge', desc: 'Always at your service' },
];

export const hotelRules = [
    { icon: Cigarette, title: 'No Smoking', desc: 'Smoking not allowed', type: 'restriction' },
    { icon: Dog, title: 'No Pets', desc: 'Pets not allowed', type: 'restriction' },
];