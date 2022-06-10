import Head from 'next/head';
import React from 'react';
import { loadWeb3Data } from '../src/web3/funcs'
import { useProvider } from '../src/context';

// Components
import { VStack, Box } from '@chakra-ui/react';
import { NavBar } from '../src/components/navBar';
import { ShowDapp } from '../src/subPages/showDapp';
import { TheDivider } from '../src/components/theDivider';
import { InfoSaver } from '../src/subPages/infoSaver';
import { InfoStableCoin } from '../src/subPages/infoStableCoin';
import { InfoSaverBusd } from '../src/subPages/infoSaverBusd';

const Home  = () => {

  // Context
  const { 
    saverCirculation, setSaverCirculation, saverHolders, setSaverHolders,
    busdDistributed, setBusdDistributed, lastBusdDistributed, setLastBusdDistributed,
    saverPrice, setSaverPrice, saverMinted, setSaverMinted
  } = useProvider();

  // React useEffect
  React.useEffect(() => 
  {
    loadWeb3Data().then((res) => 
    {
      setSaverCirculation(res.tokensCirculation);
      setSaverHolders(res.holders);
      setBusdDistributed(res.StableCoinDistribute);
      setLastBusdDistributed(res.StableCoinLastDistribute);
      setSaverPrice(res.SaverPrice);
      setSaverMinted(res.SaverMinted);
    });

  }, []);

  return (
    <>
      <Head>
        <title>Saver Community</title>
        <meta name="description" content="Aplicacion oficial de Saver Community." />
        <meta name="image" content="https://i.ibb.co/z7hxTvw/SAVER-TOKEN.png" />
      </Head>

      <VStack w='full'>
        <Box h='20px' />
        <NavBar />
        <ShowDapp />
        <TheDivider h={true} />
        <InfoSaver />
        <TheDivider h={true} />
        <InfoStableCoin />
        <TheDivider h={true} />
        <InfoSaverBusd />
        <TheDivider h={true} />
        <ShowDapp />

      </VStack>

    </>
  )
}

export default Home
