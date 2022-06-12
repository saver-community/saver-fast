import { HStack, VStack, Spacer, Box, Button, Input, Spinner, useColorModeValue, useDisclosure, AlertDialog, 
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
     AlertDialogBody, AlertDialogFooter, Text } from '@chakra-ui/react';
import { CardDapp } from '../../components/dapp/card';
import { Timer } from '../../components/dapp/timer';
import { GAS_PRICE, loadDappData } from '../../web3/funcs';
import React from 'react';
import { useProvider } from '../../context';
import { CloseIcon } from "@chakra-ui/icons";


export const AmountReward = () => {

    const { actualAmountToClaim,  contractSaver, account, contractSaverAddress, contractBUSD,
         contractBUSDaddress, setAmountBDD, setFutureRewardAmount, setActualRewardAmount,
        setActualAmountToClaim, setFutureAmountToClaim, setRewardAmountRaised,setTimestampOpenReward,
        setAccount, setContractSaver, setTimestampNow, 
        setAmountBUSD, setAmountSaver, setContractSaverAddress, setContractBUSD, setContractBUSDaddress,
        setTimestampToClaimSaver, setAlreadyClaim, setBDDQualified, setTimer, canClaim, setCanClaim,
        actualRewardState, futureRewardState, setActualRewardState, setFutureRewardState,
        userQualified, setUserQualified, setAmountDAI, setChainID } = useProvider();

    const [showInput, setShowInput] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loading2, setLoading2] = React.useState(false);
    const [isApprove, setIsApprove] = React.useState(false);
    const [approving, setApproving] = React.useState(false);
    const [donating, setDonating] = React.useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef()

    const [isOpenClaimMessage, setIsOpenClaimMessage] = React.useState(false);
    
    const [amountToDonate, setAmountToDonate] = React.useState('');
    const [amountClaimed, setAmountClaimed] = React.useState(0);

    const colorRed = useColorModeValue('red.400', 'red.500');

    const handleApprove = async () => 
    {
        setApproving(true);

        const amountWEI = await web3.utils.toWei(amountToDonate, 'ether');
        const data = contractBUSD.methods.approve(contractSaverAddress, amountWEI).encodeABI();

        const nonce = await web3.eth.getTransactionCount(account);
        
        const estimateGas = await web3.eth.estimateGas({
            from: account,
            nonce: nonce,
            to: contractBUSDaddress,
            data: data
        });

        const params = {
            from: account,
            to: contractBUSDaddress,
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

            const interval = setInterval(() => {

                web3.eth.getTransactionReceipt(res, (err, rec) => {
                    if (rec) 
                    {
                        clearInterval(interval);
                        setTimeout(() => {
                            setIsApprove(true);
                            setLoading(false);
                            setApproving(false);
                        }, 5000);
                    }
                    
                    if(err)
                    {
                        clearInterval(interval);
                        console.log('ERROR: ', err);
                    }
                });
                
            }, 500);
            
        });

    };

    const handleDonate = async () => 
    {
        setDonating(true);
        const amountWEI = await web3.utils.toWei(amountToDonate, 'ether');
        const data = await contractSaver.methods.donateStableCoin(amountWEI).encodeABI();

        const nonce = await web3.eth.getTransactionCount(account);
        
        const estimateGas = await contractSaver.methods.donateStableCoin(amountWEI).estimateGas({
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
            const interval = setInterval( () => {
                web3.eth.getTransactionReceipt(res, async (err, rec) => {
                    if (rec)
                    {
                        clearInterval(interval);
                        await handleWeb3();
                        setLoading(false);
                        setIsApprove(false);
                        setShowInput(false);
                        setDonating(false);
                        setAmountToDonate(null);
                        // Mostrar PopUp
                        onOpen();
                        // Recargar datos de la blockchain (como si fuera que toca el boton de actualizar)
                    }

                    if (err) 
                    {
                        clearInterval(interval);
                        console.log('ERROR: ', err);
                        /// Mostrar en pantalla que ocurrio un error.
                    }

                });
            }, 500);
            
         });

    };

    const handleClaim = async () => 
    {
        const data = await contractSaver.methods.claim().encodeABI();

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
            
            setLoading2(true);
            var i = 1;
            const interval = setInterval(() => {

                web3.eth.getTransactionReceipt(res, async (err, rec) => {
                    if (rec)
                    {
                        clearInterval(interval);

                        await handleWeb3();
                        setLoading2(false);
                        setAmountClaimed(actualAmountToClaim)
                        setIsOpenClaimMessage(true);
                    }
                    if (err)
                    {
                        clearInterval(interval);
                        console.log('ERROR: ', err);
                    }
                });

                i++;

            }, 500);

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

      return (
          <>
            {/* PopUp Donation */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Gracias por donar a Saver Community
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Con su acción generosa ayuda a otros ahorradores a cumplir sus propósitos
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button colorScheme='pink' ref={cancelRef} onClick={onClose} ml={3}>
                        Donar es Recibir
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

             {/* PopUp Claim */}
             <AlertDialog
                isOpen={isOpenClaimMessage}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsOpenClaimMessage(false)}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Gracias por Ahorrar junto a Saver Community
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Has recibido {amountClaimed} BUSD por conservar tus Ahorros.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button colorScheme='pink' ref={cancelRef} onClick={() => setIsOpenClaimMessage(false)} ml={3}>
                        Donar es Recibir
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* DESKTOP */}

            <HStack w='full' display={{xl: 'flex', lg: 'none', md: 'none', sm: 'none', base: 'none'}}>
                <Spacer />

                {/* BOTE RECAUDANDO */}
                <VStack w='full'>
                    <CardDapp {...futureRewardState} />
                    {
                        loading ? <Spinner /> :
                        !showInput ?
                        <Button w='450px' h='50px' fontSize='3xl' fontWeight='bold' variant='callToAction'
                        onClick={ () => setShowInput(true) } >DONAR</Button>
                        : 
                        <HStack w='450px'>
                            <Box w='10px' />
                            <Input
                             value={amountToDonate}
                             placeholder="Cantidad de BUSD a donar"
                             onChange={ (e) => setAmountToDonate(e.currentTarget.value) }
                             borderColor={ amountToDonate > 0 ? 'pink.400' : colorRed }
                             type='number'
                             w='full'
                             h='50px'
                             />
                             <Box w='10px' />
                             {
                                 amountToDonate > 0 ? 
                                 isApprove ?
                                 <Button variant='info' onClick={handleDonate} h='50px' w='450px' isDisabled={donating} >
                                     DONAR
                                 </Button> :
                                 <Button variant='info' onClick={handleApprove} h='50px' w='450px' isDisabled={approving} >
                                     {'Aprobar Transacción'}
                                 </Button> : null
                             }
                            <Box w='10px' />
                             <Button variant='alertDapp' onClick={() => setShowInput(false) } h='50px' >
                                <CloseIcon />
                            </Button>
                        </HStack>
                    }
                </VStack>

                <Spacer />

                <Timer />

                <Spacer />
                
                {/* BOTE REPARTIENDO */}
                <VStack w='full'>
                    <CardDapp {...actualRewardState} />
                    {
                        loading2 ? <Spinner /> :
                        <Button w='450px' h='50px' fontSize='3xl' fontWeight='bold' variant='callToAction'
                        onClick={ handleClaim } isDisabled={!canClaim}>RECIBIR</Button>
                         
                    }
                    {
                        !canClaim ? 
                            userQualified ?
                            <Text color='pink.400' fontSize='12px' fontFamily='italic'>
                                Debes esperar al proximo bote para poder recibir.
                            </Text> : 
                             <Text color='pink.400' fontSize='12px' fontFamily='italic'>
                                Debes calificarte para poder recibir.
                            </Text> :
                         null
                    }
                    {
                        (!canClaim && userQualified && (actualRewardState.actualAmount < actualAmountToClaim) ) ?
                            <Text color='pink.400' fontSize='12px' fontFamily='italic'>
                                No quedan fondos suficientes en el bote para entregar la cantidad que debes recibir.
                            </Text> : null
                    }
                </VStack>

                <Spacer />

            </HStack>

            {/* MOBIL */}
            
            <VStack w='full' display={{xl:'none',lg: 'flex', md: 'flex', sm: 'flex', base: 'flex'}}>
                {/* BOTE REPARTIENDO */}
                <HStack w='full'>
                    <Box w='10px' />
                    <VStack w='full'>
                        <CardDapp {...futureRewardState} />
                        {
                        loading ? <Spinner /> :
                        !showInput ?
                        <Button w='full' h='50px' fontSize='3xl' fontWeight='bold' variant='callToAction'
                        onClick={ () => setShowInput(true) } >DONAR</Button>
                        : 
                        <HStack w='full'>
                            <Box w='10px' />
                            <Input
                             value={amountToDonate}
                             placeholder="Cantidad de BUSD a donar"
                             onChange={ (e) => setAmountToDonate(e.currentTarget.value) }
                             borderColor={ amountToDonate > 0 ? 'pink.400' : colorRed }
                             type='number'
                             w='full'
                             h='50px'
                             />
                             <Spacer />
                             {
                                 amountToDonate > 0 ? 
                                 isApprove ?
                                 <Button variant='info' onClick={handleDonate} h='50px' w='full' isDisabled={donating}>
                                     DONAR
                                 </Button> :
                                 <Button variant='info' onClick={handleApprove} h='50px' w='full' isDisabled={approving}>
                                     <VStack>
                                         <Text>Aprobar</Text>
                                         <Text>{'Transacción'}</Text>
                                     </VStack>
                                 </Button> : null
                             }
                             <Button variant='alertDapp' onClick={() => setShowInput(false) } h='50px' >
                                <CloseIcon />
                            </Button>
                        </HStack>
                    }
                    </VStack>
                    <Box w='10px' />
                </HStack>

                <Box h='10px' />
                <Timer />
                <Box h='10px' />

                {/* BOTE RECAUDANDO */}
                <HStack w='full' >
                    <Box w='10px' />
                    <VStack w='full'>
                        <CardDapp {...actualRewardState} />
                        {
                            loading2  ? <Spinner /> :
                            <Button w='full' h='50px' fontSize='3xl' fontWeight='bold' variant='callToAction'
                            onClick={ handleClaim } isDisabled={!canClaim}>RECIBIR</Button>
                            
                        }
                        {
                        !canClaim ? 
                            userQualified ?
                            <Text color='pink.400' fontSize='12px' fontFamily='italic'>
                                Debes esperar al proximo bote para poder recibir.
                            </Text> : 
                             <Text color='pink.400' fontSize='12px' fontFamily='italic'>
                                Debes calificarte para poder recibir.
                            </Text> :
                         null
                    }
                    </VStack>
                    <Box w='10px' />
                </HStack>
                
                <Box h='10px' />
                
            </VStack>
          </>
      );
};