import { NextApiRequest, NextApiResponse } from "next"

export type FormData = any

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FormData>
) {
  if (req.method === 'OPTIONS') {
    res.status(200).send({})
    return
  } else {
    const method = req.method
    const url = req.query.path as string
    const base = "https://beta-hub.tfaforms.net/"
    const fullUrl = `${base}${url}`
    // fetch the url and return the response
    fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.text())
      .then(data => {
        res.status(200).send(data)
      })
      .catch(error => {
        res.status(500).json({ error: 'Error fetching data' });
      })

    }
}
