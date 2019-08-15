// 'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {check, validationResult} = require('express-validator');
const fileSystem = require('fs');
const crypto = require('crypto');
const csrf = require('csurf');
const app = express();
const port = 3000;

// setup route middlewares
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');
app.use(express.static('public'));

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

const VoteData = require('./classess/vote_data.js');

/**;
 * top page
 */
app.get('/', csrfProtection, function (req, res) {
    res.render('index', {
        title: '集計さん',
        description: '集計さんはURLをメンバーに送るだけで、投票結果を集計できるツールです。',
        csrfToken: req.csrfToken()
    });
});

/**;
 * Create syukei data
 */
app.post('/create', [
    check('name').isLength({min: 3})
], parseForm, csrfProtection, (req, res) => {
    // Finds the validation errors in this request
    const errors = validationResult(req);

    // Generate file name;
    let hrTime = process.hrtime();
    // Not reuse digest
    //  ref. https://stackoverflow.com/questions/44855529/using-crypto-node-js-library-unable-to-create-sha-256-hashes-multiple-times-in
    let sha1Hash = crypto.createHash('sha1').update(hrTime[1] + req.body.name + req.data).digest('hex');
    // Generate dirPath;
    let dirPath = 'data/' + sha1Hash.slice(0, 2) + '/' + sha1Hash.slice(3, 5);
    // Create Dirs
    fileSystem.mkdirSync(dirPath, {recursive: true}, function (err) {
        // nothing
    });
    // Write to file
    fileSystem.writeFileSync(dirPath + '/' + sha1Hash, JSON.stringify(req.body), function (err) {
        if (err) {
            throw err;
        }
    });
    res.redirect(req.baseUrl + '/form/' + sha1Hash + '/');
});

/**;
 * Voting Form
 */
app.get('/form/:id/', csrfProtection, function (req, res) {
    // Generate file path
    let filePath = 'data/' + req.params.id.slice(0, 2) + '/' + req.params.id.slice(3, 5) + '/' + req.params.id;
    // Voting data
    const form = JSON.parse(fileSystem.readFileSync(filePath, {encoding: "utf-8"}));
    res.render('form', {
        id: req.params.id,
        data: form.data.split(/\n/),
        title: '集計フォーム - 集計さん',
        description: '', csrfToken: req.csrfToken()
    });
});

/**;
 * Aggregate Result data
 */
app.post('/result/:id/', parseForm, csrfProtection, function (req, res) {
    let votingData = new VoteData(req.params.id);
    let data = votingData.data();
    // vote {req.body.key}
    votingData.vote(req.body.key)
    res.render('result', {
        data: votingData.sortData(),
        name: votingData.name(),
        title: '集計結果 - 集計さん',
        description: ''
    });
});

/**
 * View result data
 */
app.get('/result/:id/', function (req, res) {
    let votingData = new VoteData(req.params.id);
    let data = votingData.data();
    res.render('result', {
        data: votingData.sortData(),
        name: votingData.name(),
        title: '集計結果 - 集計さん',
        description: ''
    });
});

/**;
 * Term
 */
app.get('/term', function (req, res) {
    res.render('term', {title: '利用規約 - 集計さん', description: ''});
});
app.listen(port, () => console.log('listening on port 3000!'));