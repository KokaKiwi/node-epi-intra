var rest = require('restler'),
    _ = require('underscore'),
    cookie = require('cookie'),
    cheerio = require('cheerio');

var intra = module.exports = {};

intra.WS_URL = 'https://www.epitech.eu/intra/ws.php';
intra.BASE_URL = 'https://www.epitech.eu/intra';

var EpiSession = intra.Session = function(login)
{
    this._login = login;
    this.sid = null;
};

EpiSession.prototype.login = function(password, callback)
{
    var self = this;
    rest.get(intra.WS_URL, {
        query: {
            action: 'login',
            login: this._login,
            pass: password
        }
    }).on('complete', function(data, res) {
        if (res && res.statusCode == 200)
        {
            var json = JSON.parse(data);
            if (json.login.status.state == 'OK')
            {
                self.sid = json.login.data.sid;
                callback(null);
            }
            else
            {
                callback(json.login.status.desc);
            }
        }
    });
};

EpiSession.prototype.get = function(path, options, callback)
{
    var self = this;
    if (!callback)
    {
        callback = options;
        options = {};
    }
    rest.get(intra.BASE_URL + path, {
        query: options,
        headers: {
            'Cookie': cookie.serialize('intra_sid', this.sid)
        }
    }).on('complete', callback);
};

EpiSession.prototype.notes = function(who, callback)
{
    var self = this;
    var options = {
        section: 'etudiant',
        page: 'rapport',
        login: who
    };
    this.get('/', options, function(data, res) {
        var $ = cheerio.load(data);
        var rows = $('div#div1 > table > tr');
        var notes = [];
        rows.each(function(i, row) {
            var cols = $(this).find('td');

            var note = {
                date: cols.eq(0).text().trim(),
                module: cols.eq(1).text().trim(),
                name: cols.eq(2).text().trim(),
                value: parseFloat(cols.eq(3).text().trim()),
                comments: cols.eq(4).text().trim()
            };

            notes.push(note);
        });
        callback(notes);
    });
};

EpiSession.prototype.modules = function(who, callback)
{
    var self = this;
    var options = {
        section: 'etudiant',
        page: 'rapport',
        login: who
    };
    this.get('/', options, function(data, res) {
        var $ = cheerio.load(data);
        var rows = $('div#div9 > table > tr');
        var modules = [];
        rows.each(function(i, row) {
            var cols = $(this).find('td');
            var reward = $(this).find('td > img', 0);

            if (cols.length == 8)
            {
                var _module = {
                    code: cols.eq(0).text().trim(),
                    name: cols.eq(1).text().trim(),
                    profs: cols.eq(2).text().trim().split(/[,;]/),
                    credits: parseInt(cols.eq(3).text().trim()),
                    infos: cols.eq(4).text().trim(),
                    status: cols.eq(5).text().split('/')[0].trim(),
                    grade: cols.eq(5).text().split('/')[1].trim(),
                    reward: null
                };

                if (reward.length > 0)
                {
                    _module.reward = reward.attr('title');
                }

                modules.push(_module);
            }
        });
        callback(modules);
    });
};
