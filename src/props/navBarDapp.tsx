import { Lang, TheNavBar, TheNavItem } from '../components/dapp/navBar';

const langs: Lang[] = [
    { 
        symbol: 'ES',
        href: '/es',
        photoURL: ''
    },
    {
        symbol: 'EN',
        href: '',
        photoURL: ''
    }
];

const itemsES: TheNavItem[] = [
    // {
    //     label: "Dapp",
    //     href: '/dapp'
    // },
    // {
    //     label: "Mis Estadisticas",
    //     href: '/dapp/estadisticas'
    // }
];

export const theNavBarES: TheNavBar = {
    title: 'Saver Fast',
    photoURL: 'https://i.ibb.co/qChFmVn/saver-fast.png',
    navItems: itemsES,
    lang: langs[0],
    langs: langs
};

export const theNavBarEN: TheNavBar = {
    title: 'Saver Fast',
    photoURL: 'https://i.ibb.co/qChFmVn/saver-fast.png',
    navItems: itemsES,
    lang: langs[1],
    langs: langs
};