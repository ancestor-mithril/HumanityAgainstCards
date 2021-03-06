const passport       = require('passport'),
      GoogleStrategy = require('passport-google-oauth20'),
      keys           = require('./keys'),
      users          = require('./../../database/user');

passport.use(
    new GoogleStrategy({
                           //options for the google strategy
                           callbackURL: '/auth/google/redirect',
                           clientID: keys.google.clientID,
                           clientSecret: keys.google.clientSecret
                       },
                       (accessToken, refreshToken, profile, done) => {
                           //passport callback function
                           console.log(profile);

                           let user_obj = {
                               username: profile.displayName,
                               nickname: profile.displayName,
                               email: 'unknown@gmail.com',
                               games_played: 0,
                               games_won: 0,
                               session: {
                                   value: profile.id,
                                   expire: Date.now() + 1000 * 60 * 60 * 24
                               }
                           };

                           users.register(user_obj);

                       })
);