module.exports =
{ existingValidUser:
  { password: 'passw0rd'
  , email: 'dom@synthmedia.co.uk'
  , username: 'domudall'
  }
, newValidUser:
  { password: 'passw0rd'
  , email: 'dom-new@synthmedia.co.uk'
  , username: 'domudall-new'
  }
, invalidNoPasswordUser:
  { email: 'dom-nopass@synthmedia.co.uk'
  , username: 'domudall-nopass'
  }
// , validFacebookUser:
//   { facebook:
//     { id: '556677' }
//   , email: 'dom-facebook@synthmedia.co.uk'
//   , username: 'fb:556677'
//   , provider: 'facebook'
//   }
, validGithubUser:
  { github:
    { id: '556677' }
  , email: 'dom-github@synthmedia.co.uk'
  , username: 'gh:556677'
  , provider: 'github'
  }
, invalidUser:
  { }
}