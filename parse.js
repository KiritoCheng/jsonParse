function parse(data) {
    let offset = 0;
    let byte = " ";


    function next(c) {
        if (c && c != byte) {
            throw "Error"
        }
        byte = data.charAt(offset)
        offset++
        return byte
    }

    function isWhite(byte) {
        return byte == " " || byte == "\n" || byte == "\t" || byte == "\r"
    }
    function skipWhite() {
        while (byte && isWhite(byte)) {
            next()
        }
    }

    function parseValue() {
        skipWhite()

        switch (byte) {
            case "t":
                return parseTrue()
            case "f":
                return parseFalse()
            case "n":
                return parseNull()
            case "[":
                return parseArray()
            case "\"":
                return parseString()
            case "{":
                return parseObject()
            case numberParts[byte]:
                return parseNumber()
            default:
                throw "Error:no type"
        }

    }

    function parseTrue() {
        next("t")
        next("r")
        next("u")
        next("e")
        return true
    }

    function parseFalse() {
        next("f")
        next("a")
        next("l")
        next("s")
        next("e")
        return false
    }

    function parseNull() {
        next("n")
        next("u")
        next("l")
        next("l")
        return null
    }

    function parseArray() {
        let arr = []
        next("[")

        skipWhite()
        if (byte == "]") {
            next()
            return arr
        }

        while (true) {
            let r = parseValue()
            skipWhite()
            arr.push(r)
            if (byte == "]") {
                next()
                return arr
            }
            next(',')
        }

        throw "error"

    }


    let escape = {
        '"': '"',
        "/": "/",
        "\\": "\\",
        "b": "\b",
        "t": "\t",
        "r": "\r",
        "n": "\n",
        "f": "\f"
    }

    let numberParts = {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "-": "-",
    }

    function parseString() {
        let str = "";
        next("\"")


        while (byte != "\"") {

            if (byte == "\\") {
                next()
                if (byte == "u") {

                    let j = 0;

                    for (var i = 0; i < 4; i++) {
                        next()
                        let byte16 = parseInt(byte, 16)
                        if (isNaN(byte16)) {
                            throw "string error"
                        }
                        j = j * 16 + byte16
                    }

                    str += String.fromCharCode(j)


                } else if (escape[byte]) {
                    str += escape[byte]
                } else {
                    throw "string error"
                }

            } else {
                str += byte
            }

            next()

            if (byte == "") {
                throw "string error"
            }

        }

        next("\"")
        return str

    }

    function parseObject() {
        let obj = {}
        next("{")

        skipWhite()
        if (byte == "}") {
            next()
            return obj
        }

        while (true) {
            skipWhite()
            let key = parseString()
            skipWhite()
            next(":")
            let val = parseValue()
            skipWhite()
            obj[key] = val

            if (byte == "}") {
                next()
                return obj
            }
            next(",")
        }
    }

    let res = parseValue()
    skipWhite()
    if (byte != "") {
        throw "Error:no more"
    }

    return res

    function parseNumber() {
        let num = "";

        if (byte == "-") {
            num += '-'
            next()
            if (!(byte >= "0" && byte <= "9")) {
                throw "number error"
            }
        }
        if (byte == "0") {
            num += 0
            next()

        } else {
            while (byte >= "0" && byte <= "9") {
                num += byte
                next()
            }

        }

        if (byte == ".") {
            num += "."
            next()

            if (!(byte >= "0" && byte <= "9")) {
                throw "number error"
            }

            while (byte >= "0" && byte <= "9") {
                num += byte
                next()
            }
        }



        if (byte == "e" || byte == "E") {
            num += byte
            next()

            if (byte == "+" || byte == "-") {
                num += byte
                next()

            }

            if (byte < "0" || byte > "9") {
                throw "number error"
            }

            while (byte >= "0" && byte <= "9") {
                num += byte
                next()
            }
        }


        return Number(num)
    }
}

exports.parse = parse;