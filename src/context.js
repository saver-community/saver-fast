import React from "react";

const SaverContext = React.createContext(null);

export const SaverProvider = (props) => 
{

    // Info Page
    const [saverCirculation, setSaverCirculation] = React.useState(null);
    const [saverHolders, setSaverHolders] = React.useState(null);
    const [busdDistributed, setBusdDistributed] = React.useState(null);
    const [lastBusdDistributed, setLastBusdDistributed] = React.useState(null);
    const [saverPrice, setSaverPrice] = React.useState(null);
    const [saverMinted, setSaverMinted] = React.useState(null);

    // Dapp
    const [account, setAccount] = React.useState(null);
    const [chainID, setChainID] = React.useState(null);
    const [contractBUSD, setContractBUSD] = React.useState(null);
    const [contractBUSDaddress, setContractBUSDaddress] = React.useState(null);
    const [contractSaver, setContractSaver] = React.useState(null);
    const [contractSaverAddress, setContractSaverAddress] = React.useState(null);
    const [rewardAmountRaised, setRewardAmountRaised] = React.useState(null);
    const [actualRewardAmount, setActualRewardAmount] = React.useState(null);
    const [actualAmountToClaim, setActualAmountToClaim] = React.useState(null);
    const [futureRewardAmount, setFutureRewardAmount] = React.useState(null);
    const [futureAmountToClaim, setFutureAmountToClaim] = React.useState(null);
    const [timestampOpenReward, setTimestampOpenReward] = React.useState(null);
    const [timestampNow, setTimestampNow] = React.useState(null);
    const [amountBDD, setAmountBDD] = React.useState(null);
    const [amountBUSD, setAmountBUSD] = React.useState(null);
    const [amountSaver, setAmountSaver] = React.useState(null);
    const [amountDAI, setAmountDAI] = React.useState(null);
    const [timestampToClaimSaver, setTimestampToClaimSaver] = React.useState(null);
    const [alreadyClaim, setAlreadyClaim] = React.useState(null);
    const [canClaim, setCanClaim] = React.useState(null);
    const [bddQualified, setBDDQualified] = React.useState(null);
    const [timer, setTimer] = React.useState(null);
    const [userQualified, setUserQualified] = React.useState(null);

    const [actualRewardState, setActualRewardState] = React.useState({
        title: "REPARTIENDO",
        amountRaised: `${rewardAmountRaised} BUSD`,
        amountToClaim: `${ canClaim && !alreadyClaim ? actualAmountToClaim : '0.00' } BUSD`,
        actualAmount: `${actualRewardAmount} BUSD`
    });

    const [futureRewardState, setFutureRewardState] = React.useState({
        title: "RECAUDANDO",
        amountRaised: `${futureRewardAmount} BUSD`,
        amountToClaim: `${futureAmountToClaim} BUSD`,
        actualAmount: `${futureRewardAmount} BUSD`
    });


    const values = {
        saverCirculation, setSaverCirculation, saverHolders, setSaverHolders,
        busdDistributed, setBusdDistributed, lastBusdDistributed, setLastBusdDistributed,
        saverPrice, setSaverPrice, saverMinted, setSaverMinted, account, setAccount,
        chainID, setChainID, contractBUSD, setContractBUSD, contractBUSDaddress, setContractBUSDaddress,
        contractSaver, setContractSaver, contractSaverAddress, setContractSaverAddress, 
        rewardAmountRaised, setRewardAmountRaised, actualRewardAmount, setActualRewardAmount,
        actualAmountToClaim, setActualAmountToClaim, futureRewardAmount, setFutureRewardAmount,
        futureAmountToClaim, setFutureAmountToClaim, timestampOpenReward, setTimestampOpenReward,
        timestampNow, setTimestampNow, amountBDD, setAmountBDD, amountBUSD, setAmountBUSD,
        amountSaver, setAmountSaver, amountDAI, setAmountDAI, timestampToClaimSaver, setTimestampToClaimSaver,
        alreadyClaim, setAlreadyClaim, canClaim, setCanClaim, bddQualified, setBDDQualified, 
        timer, setTimer, userQualified, setUserQualified, actualRewardState, setActualRewardState,
        futureRewardState, setFutureRewardState
    };

    return <SaverContext.Provider value={values} {...props} /> 
}

export const useProvider = () => {
    const context = React.useContext(SaverContext);
    if (!context) throw new Error('useProvider debe estar dentro del provider');
    return context;
};