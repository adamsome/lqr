export function parseCsvLine(line) {
  var validRegex =
    /^\s*(?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,"\s\\]*(?:\s+[^,"\s\\]+)*)\s*(?:,\s*(?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,"\s\\]*(?:\s+[^,"\s\\]+)*)\s*)*$/
  var valueRegex =
    /(?!\s*$)\s*(?:"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,"\s\\]*(?:\s+[^,"\s\\]+)*))\s*(?:,|$)/g
  if (!validRegex.test(line)) {
    console.error(`Invalid CSV line: ${line}`)
    return null
  }
  var result = []
  line.replace(valueRegex, (_, escDoubleQuote, value) => {
    if (escDoubleQuote !== undefined) {
      // Remove backslash from \" in double quoted values.
      result.push(escDoubleQuote.replace(/\\"/g, '"'))
    } else if (value !== undefined) {
      result.push(value)
    }
    return ''
  })
  // Handle special case of empty last value.
  if (/,\s*$/.test(line)) result.push('')
  return result
}
