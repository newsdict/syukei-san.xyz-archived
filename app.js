// 'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const valueScheme = require('value-schema');
const cookieParser = require('cookie-parser');
const fileSystem = require('fs');
const crypto = require('crypto');
const csrf = require('csurf');
const app = express();
const port = 3000;

// setup route middlewares
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});
const expressSanitizer = require('express-sanitizer');

require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000
    }
}));

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());
// Mount express-sanitizer middleware here
app.use(expressSanitizer())

const createErrorMessage = require('./libs/create_error_message.js');
const voteData = require('./libs/vote_data.js');
const validationSchemes = require('./libs/shemes');
const tagHelper = require('./helpers/tag_helper.js');
const formHelper = require('./helpers/form_helper.js');

/**;
 * top page
 */
app.get('/', csrfProtection, function (req, res) {
    res.render('index', {
        title: '集計さん',
        description: '集計さんはURLをメンバーに送るだけで、投票結果を集計できるツールです。',
        csrfToken: req.csrfToken(),
        formHelper: new formHelper(req)
    });
});

/**;
 * Create syukei data
 */
app.post('/create', parseForm, csrfProtection, (req, res) => {
    // sanitize
    const voteDataInstance = new voteData();
    let sanitizedData = voteDataInstance.sanitizeData(req);
    // Validation
    let createErrorMessageInstance = new createErrorMessage('keyStack');
    valueScheme.fit(sanitizedData, validationSchemes.createVoteData, function (_error) {
        createErrorMessageInstance.add(_error);
    });
    // Log error message to session
    let errorMessages = createErrorMessageInstance.getMessages();
    if (errorMessages.length) {
        req.session.errorMessages = errorMessages;
        req.session.body = req.body;
        return res.redirect(req.baseUrl + '/');
    } else {
        req.session.destroy();
    }
    // Generate file name;
    let hrTime = process.hrtime();
    // Not reuse digest
    //  ref. https://stackoverflow.com/questions/44855529/using-crypto-node-js-library-unable-to-create-sha-256-hashes-multiple-times-in
    let sha1Hash = crypto.createHash('sha1').update(hrTime[1] + sanitizedData).digest('hex');
    // Generate dirPath;
    let dirPath = 'data/' + sha1Hash.slice(0, 2) + '/' + sha1Hash.slice(3, 5);
    // Create Dirs
    fileSystem.mkdirSync(dirPath, {recursive: true}, function (err) {
        // nothing
    });
    // Remove white space
    sanitizedData.data = sanitizedData.data.split(/\r?\n/).filter(v => v);
    // Write to file
    fileSystem.writeFileSync(dirPath + '/' + sha1Hash, JSON.stringify(sanitizedData), function (err) {
        if (err) {
            throw err;
        }
    });
    return res.redirect(req.baseUrl + '/form/' + sha1Hash + '/');
});

/**;
 * Voting Form
 */
app.get('/form/:id/', csrfProtection, function (req, res) {
    let voteDataInstance = new voteData(req.params.id);
    // Generate file path
    let filePath = 'data/' + req.params.id.slice(0, 2) + '/' + req.params.id.slice(3, 5) + '/' + req.params.id;
    // Voting data
    const form = JSON.parse(fileSystem.readFileSync(filePath, {encoding: "utf-8"}));
    res.render('form', {
        id: req.params.id,
        data: voteDataInstance.data().data,
        title: '集計フォーム - 集計さん',
        description: '',
        csrfToken: req.csrfToken()
    });
});

/**;
 * Aggregate Result data
 */
app.post('/result/:id/', parseForm, csrfProtection, function (req, res) {
    let voteDataInstance = new voteData(req.params.id);
    // vote {req.body.key}
    voteDataInstance.vote(req.body.key)
    res.render('result', {
        data: voteDataInstance.sortData(),
        name: voteDataInstance.name(),
        title: '集計結果 - 集計さん',
        description: '',
        tagHelper: new tagHelper()
    });
});

/**
 * View result data
 */
app.get('/result/:id/', function (req, res) {
    let voteDataInstance = new voteData(req.params.id);
    res.render('result', {
        data: voteDataInstance.sortData(),
        name: voteDataInstance.name(),
        title: '集計結果 - 集計さん',
        description: '',
        tagHelper: new tagHelper()
    });
});

/**;
 * Term
 */
app.get('/term', function (req, res) {
    res.render('term', {title: '利用規約 - 集計さん', description: ''});
});
app.listen(port, () => console.log('listening on port 3000!'));