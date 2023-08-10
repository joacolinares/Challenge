
"use client"

import { useEffect, useState } from "react";

import Quiz from './quiz/page';

import { useBlockchain } from "../hooks/useBlockchain";
import { useConnect } from "../hooks/useConnect";
import Loading from "../Loading/Loading";
export default function Page() {
    //Extract the balance of useBlockchain()
    const { balance } = useBlockchain();

    const [Start, setStart] = useState(false)
    //Connect to the Api
    const { connectApi, Resp } = useConnect()

    useEffect(() => {
        connectApi()
    }, [])

    return (
        <>
            { //If the person start show <Quiz/>
                Start
                    ?
                    <Quiz />
                    :
                    <>
                        <div style={{ border: "1px solid", padding: "25px", borderRadius: "15px", width: "50%" }}>
                            {Resp.state && Resp.body !== null ? (
                                <>
                                    {Resp.state
                                        &&
                                        <>
                                            <div style={{ paddingBottom: "10%" }}>
                                                <p style={{ paddingLeft: "50%" }}>$QUIZ: {balance}</p>
                                                <hr />
                                                <h2>{Resp.body.title}</h2>
                                                <img style={{ width: "75%" }} src={Resp.body.image} alt="" />
                                            </div>
                                            {/*When press the start button the Start change to true*/}
                                            <button onClick={() => { setStart(true) }} className='botonStart' >Start</button>
                                        </>
                                    }
                                </>
                            ) : (
                                <Loading />
                            )}
                        </div>
                    </>
            }


        </>
    )
}
