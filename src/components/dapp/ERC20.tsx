import { HStack, VStack, Spacer, Box, Image, Text, useColorModeValue } from "@chakra-ui/react";

interface IERC2O {
    props: {
        image: string,
        symbol: string,
        amount: string
    }
};

export const ERC20 = ({props}: IERC2O) => {
    const color = useColorModeValue('pink.300', 'pink.400');

    const formatAmount = (amount:number):string => {
        // > 1 Billion
        if ((amount / 1000000000) >= 1) return `${Number(amount / 1000000000).toFixed(2)}B`;
        // > 1Million
        if ((amount / 1000000) >= 1) return `${Number(amount / 1000000).toFixed(2)}M`;
        // > 100K
        if ((amount / 100000) >= 1) return `${Number(amount / 1000).toFixed(2)}K`;
        
        // < 100K
        return `${Number(amount).toFixed(2)}`;
    };

    return(
        <VStack 
        w={{lg: '130px', md: '130px', sm: '90px', base: '90px'}}
        h={{lg: '65px', md: '65px', sm: '60px', base: '60px'}}
        border='1px solid'
        borderColor={color}
        borderRadius={6}>
            <Box h='5px' />
            <HStack w='full'>
                <Spacer />
                <Image 
                src={props.image}
                alt='erc20IMG'
                boxSize='20px'
                />
                <Text 
                color={color} 
                fontWeight='bold' 
                fontSize='12px'
                >{props.symbol}</Text>
                <Spacer />
            </HStack>
            <HStack w='full'>
                <Spacer />
                <Text 
                color={color} 
                fontWeight='bold' 
                fontSize={{lg:'lg', md: 'lg', sm: '10px', base: '12px'}}
                >{formatAmount(Number(props.amount))}</Text>
                <Spacer />
            </HStack>
            <Box h='5px' />
        </VStack>
    );
};