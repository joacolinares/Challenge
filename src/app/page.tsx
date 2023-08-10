
"use client"

import { useEffect, useState } from "react";
import Page from "./Components/page";

import { useBlockchain } from './hooks/useBlockchain'

export default function Home() {

  //Extract to useBlockchain() = requestAccount (Get the account() and verifiy the network), Message (Change de message), //Connected (Verify is the user is connected)
  //changeNetWork() Function to change the network
  const { requestAccount, Message, Connected, Change, changeNetWork } = useBlockchain();

  return (
    <>
      <div className="App">
        <header className="App-header">
          { //If the user not are connected show the Connect Wallet button or Change Network button, if the user is connected show the <Page/> 
            Connected
              ?
              <>
                <Page />
              </>
              :
              <>
                <h1 style={{ fontSize: "75%" }}>{Message}</h1>
                {
                  Change
                    ?
                    <button style={{ marginBottom: "2%" }} className='boton' onClick={changeNetWork}>Change Network</button>
                    :
                    <button className='boton' onClick={requestAccount}>Connect Wallet</button>
                }

              </>
          }
        </header>
      </div>

    </>
  )
}
