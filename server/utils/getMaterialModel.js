const types = {
  // folder: require('../models/folder.model'),
  glossary: require('../models/glossary.model'),
  // cardSet: require('../models/cardSet.model'),
  // questionBank: require('../models/questionBank.model'),
  // test: require('../models/test.model'),
  // article: require('../models/article.model'),
}

module.exports = function(type) {
  return types[type]
}
