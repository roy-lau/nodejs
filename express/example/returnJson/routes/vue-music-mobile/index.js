var axios = require('axios')

module.exports = {
    getDiscList: function(req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
            headers: {
                referer: 'https://c.y.qq.com',
                host: 'c.y.qq.com'
            },
            params: req.query
        }).then((response) => {
            res.json(response.data)
        }).catch((e) => {
            console.error(e)
        })
    },
    lyric: function(req, res) {
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
            headers: {
                referer: 'https://c.y.qq.com',
                host: 'c.y.qq.com'
            },
            params: req.query
        }).then((response) => {
            var ret = response.data
            if (typeof ret === 'string') {
                var reg = /^\w+\(({[^()]+})\)$/
                var matches = ret.match(reg)
                if (matches) {
                    ret = JSON.parse(matches[1])
                }
            }
            res.json(ret)
            // res.json(response.data)
        }).catch((e) => {
            console.error(e)
        })
    }
}