import { NextApiRequest, NextApiResponse } from "next";
import MongoServiceSingleton from "@/services/mongoService";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    // grab the ssoToken from the URL
    let result: any;
    const ssoToken = req.query.ssoToken as string
    MongoServiceSingleton.getUserBySSOToken(ssoToken)
    .then((r) => {
        result = r
        if(result && result.userId) return MongoServiceSingleton.removeSSOToken(result.userId)
        else res.status(500).send({error: "user not found, CODE A9882"})
    }).then(() => {
        res.status(200).send({result})
    }).catch((err) => {
        res.status(500).send({error: "user not found, CODE A2926"})
    })
    
   
}

