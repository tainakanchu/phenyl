const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const debug = require('debug')('inline-asset')

const indexPath = path.join(__dirname, '..', 'build', 'index.html')
const $ = cheerio.load(fs.readFileSync(indexPath, 'utf8'))

// Embed extracted CSS
$('link[rel="stylesheet"]').each((i, el) => {
  const href = cheerio(el).attr('href')
  // Preserve external css
  if (/^https?/.test(href)) {
    debug(`Preserve ${href}`)
    return
  }

  const assetPath = path.join(__dirname, '..', 'build', href)
  const content = fs.readFileSync(assetPath, 'utf8')
  $('<style></style>').text(content).appendTo('head')

  debug(`Remove ${assetPath}`)
  cheerio(el).remove()     // Remove from HTML
  fs.unlinkSync(assetPath) // Remove file
})

// Embed extracted JavaScript
$('script[src]').each((i, el) => {
  const assetPath = path.join(__dirname, '..', 'build', cheerio(el).attr('src'))
  const content = fs.readFileSync(assetPath, 'utf8')
  $('<script></script>').text(content).appendTo('body')

  debug(`Remove ${assetPath}`)
  cheerio(el).remove()     // Remove from HTML
  fs.unlinkSync(assetPath) // Remove file
})

// Inject entities
const entitiesDefinition = cheerio('<script></script>').text(`
  const EntitiesDefinition = <%- JSON.stringify({
    customQueries: Object.keys(@functionalGroup.customQueries),
    customCommands: Object.keys(@functionalGroup.customCommands),
    users: Object.keys(@functionalGroup.users),
    nonUsers: Object.keys(@functionalGroup.nonUsers),
  }) %>
`)
$('script').eq(0).before(entitiesDefinition)

fs.writeFileSync(indexPath, $.html(), 'utf8')
