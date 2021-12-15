/**
 * @param {String} s Input string.
 * @param {Object} options Options.
 * @param {Object.<string,any>} options.vars Variables: {varname:format}
 * @param {Array} options.args Arguments: %0, %1, %2...
 * @param {CallableFunction} options.fmt Format function: fmt(varname, format)
 */
function deref(s, options={})
{
    const vars = options.vars ?? process.env;
    const args = options.args ?? [];
    const fmt = options.fmt ?? (_ => _);
    const lnd = '\\p{L}\\p{Nd}', wb = `([^${lnd}]+)`;
    const regex = RegExp(`(\\{([\\S]*?)\\})|\\\\(.)|${wb}%([0-9]+)${wb}`, 'giu');
    let match = null, result = '', index = 0; s = ` ${s} `;
    while (match = regex.exec(s)) {
        result += s.slice(index, match.index);
        index = match.index + match[0].length;
        //console.log(match);
        if (match[1]) { // vars
            if (match[2]) {  // '{var}'
                const v = match[2].split(':'), vn = vars[v[0]];
                result += vn ? (v[1] ? fmt(vn, v[1]) : vn) : match[1];
            } else result += '{}'; // '{}' -> '{}' (empty)
        } else if (match[5]) { // args
            const arg = args[Number.parseInt(match[5])];
            if (arg) { result += `${match[4]}${arg}`; if (match[6])
            { index -= match[6].length; regex.lastIndex -= match[6].length; }
            } else result += match[0];  // ignore
        } else result +=  // escape sequence
            match[3] ==  'n' ?  '\n' :  // newline (U+000A LINE FEED; LF)
            match[3] ==  'r' ?  '\r' :  // carriage return (U+000D CARRIAGE RETURN; CR)
            match[3] ==  'v' ?  '\v' :  // vertical tab (U+000B LINE TABULATION)
            match[3] ==  't' ?  '\t' :  // tab (U+0009 CHARACTER TABULATION)
            match[3] ==  'b' ?  '\b' :  // backspace (U+0008 BACKSPACE)
            match[3] ==  'f' ?  '\f' :  // form feed (U+000C FORM FEED)
            match[3] ==  '%' ?   '%' :  // '%'
            match[3] ==  '{' ?   '{' :  // '{'
            match[3] ==  '}' ?   '}' :  // '}'
            match[3] == '\\' ?  '\\' :  // '\\'
            `\\${match[3]}`;  // invalid
    } return (result + s.slice(index)).slice(1, -1);
}

module.exports = deref;
