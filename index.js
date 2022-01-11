const PORT = process.env.PORT || 8000 //pour déploiement heroku (sinon const PORT = 8000)
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

const websites = [
    {
       name: 'developpez.com',
       address: 'https://javascript.developpez.com/', 
    }
];

const articles = []

websites.forEach(website =>{
        axios.get(website.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Vue.js")', html).each(function(){
                const title = $(this).text().trim()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: website.name
                })
            })
        })    
})

app.get("/news", (req, res) => {
    res.json(articles)
})

app.get("/news/:websiteId", (req, res) =>{
    const websiteId = req.params.websiteId
    const websiteAddress = websites.filter(website => website.name == websiteId)[0].address

    axios.get(websiteAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("Vue")', html).each(function(){
            const title = $(this).text().trim()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url,
                source: websiteId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))    
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))