import { VStack, HStack, Spacer, Text, Image, Box, useDisclosure, Button, Spinner } from "@chakra-ui/react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogOverlay,
  } from '@chakra-ui/react'
import React from "react";
import { useProvider } from "../../context";
import { loadDappData } from "../../web3/funcs";



export const Timer = () => {

    const { setAccount, setContractBUSD, setRewardAmountRaised, setAlreadyClaim,
        setActualRewardAmount, setActualAmountToClaim, setFutureRewardAmount,
        setFutureAmountToClaim, setTimestampOpenReward, setTimestampNow,
        setAmountBDD, setAmountBUSD, setAmountSaver, setTimestampToClaimSaver,
         contractSaver, account, contractSaverAddress, setBDDQualified, timer, setTimer, setCanClaim,
         setActualRewardState, setFutureRewardState, setUserQualified, setAmountDAI, 
         userQualified, setContractBUSDaddress, setContractSaverAddress,
         setContractSaver, setChainID
         } = useProvider();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showSpinner, setShowSpinner] = React.useState(false);
    const [updating, setUpdating] = React.useState(false);
    const cancelRef = React.useRef()
    
    const handleRefresh = async () => 
    {
        setUpdating(true);
        const data = await contractSaver.methods.updateALL().encodeABI();
        console.log('data: ', data);

        const nonce = await web3.eth.getTransactionCount(account);
        console.log('nonce: ', nonce);

        const estimateGas = await web3.eth.estimateGas({
            from: account,
            to: contractSaverAddress,
            nonce: nonce,
            data: data
        });

        console.log('estimateGas: ', estimateGas);

        const params = {
            from: account,
            to: contractSaverAddress,
            gas: window.web3.utils.toHex(estimateGas),
            gasPrice: window.web3.utils.toHex(window.web3.utils.toWei('50', 'gwei')),
            data: data
        };

        ethereum.request({
            method: 'eth_sendTransaction',
            params: [params]
        }).then((res) => {
            console.log('Transaction Hash: ', res);
            
            setShowSpinner(true);
            const interval = setInterval( () => {
                
                web3.eth.getTransactionReceipt(res, async (err, rec) => {
                    if (rec)
                    {
                        clearInterval(interval);
                        await handleUpload();
                        setShowSpinner(false);
                        onClose();
                        setUpdating(false);
                    }

                    if (err) 
                    {
                        clearInterval(interval);
                        await handleUpload();
                        console.log('ERROR: ', err);
                        setShowSpinner(false);
                        onClose();
                    }
                });

            }, 500);

        });
    }; 

    const handleUpload = async () => 
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
            amountToClaim: `${ data.canClaim ? data.actualAmountToClaim : '0.00' } BUSD`,
            actualAmount: `${data.actualRewardAmount} BUSD`
        });

        setFutureRewardState({
            title: "RECAUDANDO",
            amountRaised: `${data.futureRewardAmount} BUSD`,
            amountToClaim: `${data.futureAmountToClaim} BUSD`,
            actualAmount: `${data.futureRewardAmount} BUSD`
        });
    };

    return(
        <>
        {/* Alert Dialog Update */}
        <AlertDialog
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    {'El Botón de actualizar tiene un costo de gas. Recomendamos usarlo sólo cuando los otros medios de recargar no funcionen para la actualización de los botes.'}
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button variant='info' onClick={handleRefresh} isDisabled={updating}>
                    Actualizar
                    </Button>
                    <Box w='10px' />
                    {
                        showSpinner ? 
                        <HStack>
                            <Spinner /> 
                            <Box w='10px' />
                        </HStack>
                        : null
                    }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


        <VStack>
            <HStack display={{lg: 'flex', md: 'flex', sm: 'flex', base: 'flex'}} w='full'>
                <Spacer />

                <VStack>
                    <Text color='pink.300' fontSize='lg' fontWeight='bold' >{ timer == '00:00' ? 'Actualiza Ahora' : 'Hasta el siguiente bote' }</Text>
                    <HStack w='200px' h='80px' border='1px' borderColor='pink.300' borderRadius={6} shadow={6}>
                        <Spacer />
                        <Text color='pink.300' fontSize='45px' fontWeight='bold'>{timer}</Text>
                        <Spacer />
                    </HStack>
                </VStack>

                <Spacer />

                <VStack>
                    <Box h='25px' />
                    <HStack w='80px' h='80px' border='1px' borderColor='pink.300' borderRadius={6} shadow={6} onClick={onOpen} cursor='pointer'>
                        <Spacer />
                        <Image
                        src='https://i.ibb.co/QvXSbLc/refresh-pink.png'
                        alt='refresh'
                        boxSize='50px'
                        />
                        <Spacer />
                    </HStack>
                </VStack>

                <Spacer />
            </HStack>
            
            <Box h={{xl: '110px', lg:'0px', md:'0px', sm: '0px', base: '0px'}}/>
            <Text
            color='pink.400' fontSize='md' fontWeight='bold'
            >{userQualified ? 'Cuenta Calificada' : 'Cuenta No Calificada'}</Text>
        </VStack>
        </>
    );
};