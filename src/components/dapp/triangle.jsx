import React from "react";
import { VStack, HStack, Spacer, Image, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useProvider } from "../../context";
import { ERC20 } from "./ERC20";

export const Triangle = () => {

    const { userQualified, amountBUSD, amountSaver, amountDAI, amountMATIC, amountTRON, amountADA, amountBDD } = useProvider();

    // Triangle Images
    const qualifiedImage = 'https://i.ibb.co/7G0nHrm/triangulo-green.png';
    const notQualifiedImage = 'https://i.ibb.co/Z1QKmtC/triangulo-red.png';

    // Token Images
    const bddImage = useColorModeValue("https://i.ibb.co/Pgb5Nh8/donate.png", "https://i.ibb.co/pwWZ1PJ/donate-dark.png");
    const saverImage = "https://i.ibb.co/z7hxTvw/SAVER-TOKEN.png";
    const busdImage = "https://i.ibb.co/ZMhhYjc/busd.png";
    const daiImage = "https://i.ibb.co/jM9D4nh/DAI.png";

    // Colors
    const color = useColorModeValue('pink.300', 'pink.400');

    // Handlers
    const formatAmount = (amount) => {
        // > 1 Billion
        if ((amount / 1000000000) >= 1) return `${Number(amount / 1000000000).toFixed(2)}B`;
        // > 1Million
        if ((amount / 1000000) >= 1) return `${Number(amount / 1000000).toFixed(2)}M`;
        // > 100K
        if ((amount / 100000) >= 1) return `${Number(amount / 1000).toFixed(2)}K`;
        
        // < 100K
        return `${Number(amount).toFixed(2)}`;
    };

    const busd = {
        image: busdImage,
        symbol: 'BUSD',
        amount: amountBUSD
    };

    const dai = {
        image: daiImage,
        symbol: 'DAI',
        amount: amountDAI
    };

    const saver = {
        image: saverImage,
        symbol: 'SAVER',
        amount: amountSaver
    };

    return(
        <HStack w='full'>
            <Spacer />
            <VStack>
                <ERC20 props={saver}/>

                {/* TRIANGULO */}
                <Image
                src={userQualified ? qualifiedImage : notQualifiedImage}
                alt='triangle'
                boxSize={{lg: '200px', md: '200px', sm: '150px', base: '150px'}}
                />

                <VStack position='absolute'>
                    <Box h={{lg: '150px', md:'150px', sm: '115px', base: '115px'}} />
                    <Text 
                    color={color} fontWeight='bold' fontSize={{lg:'12px', md: '12px', sm: '10px', base: '7px'}}
                    >BDD</Text>
                    <HStack>
                        <Image
                        src={bddImage}
                        alt='bddImage'
                        boxSize='20px'
                        />
                        <Text 
                        color={color} fontWeight='bold' fontSize={{lg:'12px', md: '12px', sm: '10px', base: '10px'}}
                        >{formatAmount(amountBDD)}</Text>
                    </HStack>

                </VStack>

                <HStack>
                    <ERC20 props={busd} />
                    <Box w={{lg: '100px', md: '70px', sm:'50px', base: '35px'}}/>
                    <ERC20 props={dai} />
                </HStack>

            </VStack>
            <Spacer />
        </HStack>
    );

};