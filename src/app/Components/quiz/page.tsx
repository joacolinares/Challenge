
"use client"
import { useBlockchain } from '@/app/hooks/useBlockchain';
import { useEffect, useState } from "react";
import { useConnect } from '@/app/hooks/useConnect';
import Loading from '@/app/Loading/Loading';

//Create the Typescript validation
type Answer = number;
type Name = string;

interface Types {
    lifetimeSeconds: number;
    text: string;
    image: string;
    options: { text: string }[]
}


export default function Quiz() {
    //////Extract to useBlockchain() = balance (Get the Quiz balance), send (Send the Quiz to the Blockchain), Names,setNames, to put and change the name of the option select, and the Anwers to send the Answer
    const { balance, send, Names, setNames, setAnswers, Answers } = useBlockchain();

    //The number of the step is to know in what position it is
    const [Step, setStep] = useState(0)

    //Connnect the Api
    const { connectApi, Resp } = useConnect()
    useEffect(() => {
        connectApi()
    }, [])

    //This function checks if the time is up for the question
    useEffect(() => {
        if (Resp.state && Step <= 2 && Resp.body != null) {
            let actual = Step
            const question: Types = Resp.body.questions[Step];
            const seconds = question.lifetimeSeconds;
            const timer = setTimeout(() => {
                if (Step === actual) {
                    next();
                }
            }, seconds * 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [Step, Resp]);

    //Next question
    const next = () => {
        setStep(Step + 1)
    }

    //Save the answer
    const answer = (resp: Answer, name: Name) => {
        setNames([...Names, name])
        setAnswers([...Answers, resp])
    }
    if (Resp.body != null) {
        console.log(Step)
        console.log(Resp.body.questions.length)
    }
    return (
        <>
            <div style={{ border: "1px solid", padding: "30px", borderRadius: "15px", width: "50%" }}>
                {Resp.state && Resp.body != null
                    &&
                    <>
                        {
                            Step > Resp.body.questions.length - 1
                                ?
                                <>
                                    <p style={{ paddingLeft: "20%", display: "inline-block" }}>$QUIZ: {balance}</p>
                                    <br />
                                    {/*Display the answers*/}
                                    <h2>Answers</h2>
                                    <div style={{ display: "inline-block", marginRight: "2%" }}>  {Answers.map(a => (
                                        <p>{a}</p>
                                    ))}</div>

                                    <div style={{ display: "inline-block" }}>  {Names.map(a => (
                                        <p>{a}</p>
                                    ))}</div>

                                    <br />
                                    {/*Send to the contract button*/}
                                    <button onClick={send} className='botonNext' >SEND</button>
                                </>
                                :
                                <>
                                    {Resp.state && Resp.body !== null ? (
                                        <>
                                            <p style={{ display: "inline-block" }}>{Step + 1}/{Resp.body.questions.length}</p>  <p style={{ paddingLeft: "20%", display: "inline-block" }}>$QUIZ: {balance}</p>
                                            <hr />

                                            <h3 style={{ paddingBottom: "2%" }}>⏰ Time:  {(Resp.body.questions[Step] as Types).lifetimeSeconds}  seconds</h3>

                                            <h4>❓ {(Resp.body.questions[Step] as Types).text}</h4>
                                            <img src={(Resp.body.questions[Step] as Types).image} style={{ width: "30%", paddingBottom: "5%" }} alt="" />
                                            <br />
                                            {(Resp.body.questions[Step] as Types).options.map((resp, i) => (
                                                <button onClick={() => answer(i, resp.text)} className='botonOption' style={{ margin: "2%" }}>{resp.text} </button>
                                            )
                                            )}
                                            <br />
                                            {/*Next question*/}
                                            <button className='botonNext' onClick={next}>Next</button>
                                        </>
                                    ) : (
                                        <Loading />
                                    )}


                                </>
                        }
                    </>
                }

            </div>
        </>
    )
}
