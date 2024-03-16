import express from "express"
import data from "./data.json" assert { type: "json" }

const app = express()
const port = 3000 || process.env.PORT

app.get("/", (req, res) => {
    res.send(data)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
