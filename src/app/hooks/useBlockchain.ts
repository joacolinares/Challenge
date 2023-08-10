/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from "react";


import contractABIQuiz from '../blockchain/Quiz.json'
const contractQuiz = "0xfDA7728E6610F251B7Fc9Fb43FfbF965a8a9ab66"



export const useBlockchain = () => {
    const [balance, setBalance] = useState<number>(0)
    const [id, setId] = useState<number | null>(null);
    const [Message, setMessage] = useState<string | undefined>();
    const [Connected, setConnected] = useState<boolean>(false);
    const [Change, setChange] = useState<boolean>(false);

    const [Names, setNames] = useState<string[]>([])
    const [Answers, setAnswers] = useState<number[]>([])

    useEffect(() => {
        const blockchainHooks = async () => {

            window.web3 = new Web3(window.ethereum);

            //Get the ID of the network
            const netId = await web3.eth.net.getId();
            setId(netId)

            //Get the account
            const accounts = await window.ethereum.request({
                "method": "eth_accounts",
                "params": []
            });
            //Get the contrat with the ABI and Address
            const contract = new web3.eth.Contract(contractABIQuiz, contractQuiz)
            const balance = await contract.methods.balanceOf(accounts[0]).call()
            const etherbalance = Web3.utils.fromWei(balance, 'ether');
            setBalance(etherbalance)
        }
        blockchainHooks()
    }, []);


    /////////////////////////
    //Request the account of the user and check the network
    const requestAccount = async () => {


        // Check if Meta Mask Extension exists 
        if (window.ethereum) {

            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                //Check if the netId = 80001, this id is the Mumbai  ID
                if (id === 80001) {
                    setMessage(`Welcome back ${accounts[0]}`)
                    setTimeout(() => {
                        setConnected(true)
                    }, 1000);
                } else {
                    setChange(true)
                    setMessage(`You need to change the network...`)
                }
            } catch (error) {
                setMessage("Please accept connect the wallet")
            }
        } else {
            setMessage(`Install Metamask`)
        }
    }
    /////////////////////////



    /////////////////////////
    //Change network
    const changeNetWork = async () => {
        await window.ethereum.request({
            "method": "wallet_switchEthereumChain",
            "params": [
                {
                    "chainId": "0x13881"
                }
            ]
        });
        setId(80001)
        setChange(false)
        setMessage(`Press the button again`)
    }
    /////////////////////////

    //Send to the contract validation, i recib the actualId and put to the id and put the Answers of the user
    const send = async () => {

        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            window.web3 = new Web3(window.ethereum);

            const contract = new web3.eth.Contract(contractABIQuiz, contractQuiz)
            const actualId = await contract.methods.getsurveyId().call()
            const result = await contract.methods.submit(actualId, Answers)
                .send({ from: accounts[0], gas: 0, value: 0 })
                .on('receipt', async function (receipt) {
                    const balance = await contract.methods.balanceOf(accounts[0]).call()
                    const etherbalance = Web3.utils.fromWei(balance, 'ether');
                    setBalance(etherbalance)
                })
        }
    }





    return {
        id, balance, requestAccount, Message, Connected, Change, changeNetWork, send, Names, setNames, setAnswers, Answers
    };
};