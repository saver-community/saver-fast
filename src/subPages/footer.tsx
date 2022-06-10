import { Text, HStack, Heading, Image, Box, Spacer, Link, VStack } from "@chakra-ui/react";
import NextLink from 'next/link';

export const Footer = () => {
    return (
        <>
        <HStack w='full' h='75px' display={{lg: 'flex', md: 'flex', sm: 'none', base:"none"}}>
            <Box w='10px'/>
            <Image
            src='https://i.ibb.co/qChFmVn/saver-fast.png'
            alt='Saver Token icon'
            width='90px'
            height='60px'
            />
            <Box w='25px' />
            <Heading fontSize={{lg: 'xl', md: 'xl', sm: 'lg', base: 'md'}} color='pink.400'>Saver Community</Heading>
            <Spacer />
            <Link href="https://saver-community.gitbook.io/es/preguntas-frecuentes" color='pink.300' isExternal fontSize={{lg: 'lg', md: 'lg', sm: 'md', base: 'sm'}}>Preguntas Frequentes</Link>
            <Link href="https://saver-community.gitbook.io/es/" color='pink.300' isExternal fontSize={{lg: 'lg', md: 'lg', sm: 'md', base: 'sm'}}>Whitepaper</Link>
            <NextLink href='/dapp'>
                <Text color='pink.300' fontSize={{lg: 'lg', md: 'lg', sm: 'md', base: 'sm'}} cursor='pointer'>Conoce la Dapp</Text>
            </NextLink>
            <Box w='10px'/>
        </HStack>
        <VStack w='full' display={{lg: 'none', md: 'none', sm: 'flex', base:'flex'}}>
            <HStack w='full'>
                <Box w='10px' />
                <Image
                src='https://i.ibb.co/qChFmVn/saver-fast.png'
                alt='Saver Token icon'
                width='90px'
                height='60px'
                />
                <Box w='25px' />
                <Heading fontSize={{lg: 'xl', md: 'xl', sm: 'lg', base: 'lg'}} color='pink.400'>Saver Community</Heading>
                <Spacer />
            </HStack>
            <Link href="https://saver-community.gitbook.io/es/preguntas-frecuentes" color='pink.300' isExternal fontSize='md'>Preguntas Frequentes</Link>
            <Link href="https://saver-community.gitbook.io/es/" color='pink.300' isExternal fontSize='md'>Whitepaper</Link>
            <NextLink href='/dapp'>
                <Text color='pink.300' fontSize='md' cursor='pointer'>Conoce la Dapp</Text>
            </NextLink>
        </VStack>
        </>
        
        
    );
};