// generate a proxy to consume https://beta-hub.tfaforms.net/141?did=test42123
// the 141 is the form id
// and the query param did is the unique identifier for the user

import { NextApiRequest, NextApiResponse } from "next"

export type FormData = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FormData>
) {
  if (req.method === 'OPTIONS') {
    res.status(200).send({})
    return
  } else if (req.method !== 'GET') {
    res.status(404).send({})
    return
  } else {

    const { formID } = req.query
    const did = req.query.did || 'test123'
    const _accessToken = req.query.accessToken || "HQi0EBrcUjBwssr8XsbShy4mC5YmJSqx"
    
    const url = `https://beta-hub.tfaforms.net/api_v1/forms/view/${formID}.json?access_token=${_accessToken}`


    if(!formID) {
      res.status(400).json({ error: 'Missing formID parameter' });
      return;
    }

    if(!did) {
      res.status(400).json({ error: 'Missing did parameter' });
      return;
    }

    // fetch the url and return the response
    await fetch(url)
      .then(response => response.text())
      .then(data => {
        res.status(200).send(data)
      })
      .catch(error => {
        res.status(500).json({ error: 'Error fetching data' });
      })

  }
}