import Web3 from 'web3';
import SaverToken from './ABI/SaverToken.json';
import BUSD from './ABI/BUSD.json';
import { MORALIS_ID } from '../../private';
import { ABI_FACTORY, ABI_PAIR } from './ABI/PancakeSwap';

const BSC_MAINNET_RPC = `https://speedy-nodes-nyc.moralis.io/${MORALIS_ID}/bsc/mainnet`;

export const CHAIN_ID = 56;

export const GAS_PRICE = "5";
 
const Contract = require('web3-eth-contract');

Contract.setProvider(BSC_MAINNET_RPC);

// Contract Address
export const SAVER_TOKEN_CONTRACT_ADDRESS = "0x6e637A68d5319Bd1Fe17FEf8c1D53cDbeD6e6866";
export const BUSD_CONTRACT_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
export const DAI_CONTRACT_ADDRESS = "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3";
export const FACTORY_ADDRESS = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

// Load Web3 to show info only
export const loadWeb3Data = async () => 
{
    window.web3 = new Web3(BSC_MAINNET_RPC);

    const data = await getDataWeb3();

    return data;
};


// Functions WEB3

const getSaverPrice = async () => 
{
    const ContractFactory = new Contract(ABI_FACTORY, FACTORY_ADDRESS);
    const pair = await ContractFactory.methods.getPair(SAVER_TOKEN_CONTRACT_ADDRESS, BUSD_CONTRACT_ADDRESS).call();

    const ContractPair = new Contract(ABI_PAIR, pair);
    const res = await ContractPair.methods.getReserves().call();
    

    return `${Number(res[1]/res[0]).toFixed(2)} BUSD`;
};

const getHoursToNextReward = (timestampNow, timestampOpenReward) => 
{

    if (timestampOpenReward < timestampNow) return '00:00';

    const timeToNextRewardSeconds = timestampOpenReward - timestampNow;
    const hours = Math.trunc((timeToNextRewardSeconds / (60*60)));

    timeToNextRewardSeconds -= 60*60*hours;
    const minutes = Math.trunc(timeToNextRewardSeconds / 60);

    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export const getContract = async () => 
{
    const contract = new Contract(SaverToken.output.abi, SAVER_TOKEN_CONTRACT_ADDRESS);
    return contract
};

const getTotalSupply = async (ContractST) => 
{
    const tC = await ContractST.methods.totalSupply().call();
    const tokensCirculation = await web3.utils.fromWei(tC, 'ether');

    return tokensCirculation;
};

const getSaverMinted = async (ContractST) => 
{
    const initialSupplyWEI = await ContractST.methods.initialSupply().call();
    const totalSupplyWEI = await ContractST.methods.totalSupply().call();

    const initialSupply = await web3.utils.fromWei(initialSupplyWEI, 'ether');
    const totalSupply = await web3.utils.fromWei(totalSupplyWEI, 'ether');

    const result = totalSupply - initialSupply;

    return result;
};

const getStableCoinDistribute = async (ContractToken) => 
{
    
    const StableCoinWEI = await ContractToken.methods.totalStableCoinDistribute().call();
    const StableCoin = await web3.utils.fromWei(StableCoinWEI, 'ether');

    return Number(StableCoin).toFixed(2);
};

const getLastStableCoinDistribute = async (ContractST) => 
{
    const rewardIDonClaim = await ContractST.methods.rewardIDonClaim().call();
    const StableCoinWei = await ContractST.methods.rewardAmount(rewardIDonClaim).call();
    const StableCoin = await web3.utils.fromWei(StableCoinWei, 'ether');

    return Number(StableCoin).toFixed(2);
};

const getHolders = async (ContractToken) => 
{
    const holders = await ContractToken.methods.totalHolders().call();
    return { holders };
};

const getFutureReward = async (ContractToken) => 
{
    const actualReward = await ContractToken.methods.rewardID().call();
    const amountWEI = await ContractToken.methods.rewardAmount(actualReward).call();
    const amount = await web3.utils.fromWei(amountWEI, 'ether');

    return Number(amount).toFixed(2);
};

const getActualRewardRaised = async (ContractToken) => 
{
    const actualReward = await ContractToken.methods.rewardIDonClaim().call();
    const amountWEI = await ContractToken.methods.rewardAmount(actualReward).call();
    const amount = await web3.utils.fromWei(amountWEI, 'ether');

    return Number(amount).toFixed(2);
};

const getActualAmountReward = async (ContractToken) => 
{
    const actualRewardID = await ContractToken.methods.rewardIDonClaim().call();
    const actualRewardWEI = await ContractToken.methods.rewardAmount(actualRewardID).call();
    const rewardClaimedWEI = await ContractToken.methods.rewardAmountClaimed(actualRewardID).call();
    
    const actualRewardETH = web3.utils.fromWei(String(actualRewardWEI), 'ether');
    const rewardClaimedETH = web3.utils.fromWei(String(rewardClaimedWEI), 'ether');

    const actualAmount = actualRewardETH - rewardClaimedETH; 

    return Number(actualAmount).toFixed(2);
};

export const getTimestampToNextReward = async (ContractToken) => 
{
    const actualReward = await ContractToken.methods.rewardID().call();
    const timestampOpenReward = await ContractToken.methods.timeOpenClaimReward(actualReward).call();

    return timestampOpenReward;
};

export const getActualTimestamp = async () => 
{
    const currentBlock = await web3.eth.getBlockNumber();

    const block = await web3.eth.getBlock(currentBlock);
    
    return block.timestamp;
};

export const getAccount = async () => 
{
    const account = await ethereum.request({method: 'eth_coinbase'});

    return account;
};

// NEED ACCOUNT



const getStableCoinToClaim = async (account, ContractToken) => 
{
    const toClaimWEI = await ContractToken.methods.viewClaimStableCoin(account).call();
    const toCLAIM = await web3.utils.fromWei(toClaimWEI, 'ether');

    return Number(toCLAIM).toFixed(2);
};

const getStableCoinEarned = async (account, ContractToken) => 
{
    const StableCoinWEI = await ContractToken.methods.stableCoinEarned(account).call();
    const StableCoinEarned = await web3.utils.fromWei(StableCoinWEI, 'ether');

    return Number(StableCoinEarned).toFixed(2);
};

const getStableCoinDonate = async (account, ContractToken) => 
{
    
    const allDonate = await ContractToken.methods.allDonatesOf(account).call();

    const StableCoin = await web3.utils.fromWei(allDonate, 'ether');

    return Number(StableCoin).toFixed(2);
};

// Get the balance of each ERC20

const getSaverBalance = async (account, ContractToken) => 
{
    const balance = await ContractToken.methods.balanceOf(account).call();
    const token = await web3.utils.fromWei(balance, 'ether');

    return Number(token).toFixed(2);
};

const getDonationBalance = async (account, ContractToken) => 
{
    const donateBalance = await ContractToken.methods.donationBalance(account).call();
    const StableCoin = await web3.utils.fromWei(donateBalance, 'ether');

    return Number(StableCoin).toFixed(2);
};

const getBUSDbalance = async (addressAccount, ContractST) => 
{
    const busdWEI = await ContractST.methods.getBalanceOfBUSD(addressAccount).call();
    const busd = await web3.utils.fromWei(busdWEI, 'ether');

    return Number(busd).toFixed(2);
};

const getDAIbalance = async (addressAccount, ContractST) => 
{
    const busdWEI = await ContractST.methods.getBalanceOfDAI(addressAccount).call();
    const busd = await web3.utils.fromWei(busdWEI, 'ether');

    return Number(busd).toFixed(2);
};

const getTotalDonationBalance = async (ContractToken) => 
{
    const totalDonationBalanceWEI = await ContractToken.methods.totalDonationBalance().call();
    const totalDonationBalance = await web3.utils.fromWei(totalDonationBalanceWEI, 'ether');

    return Number(totalDonationBalance).toFixed(2);
};

const getAmountToClaim = async (ContractToken, amount, addressAccount) => 
{
    const donationBalance = await getDonationBalance(addressAccount, ContractToken);
    const totalDonationBalance = await getTotalDonationBalance(ContractToken);

    if (amount == 0 || donationBalance == 0) return '0';

    return Number(((amount * donationBalance) / totalDonationBalance)).toFixed(2);
};

const getTimestampToClaimSaver = async (ContractST, addressAccount) => 
{
    const timestamp = await ContractST.methods.timestampToClaimSaver(addressAccount).call();

    return timestamp;
};

export const loadDappData = async () => 
{

    await loadWeb3();

    const ContractST = new Contract(SaverToken.output.abi, SAVER_TOKEN_CONTRACT_ADDRESS);
    const ContractBUSD = new Contract(BUSD.output.abi, BUSD_CONTRACT_ADDRESS);

    
    const addressAccount = await getAccount();

    const chainID = await window.web3.eth.getChainId();


    // Donation Balance
    const donationBalance = await getDonationBalance(addressAccount, ContractST);

    // BUSD
    const busdBalance = await getBUSDbalance(addressAccount, ContractST);

    // Saver
    const saverBalance = await getSaverBalance(addressAccount, ContractST);

    // DAI
    const daiBalance = await getDAIbalance(addressAccount, ContractST);

    
    // Reward
    const futureRewardAmount = await getFutureReward(ContractST);
    const futureAmountToClaim = await getAmountToClaim(ContractST, futureRewardAmount, addressAccount);


    const rewardAmountRaised = await getActualRewardRaised(ContractST);
    const actualRewardAmount = await getActualAmountReward(ContractST);
    const actualAmountToClaim = await getAmountToClaim(ContractST, rewardAmountRaised, addressAccount);

    
    const bddQualifiedWEI = await ContractST.methods.qualifiedDonationBalance().call();
    const bddQualified = await window.web3.utils.fromWei(bddQualifiedWEI, 'ether');
    

    const rewardIDonClaim = await ContractST.methods.rewardIDonClaim().call();
    const alreadyClaim = await ContractST.methods.holderClaimed(addressAccount, rewardIDonClaim).call();
    const userQualified = await ContractST.methods.canReclaim(addressAccount).call();
    const claimFrom = await ContractST.methods.claimFrom(addressAccount).call();
    const canClaim = ( (Number(claimFrom) <= Number(rewardIDonClaim)) && !alreadyClaim && userQualified );


    // Timestamp
    const timestampOpenReward = await getTimestampToNextReward(ContractST);

    const timestampNow = await getActualTimestamp();

    const timestampToClaimSaver = await getTimestampToClaimSaver(ContractST, addressAccount);

    const timer = getHoursToNextReward(timestampNow, timestampOpenReward);

    return {
        donationBalance, busdBalance, saverBalance, 
        rewardAmountRaised, actualRewardAmount, actualAmountToClaim, futureAmountToClaim,
        futureRewardAmount, timestampOpenReward, ContractST, addressAccount,
        timestampNow, SAVER_TOKEN_CONTRACT_ADDRESS, ContractBUSD, BUSD_CONTRACT_ADDRESS,
        timestampToClaimSaver, alreadyClaim, bddQualified, timer, canClaim, userQualified,
        daiBalance, chainID
    };
};

export const getDappData = async () => 
{

    // window.document.getElementById('loadingPercent').innerHTML = "0%";

    await loadWeb3();

    window.document.getElementById('loadingPercent').innerHTML = "5%";

    const ContractST = new Contract(SaverToken.output.abi, SAVER_TOKEN_CONTRACT_ADDRESS);
    const ContractBUSD = new Contract(BUSD.output.abi, BUSD_CONTRACT_ADDRESS);

    window.document.getElementById('loadingPercent').innerHTML = "8%";
    
    const addressAccount = await getAccount();

    const chainID = await window.web3.eth.getChainId();

    window.document.getElementById('loadingPercent').innerHTML = "10%";

    // Donation Balance
    const donationBalance = await getDonationBalance(addressAccount, ContractST);

    // BUSD
    const busdBalance = await getBUSDbalance(addressAccount, ContractST);

    // Saver
    const saverBalance = await getSaverBalance(addressAccount, ContractST);

    // DAI
    const daiBalance = await getDAIbalance(addressAccount, ContractST);

    window.document.getElementById('loadingPercent').innerHTML = "25%";
    
    // Reward
    const futureRewardAmount = await getFutureReward(ContractST);
    const futureAmountToClaim = await getAmountToClaim(ContractST, futureRewardAmount, addressAccount);

    window.document.getElementById('loadingPercent').innerHTML = "28%";

    const rewardAmountRaised = await getActualRewardRaised(ContractST);
    const actualRewardAmount = await getActualAmountReward(ContractST);
    const actualAmountToClaim = await getAmountToClaim(ContractST, rewardAmountRaised, addressAccount);

    window.document.getElementById('loadingPercent').innerHTML = "35%";
    
    const bddQualifiedWEI = await ContractST.methods.qualifiedDonationBalance().call();
    const bddQualified = await window.web3.utils.fromWei(bddQualifiedWEI, 'ether');
    
    window.document.getElementById('loadingPercent').innerHTML = "40%";

    const rewardIDonClaim = await ContractST.methods.rewardIDonClaim().call();
    const alreadyClaim = await ContractST.methods.holderClaimed(addressAccount, rewardIDonClaim).call();
    const userQualified = await ContractST.methods.canReclaim(addressAccount).call();
    const claimFrom = await ContractST.methods.claimFrom(addressAccount).call();
    const canClaim = ( (Number(claimFrom) <= Number(rewardIDonClaim)) && !alreadyClaim && userQualified && (actualAmountToClaim <= actualRewardAmount) );

    window.document.getElementById('loadingPercent').innerHTML = "60%";

    // Timestamp
    const timestampOpenReward = await getTimestampToNextReward(ContractST);
    window.document.getElementById('loadingPercent').innerHTML = "70%";

    const timestampNow = await getActualTimestamp();
    window.document.getElementById('loadingPercent').innerHTML = "80%";

    const timestampToClaimSaver = await getTimestampToClaimSaver(ContractST, addressAccount);
    window.document.getElementById('loadingPercent').innerHTML = "90%";

    const timer = getHoursToNextReward(timestampNow, timestampOpenReward);
    window.document.getElementById('loadingPercent').innerHTML = "100%";

    return {
        donationBalance, busdBalance, saverBalance, 
        rewardAmountRaised, actualRewardAmount, actualAmountToClaim, futureAmountToClaim,
        futureRewardAmount, timestampOpenReward, ContractST, addressAccount,
        timestampNow, SAVER_TOKEN_CONTRACT_ADDRESS, ContractBUSD, BUSD_CONTRACT_ADDRESS,
        timestampToClaimSaver, alreadyClaim, bddQualified, timer, canClaim, userQualified,
        daiBalance, chainID
    };
};

export const getDataWeb3 = async () => 
{
    // await loadWeb3();

    const ContractST = new Contract(SaverToken.output.abi, SAVER_TOKEN_CONTRACT_ADDRESS);

    // Web3
    const tokensCirculation = await getTotalSupply(ContractST);
    const StableCoinDistribute = await getStableCoinDistribute(ContractST);
    const StableCoinLastDistribute = await getLastStableCoinDistribute(ContractST);
    const SaverPrice = await getSaverPrice();
    const SaverMinted = await getSaverMinted(ContractST);
    const { holders } = await getHolders(ContractST);

    return { tokensCirculation, StableCoinDistribute, holders, StableCoinLastDistribute, SaverPrice, SaverMinted };
};

export const loadWeb3 = async () => 
{
    // Modern dapp browsers...
    if (window.ethereum) 
    {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            // await ethereum.enable();
            // Acccounts now exposed
            await ethereum.request({method: 'eth_requestAccounts'})
        } catch (error) {
            // User denied account access...
            console.log('Error: requiring browser wallet: ', error);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) 
    {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else 
    {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
   
};