import { NextApiRequest, NextApiResponse } from "next";
import MongoServiceSingleton from "@/services/mongoService";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const saveToken = req.query.saveToken as string
    const getBody = req.body
    MongoServiceSingleton.getUserBySaveToken(saveToken)
    .then((user) => {
      if(user) {
        return MongoServiceSingleton.addOrUpdateUserProgress(user.userId,saveToken,getBody)
      } else {
        res.status(500).send({error: "user not found, CODE B32628"})
      }
    }).then(() => {
        res.status(200).send({result: "success"})
    }).catch((err) => {
        res.status(500).send({error: "user not found, CODE B26251"})
    })
}