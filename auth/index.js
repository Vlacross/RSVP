module.exports = { authRouter: require('./router'),
                   tokenStrat: require('./passport').tokenStrat,
                   localStrat: require('./passport').localStrat }