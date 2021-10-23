const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()
const newsEsports = [
    {
        name: 'esports.com',
        address: 'https://www.esports.com/en/valorant/news',
        base: 'https://www.esports.com'

    },
    {
        name: 'dotesports',
        address: 'https://dotesports.com/',
        base : 'https://dotesports.com/'
    },
    {
        name: 'talkesports',
        address: 'https://www.talkesport.com/news/',
        base: 'https://www.talkesport.com/news/'
    },
]
const articles = []

newsEsports.forEach(news => {
    axios.get(news.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html, {
                xmlMode: true,
                lowerCaseAttributeNames: false
            })
            $('a:contains("VALORANT")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                    articles.push({
                        source : news.name,
                        title,
                        url : news.base + url,
                    })
            })
        })
})
app.get('/', (req, res) => {
    res.send({
        "welcome": "Welcome to esports news API"
    })
})

app.get('/news', (req, res) => {
    res.send(articles)
})

app.get('/news/:newsId', async (req,res)=>{
    const newsPaperId =  req.params.newsId;
    const newspaperAddress = newsEsports.filter(news => news.name == newsPaperId)[0].address
    const newsPaperBase = newsEsports.filter(news => news.name == newsPaperId)[0].base
    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $('a:contains("Valorant")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                    specificArticles.push({
                        source : newsPaperId,
                        title,
                        url : newsPaperBase + url,
                    })
            })
            res.json(specificArticles)
        })
})


app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`)
})