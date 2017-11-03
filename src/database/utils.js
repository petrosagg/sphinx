const parseScore = exports.parseScore = (str) => {
  const postponed = /P\s*-\s*P/g

  if (postponed.test(str)) {
    return [ true, null, null ]
  }

  const re = /([0-9]+)\s*-\s*([0-9]+)/g

  let home, away
  while (true) {
    const score = re.exec(str)
    if (!score) {
      break
    }
    [ home, away ] = score.slice(1).map(Number)
  }

  return [ false, home, away ]
}

exports.parseMatch = ($, match) => {
  try {
    const homeTeam = $('.team2', match).text() || $('.team4', match).text()
    const homeUrl = $('.team2 a', match).attr('href') || $('.team4 a', match).attr('href')
    const awayTeam = $('.team3', match).text() || $('.team5', match).text()
    const awayUrl = $('.team3 a', match).attr('href') || $('.team5 a', match).attr('href')
    const timestamp = $('.data.timezone', match).attr('data-timestamp')

    const url = $('.dash a.matchAction', match).attr('href')
    const [ postponed, scoreHome, scoreAway ] = parseScore($('.dash', match).text())

    let friendly = false
    if ($('.comp a', match).attr('title')) {
      friendly = $('.comp a', match).attr('title').indexOf('Friend') !== -1
    }

    return {
      id: url,
      home: {
        id: homeUrl,
        name: homeTeam
      },
      away: {
        id: awayUrl,
        name: awayTeam
      },
      postponed: postponed,
      friendly: friendly,
      homeScore: scoreHome,
      awayScore: scoreAway,
      timestamp: timestamp
    }
  } catch (e) {
    throw new Error('Error ' + e + " Couldn't parse " + $(match).html())
  }
}
