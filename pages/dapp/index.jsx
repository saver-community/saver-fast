import React from 'react';
import Head from 'next/head';
import { CHAIN_ID } from '../../src/web3/funcs';
import { Footer } from '../../src/subPages/footer';
import { Box, Text, Spinner, VStack, Button, HStack, Image } from '@chakra-ui/react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { TheDivider } from '../../src/components/theDivider';
import { NavBar } from '../../src/components/dapp/navBar';
import { theNavBarES } from '../../src/props/navBarDapp';
import { AmountReward } from '../../src/subPages/dapp/amountReward';
import { PremioSaver } from '../../src/subPages/dapp/premioSaver';
import { useProvider } from '../../src/context';
import { getDappData, loadDappData } from '../../src/web3/funcs';
import { Triangle } from '../../src/components/dapp/triangle';
import { Formula } from '../../src/components/dapp/formula'; 


const Dapp = () => {

    const { 
      setActualAmountToClaim, setFutureAmountToClaim, setActualRewardAmount, setRewardAmountRaised,
      setFutureRewardAmount, setTimestampOpenReward,
      setAccount, setContractSaver, contractSaver, setTimestampNow, setAmountBDD,
      setAmountBUSD, setAmountSaver, setContractSaverAddress, setContractBUSD, setContractBUSDaddress,
      setTimestampToClaimSaver, setAlreadyClaim, setBDDQualified, setTimer, setCanClaim,
      setActualRewardState, setFutureRewardState, setUserQualified, setAmountDAI, chainID, setChainID
    } = useProvider();
    
    const [loading, setLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(true);
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
  
    const cancelRef = React.useRef();

    const handleLoadWeb3 = () => 
    {
        loadDappData().then((data) => 
        {
            setActualAmountToClaim(data.actualAmountToClaim);
            setFutureAmountToClaim(data.futureAmountToClaim)
        
            setRewardAmountRaised(data.rewardAmountRaised)
            setActualRewardAmount(data.actualRewardAmount);
            setFutureRewardAmount(data.futureRewardAmount);
            setAlreadyClaim(data.alreadyClaim);
            setBDDQualified(data.bddQualified);
            setCanClaim(data.canClaim);
            setUserQualified(data.userQualified);
            
            setChainID(data.chainID);
        
            setTimestampOpenReward(data.timestampOpenReward);
            setTimestampNow(data.timestampNow);
            setTimestampToClaimSaver(data.timestampToClaimSaver);
            setTimer(data.timer);
        
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
                title: 'REPARTIENDO',
                amountRaised: `${data.rewardAmountRaised} BUSD`,
                amountToClaim: `${ data.canClaim && !data.alreadyClaim ? data.actualAmountToClaim : '0.00' } BUSD`,
                actualAmount: `${data.actualRewardAmount} BUSD`
            });
        
            setFutureRewardState({
                title: "RECAUDANDO",
                amountRaised: `${data.futureRewardAmount} BUSD`,
                amountToClaim: `${data.futureAmountToClaim} BUSD`,
                actualAmount: `${data.futureRewardAmount} BUSD`
            });
        });
    };
  
    const handleWeb3 = () => 
    {
      getDappData().then((data) => 
      {
        setActualAmountToClaim(data.actualAmountToClaim);
        setFutureAmountToClaim(data.futureAmountToClaim)
    
        setRewardAmountRaised(data.rewardAmountRaised)
        setActualRewardAmount(data.actualRewardAmount);
        setFutureRewardAmount(data.futureRewardAmount);
        setAlreadyClaim(data.alreadyClaim);
        setBDDQualified(data.bddQualified);
        setCanClaim(data.canClaim);
        setUserQualified(data.userQualified);
        
        setChainID(data.chainID);
    
        setTimestampOpenReward(data.timestampOpenReward);
        setTimestampNow(data.timestampNow);
        setTimestampToClaimSaver(data.timestampToClaimSaver);
        setTimer(data.timer);
    
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
            title: 'REPARTIENDO',
            amountRaised: `${data.rewardAmountRaised} BUSD`,
            amountToClaim: `${ data.canClaim && !data.alreadyClaim ? data.actualAmountToClaim : '0.00' } BUSD`,
            actualAmount: `${data.actualRewardAmount} BUSD`
        });
    
        setFutureRewardState({
            title: "RECAUDANDO",
            amountRaised: `${data.futureRewardAmount} BUSD`,
            amountToClaim: `${data.futureAmountToClaim} BUSD`,
            actualAmount: `${data.futureRewardAmount} BUSD`
        });

        setLoading(false);

      });
      
  
    }

    const handleConnect = () => 
    {
        setLoading(true);
        handleWeb3();
    };
  
    React.useEffect(() => 
    { 
        // Cada vez que se cambia una billetera se refresca toda la dapp.
        window.ethereum.on('accountsChanged', handleLoadWeb3);
    }, []); //
  
    return (
      contractSaver == null ? 
      <>
        <Head>
          <title>Saver Fast - Dapp</title>
          <meta name="description" content="Aplicacion oficial de Saver Fast." />
          <meta name="image" content="https://i.ibb.co/qChFmVn/saver-fast.png" />
        </Head>
  
        <VStack w='full'>
          <Box h='120px' />
          <Image
          src='https://i.ibb.co/qChFmVn/saver-fast.png'
          alt='Saver Token Icon'
          boxSize='fit'
          />
          {
            loading ?
            <VStack>
                <HStack>
                    <Spinner />
                    <Text id='loadingPercent'/>
                </HStack>
                <Text>Conectando la Dapp con su billetera</Text>
                <HStack>
                    <Box w='5px' />
                    <Text fontStyle='italic'>Si encuentra problemas con la conexión de su billetera, recomendamos verificar que tu billetera este conectada a la red y recargar el navegador.</Text>
                    <Box w='5px' />
                </HStack>
            </VStack>
            : <Button variant='info' onClick={handleConnect}>Conectar Billetera</Button>
          }
          
        </VStack>
  
      </> :
      <>
        <Head>
          <title>Saver Fast - Dapp</title>
          <meta name="description" content="Aplicacion oficial de Saver Fast." />
          <meta name="image" content="https://i.ibb.co/qChFmVn/saver-fast.png" />
        </Head>
  
        {/* Alert Dialog ANOTHER BLOCKCHAIN */}
        {
          CHAIN_ID != chainID ? 
          <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isCentered
          >
            <AlertDialogOverlay />
            <AlertDialogHeader>{'Estas conectado en una red distinta a la BSC'}</AlertDialogHeader>
            <AlertDialogContent>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                {'Por favor, conectate a la Red de Binance Smart Chain para utilizar la Dapp correctamente'}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} variant='info'>
                  Ok
                </Button>
              </AlertDialogFooter>
          </AlertDialogContent>
  
          </AlertDialog> : null
        }
  
        
        <NavBar props={ theNavBarES }/>
        <TheDivider h={true} />
        <Box h='130px' />
        <AmountReward />
        <Box h='10px' />
        <Triangle />
        <Box h='30px' />
        <Formula />
        <Box h='30px' />
        <TheDivider h={true} />
        <PremioSaver />
        <Box h='30px' />
        <Footer />
  
      </>
    )
  }
  
  export default Dapp