import { NextApiRequest, NextApiResponse } from "next";
import MongoServiceSingleton from "@/services/mongoService";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const userId = req.query.userId as string
    MongoServiceSingleton.generateSSOToken(userId)
    .then(() => {
        return MongoServiceSingleton.returnSSOToken(userId)
    }).then((result) => {
        if(result) res.status(200).send({ssoToken: result.ssoToken})
        else res.status(500).send({error: "user not found, CODE C09212"})
    }).catch((err) => {
        res.status(500).send({error: err})
    })
}