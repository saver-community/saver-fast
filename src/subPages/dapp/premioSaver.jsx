import { VStack, HStack, Spacer, Box, Text, Heading, Image, Button, 
    useColorModeValue, Spinner, Slider, SliderTrack, SliderFilledTrack,
    AlertDialog, 
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
     AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react';
import React from 'react';
import { useProvider } from '../../context';
import { loadDappData, GAS_PRICE } from '../../web3/funcs';


export const PremioSaver = () => {
    return(
        <>
            <Desktop />
            <Mobile />
        </>
    );
};

const Desktop = () => {

    const DAYS = 30;
    const MIN_AMOUNT = 369;

    const { timestampToClaimSaver, amountBDD, timestampNow, contractSaver, contractSaverAddress, account, setAmountSaver, 
        setAmountBDD, setFutureRewardAmount, setActualRewardAmount,
        setActualAmountToClaim, setFutureAmountToClaim, setRewardAmountRaised,setTimestampOpenReward,
        setAccount, setContractSaver, setTimestampNow, 
        setAmountBUSD, setContractSaverAddress, setContractBUSD, setContractBUSDaddress,
        setTimestampToClaimSaver, setAlreadyClaim,  setBDDQualified, setTimer, userQualified, setActualRewardState,
        setFutureRewardState, setAmountDAI, setChainID, setCanClaim, setUserQualified
    } = useProvider();

    const [loading, setLoading] = React.useState(false);

    // PopUp
    const [openPopUpClaimSaver, setOpenPopUpClaimSaver] = React.useState(false);
    const cancelRef = React.useRef();

    const colorBlue = useColorModeValue('blue.300', 'blue.400');
    const textColor = useColorModeValue('white', 'bgDark');
    const sliderBG = useColorModeValue('blue.200', 'blue.300');
    const filledBG = useColorModeValue('blue.300', 'blue.200');

    // Photos
    const bddPhoto = useColorModeValue('https://i.ibb.co/Pgb5Nh8/donate.png', 'https://i.ibb.co/pwWZ1PJ/donate-dark.png');
    const timePhoto = useColorModeValue('https://i.ibb.co/rf0c0Ht/time.png', 'https://i.ibb.co/zQSJzhn/time-dark.png');

    const getDaysPlaying = () => 
    {
        if (timestampToClaimSaver == 0) return 0;
        const differenceTimestamp = timestampToClaimSaver - timestampNow;
        const daysToClaimSaver = Math.trunc(differenceTimestamp / (60*60*24) );

        return (DAYS - daysToClaimSaver) - 1;
    };

    const getDaysPlayingValue = () => 
    {
        const daysPlaying = getDaysPlaying();
        return ((daysPlaying * 100) / DAYS);
    };

    const handleWeb3 = async () => 
    {
        const data = await loadDappData();

        setActualAmountToClaim(data.actualAmountToClaim);
        setFutureAmountToClaim(data.futureAmountToClaim)
    
        setRewardAmountRaised(data.rewardAmountRaised)
        setActualRewardAmount(data.actualRewardAmount);
        setFutureRewardAmount(data.futureRewardAmount);
        setAlreadyClaim(data.alreadyClaim);
        setBDDQualified(data.bddQualified);
        setCanClaim(data.canClaim);
        setUserQualified(data.userQualified);
    
        setTimestampOpenReward(data.timestampOpenReward);
        setTimestampNow(data.timestampNow);
        setTimestampToClaimSaver(data.timestampToClaimSaver);
        setTimer(data.timer);
    
        setAmountBDD(data.donationBalance);
        setAmountBUSD(data.busdBalance);
        setAmountSaver(data.saverBalance);
        setAmountDAI(data.daiBalance);
        
        setChainID(data.chainID);

        setContractSaverAddress(data.SAVER_TOKEN_CONTRACT_ADDRESS);
        setContractBUSDaddress(data.BUSD_CONTRACT_ADDRESS);
        
        setContractBUSD(data.ContractBUSD)
    
        setAccount(data.addressAccount);
        setContractSaver(data.ContractST);

        setActualRewardState({
            title: "REPARTIENDO",
            amountRaised: `${data.rewardAmountRaised} BUSD`,
            amountToClaim: `${ data.canClaim ? data.actualAmountToClaim : '0.00' } BUSD`,
            actualAmount: `${data.actualRewardAmount} BUSD`
        });

        setFutureRewardState({
            title: "RECAUDANDO",
            amountRaised: `${data.futureRewardAmount} BUSD`,
            amountToClaim: `${data.futureAmountToClaim} BUSD`,
            actualAmount: `${data.futureRewardAmount} BUSD`
        });
    
      }

    const handleClaim = async () => 
    {
        const data = await contractSaver.methods.claimSaver().encodeABI();
        
        const nonce = await web3.eth.getTransactionCount(account);
        const estimateGas = await web3.eth.estimateGas({
            from: account,
            nonce: nonce,
            to: contractSaverAddress,
            data: data
        });

        const params = {
            from: account,
            to: contractSaverAddress,
            gas: window.web3.utils.toHex(estimateGas), // Gas limit
            gasPrice: window.web3.utils.toHex(window.web3.utils.toWei(GAS_PRICE, 'gwei')),
            data: data
        };

        ethereum.request({
            method: 'eth_sendTransaction',
            params: [params]
        }).then((res) => {
            console.log('Transaction Hash: ', res);

            setLoading(true)
            const interval = setInterval(() => {
                web3.eth.getTransactionReceipt(res, (err, rec) => {
                    if (rec)
                    {
                        clearInterval(interval);
                        setLoading(false);
                        setOpenPopUpClaimSaver(true);
                        handleWeb3();
                        
                    }

                    if (err) 
                    {
                        clearInterval(interval);
                        console.log('ERROR: ', err);
                    }
                });
                
            }, 500);

        });
    };

    

    return (
        <>
            {/* PopUp Claim */}
            <AlertDialog
                isOpen={openPopUpClaimSaver}
                leastDestructiveRef={cancelRef}
                onClose={() => setOpenPopUpClaimSaver(false)}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        FELICITACIONES! HAS CONSEGUIDO EL PREMIO SAVER
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    {'Has Recibido 369 SAVER. Gracias por formar parte de esta comunidad de ahorradores, con tu participación nos beneficiamos tod@s.'}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button colorScheme='pink' ref={cancelRef} onClick={() => setOpenPopUpClaimSaver(false)} ml={3}>
                        Donar es Recibir
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <VStack display={{lg: 'flex', md: 'none', sm:'none', base: 'none'}} w='full'>
            <Box h='20px' />
            <HStack w='full'>
                <Box w='30px' />
                <Heading fontSize='50px' fontWeight='bold' color='pink.400'>PREMIO SAVER</Heading>
                <Spacer />
            </HStack>
            <Box h='10px' />
            <HStack w='full' h='full'>
                <Box w='30px' />
                <VStack h='full' w='full'>
                    <Spacer />

                    <HStack w='full'>
                        <Box w='30px' />

                        <Slider value={getDaysPlayingValue()} h='100px'>
                            <SliderTrack bg={sliderBG} h='50px' borderRadius={8}>
                                <SliderFilledTrack bg={filledBG} />

                                <VStack h='full' position='absolute'>
                                    <Spacer />
                                    <HStack w='full'>
                                        <Box w={{xl:'420px', lg:'300px'}} />
                                        <Text color={textColor} fontWeight='bold'
                                        >{getDaysPlaying()} Dias Jugando</Text>
                                    </HStack>
                                    <Spacer />
                                </VStack>

                            </SliderTrack>
                            
                        </Slider>

                        <Spacer />

                    </HStack>

                    <HStack w='full'>
                        <Box w='30px' />
                        {/* Mostrar cosas que nos faltan para alcanzar el premio saver en forma de lista */}
                        
                        <Text color='pink.400'>
                            {
                                getDaysPlaying() < DAYS || Number(amountBDD) < MIN_AMOUNT ? 
                                'Actualmente no estas calificado para recibir el PREMIO SAVER' :
                                 'YA PUEDES RECIBIR EL PREMIO SAVER'
                            }
                        </Text>
                        <Spacer />
                    </HStack>


                    {
                        Number(amountBDD) < MIN_AMOUNT ? 
                        <HStack w='full'>
                            <Box w='30px' />
                            <Image 
                            src={bddPhoto}
                            alt='bdd'
                            boxSize='30px'
                            />
                            <Text color='pink.400' fontWeight='bold'>Tienes que poseer un BDD igual o superior a 369</Text>
                            <Spacer />
                        </HStack> : null
                    }

                    {
                        userQualified ?
                            getDaysPlaying() < DAYS ?
                            <HStack w='full'>
                                <Box w='30px' />
                                <Image 
                                src={timePhoto}
                                alt='bdd'
                                boxSize='30px'
                                />
                                <Text color='pink.400' fontWeight='bold'>
                                    Debes esperar {DAYS - getDaysPlaying()} DIA{ (DAYS - getDaysPlaying() ) > 1 ? 'S' : null } para poder reclamar el Premio SAVER
                                </Text>
                                <Spacer />
                            </HStack> : null
                            :
                            <HStack w='full'>
                                <Box w='30px' />
                                <Image 
                                src={timePhoto}
                                alt='bdd'
                                boxSize='30px'
                                />
                                <Text color='pink.400' fontWeight='bold'>Debes calificarte para empezar a participar del Premio Saver</Text>
                                <Spacer />
                            </HStack>
                    }


                    <Spacer />
                </VStack>
                <Spacer />
                {
                    !loading ?
                    <VStack w='500px' h='full'>
                        <Spacer />
                        <Image 
                        src='https://i.ibb.co/qChFmVn/saver-fast.png'
                        alt='saver'
                        boxSize='fit'
                        opacity={ getDaysPlaying() <= DAYS || Number(amountBDD) <= MIN_AMOUNT ? '50%' : null }
                        />
                        <Button variant='actionDapp' onClick={handleClaim}>RECLAMAR</Button>
                    </VStack> :
                    <Spinner w='500px' />
                    // Probamos aca con 500px
                }
            </HStack>
            <Box h='10px' />
        </VStack>
        </>
        
    );
    
};

const Mobile = () => {

    const DAYS = 30;
    const MIN_AMOUNT = 369;

    const { timestampToClaimSaver, amountBDD, timestampNow, contractSaver, contractSaverAddress, account, setAmountSaver, 
        setAmountBDD, setFutureRewardAmount, setActualRewardAmount,
        setActualAmountToClaim, setFutureAmountToClaim, setRewardAmountRaised,setTimestampOpenReward,
        setAccount, setContractSaver, setTimestampNow, 
        setAmountBUSD, setContractSaverAddress, setContractBUSD, setContractBUSDaddress,
        setTimestampToClaimSaver, setAlreadyClaim,  setBDDQualified, setTimer,
        setActualRewardState, setFutureRewardState, setUserQualified, userQualified,
        setAmountDAI, setChainID, setCanClaim
    } = useProvider();

    const [loading, setLoading] = React.useState(false);

    // PopUp
    const [openPopUpClaimSaver, setOpenPopUpClaimSaver] = React.useState(false);
    const cancelRef = React.useRef();

    const colorBlue = useColorModeValue('blue.300', 'blue.400');
    const textColor = useColorModeValue('white', 'bgDark');
    const sliderBG = useColorModeValue('blue.200', 'blue.300');
    const filledBG = useColorModeValue('blue.300', 'blue.200');
    
    // Photos
    const bddPhoto = useColorModeValue('https://i.ibb.co/Pgb5Nh8/donate.png', 'https://i.ibb.co/pwWZ1PJ/donate-dark.png');
    const timePhoto = useColorModeValue('https://i.ibb.co/rf0c0Ht/time.png', 'https://i.ibb.co/zQSJzhn/time-dark.png');

    const getDaysPlaying = () => 
    {

        if (timestampToClaimSaver == 0) return 0;
        const differenceTimestamp = timestampToClaimSaver - timestampNow;
        const daysToClaimSaver = Math.trunc( differenceTimestamp / (60*60*24) );

        return (DAYS - daysToClaimSaver) - 1;
    };

    const getDaysPlayingValue = () => 
    {
        const daysPlaying = getDaysPlaying();
        return ((daysPlaying * 100) / DAYS);
    };

    // PROBAR LAS RECLAMACIONES
    const handleClaim = async () => 
    {
        const data = await contractSaver.methods.claimSaver().encodeABI();

        const nonce = await web3.eth.getTransactionCount(account);
        const estimateGas = await web3.eth.estimateGas({
            from: account,
            nonce: nonce,
            to: contractSaverAddress,
            data: data
        });

        const params = {
            from: account,
            to: contractSaverAddress,
            gas: window.web3.utils.toHex(estimateGas), // Gas limit
            gasPrice: window.web3.utils.toHex(window.web3.utils.toWei(GAS_PRICE, 'gwei')),
            data: data
        };

        ethereum.request({
            method: 'eth_sendTransaction',
            params: [params]
        }).then((res) => {
            console.log('Transaction Hash: ', res);

            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setOpenPopUpClaimSaver(true);
                handleWeb3();
            }, 10000);

        });

    };

    const handleWeb3 = async () => 
    {
        const data = await loadDappData();
    
        setActualAmountToClaim(data.actualAmountToClaim);
        setFutureAmountToClaim(data.futureAmountToClaim)
    
        setRewardAmountRaised(data.rewardAmountRaised)
        setActualRewardAmount(data.actualRewardAmount);
        setFutureRewardAmount(data.futureRewardAmount);
        setAlreadyClaim(data.alreadyClaim);
        setBDDQualified(data.bddQualified);
        setCanClaim(data.canClaim);
        setUserQualified(data.userQualified);
    
        setTimestampOpenReward(data.timestampOpenReward);
        setTimestampNow(data.timestampNow);
        setTimestampToClaimSaver(data.timestampToClaimSaver);
        setTimer(data.timer);

        setChainID(data.chainID);
    
        setAmountBDD(data.donationBalance);
        setAmountBUSD(data.busdBalance);
        setAmountSaver(data.saverBalance);
        setAmountDAI(data.daiBalance);
        
        setContractSaverAddress(data.SAVER_TOKEN_CONTRACT_ADDRESS);
        setContractBUSDaddress(data.BUSD_CONTRACT_ADDRESS);
        
        setContractBUSD(data.ContractBUSD)
    
        setAccount(data.addressAccount);
        setContractSaver(data.ContractST);

        setActualRewardState({
            title: "REPARTIENDO",
            amountRaised: `${data.rewardAmountRaised} BUSD`,
            amountToClaim: `${ canClaim ? data.actualAmountToClaim : '0.00' } BUSD`,
            actualAmount: `${data.actualRewardAmount} BUSD`
        });

        setFutureRewardState({
            title: "RECAUDANDO",
            amountRaised: `${data.futureRewardAmount} BUSD`,
            amountToClaim: `${data.futureAmountToClaim} BUSD`,
            actualAmount: `${data.futureRewardAmount} BUSD`
        });
    
    
    };

    return (
       <>

         {/* PopUp Claim */}
         <AlertDialog
                isOpen={openPopUpClaimSaver}
                leastDestructiveRef={cancelRef}
                onClose={() => setOpenPopUpClaimSaver(false)}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        FELICITACIONES! HAS CONSEGUIDO EL PREMIO SAVER
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    {'Has Recibido 369 SAVER. Gracias por formar parte de esta comunidad de ahorradores, con tu participación nos beneficiamos tod@s.'}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button colorScheme='pink' ref={cancelRef} onClick={() => setOpenPopUpClaimSaver(false)} ml={3}>
                        Donar es Recibir
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

         <VStack w='full' display={{lg: 'none', md: 'flex', sm: 'flex', base: 'flex'}}>
            <Box h='20px' />
            <HStack w='full'>
                <Box w='30px' />
                <Heading fontSize='50px' fontWeight='bold' color='pink.400'>PREMIO SAVER</Heading>
                <Spacer />
            </HStack>
            <Box h='10px' />
            <VStack h='full' w='full'>
                    <Spacer />

                    <HStack w='full'>
                        <Spacer />

                        <Slider value={getDaysPlayingValue()} h='50px'>
                            <SliderTrack bg={sliderBG} h='50px' borderRadius={6}>
                                <SliderFilledTrack bg={filledBG} />
                                <VStack h='full' position='absolute'>
                                    <Spacer />
                                    <HStack>
                                        <Box w={{md:'380px', sm: '250px', base: '130px'}}/>
                                        <Text color={textColor} fontWeight='bold' >{getDaysPlaying()} Dias Jugando</Text>
                                    </HStack>
                                    <Spacer />
                                </VStack>
                            </SliderTrack>
                            
                        </Slider>                        
 
                        <Spacer />
                    </HStack>
                    <HStack w='full'>
                        <Spacer />
                        <Text color='pink.400'>
                            {
                                getDaysPlaying() < DAYS || amountBDD < MIN_AMOUNT ? 
                                'Actualmente no estas calificado para recibir el PREMIO SAVER' :
                                'YA PUEDES RECIBIR EL PREMIO SAVER'
                            }
                        </Text>
                        <Spacer />
                    </HStack>

                    {
                        Number(amountBDD) < MIN_AMOUNT ? 
                        <HStack w='full'>
                            <Box w='30px' />
                            <Image 
                            src={bddPhoto}
                            alt='bdd'
                            boxSize='30px'
                            />
                            <Text color='pink.400' fontWeight='bold'>Tienes que poseer un BDD igual o superior a 369</Text>
                            <Spacer />
                        </HStack> : null
                    }

                    {
                        userQualified ?
                            getDaysPlaying() < DAYS ?
                            <HStack w='full'>
                                <Box w='30px' />
                                <Image 
                                src={timePhoto}
                                alt='bdd'
                                boxSize='30px'
                                />
                                <Text color='pink.400' fontWeight='bold'>
                                    Debes esperar {DAYS - getDaysPlaying()} DIA{ (DAYS - getDaysPlaying() ) > 1 ? 'S' : null } para poder reclamar el Premio SAVER
                                </Text>
                                <Spacer />
                            </HStack> : null
                            :
                            <HStack w='full'>
                                <Box w='30px' />
                                <Image 
                                src={timePhoto}
                                alt='bdd'
                                boxSize='30px'
                                />
                                <Text color='pink.400' fontWeight='bold'>Debes calificarte para empezar a participar del Premio Saver</Text>
                                <Spacer />
                            </HStack>
                    }

                    <Spacer />
                </VStack>
                {
                    !loading ?
                    <VStack w='full' h='full'>
                        <Spacer />
                        <Image 
                        src='https://i.ibb.co/qChFmVn/saver-fast.png'
                        alt='saver'
                        boxSize='fit'
                        opacity={ getDaysPlaying() <= DAYS || Number(amountBDD) <= MIN_AMOUNT ? '50%' : null }
                        />
                        <Button  variant='actionDapp' onClick={handleClaim}>RECLAMAR</Button>
                    </VStack> :
                    <Spinner />
                }
                <Box h='10px' />
        </VStack>
       </>
    );
};