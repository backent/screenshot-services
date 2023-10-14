const express = require('express')
const { screenshot } = require('./services')
const app = express()
const port = 3000

app.get('/', async (req, res) => {
  const token = req.query.token ?? ''
  const pageUrl = req.query.url ?? ''
  const targetDomain = req.query.domain ?? ''
  const cookies = [
    {
        name: '_aorionescreen',
        value: token,
        url: targetDomain
    }
  ]
  const selector = '.cs-content .p-card-body'
  console.log({ cookies, query: req.query })
  const pdf = await screenshot(pageUrl, cookies, selector)
  res.contentType('application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=output.pdf');
  res.send(pdf)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})