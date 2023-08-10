/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from "react";


//Create the Typescript validation
type ApiResponse = {
    title: string;
    image: string;
    questions: [];
};

type ConnectResponse = {
    state: boolean;
    body: ApiResponse | null;
};
////

export const useConnect = () => {
    const [Resp, setResp] = useState<ConnectResponse>({
        state: false,
        body: null
    })
    //Create the connection of the api, i copy the your Api and change the title and images
    const connectApi = async () => {
        const url = 'https://raw.githubusercontent.com/joacolinares/JSONChallenge/main/survey-sample.json'
        const resp = await fetch(url)
        const respFinal = await resp.json()
        setResp({
            state: true,
            body: respFinal
        })
    }






    return {
        Resp, connectApi
    };
};