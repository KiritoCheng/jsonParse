const json = require("./parse");

describe("parse litertual", () => {
    test("true", () => {
        expect((json.parse("true"))).toBe(true)
        expect((json.parse(" true \r"))).toBe(true)
        expect(() => { (json.parse("tru")) }).toThrow()
        expect(() => { (json.parse("true1")) }).toThrow()
    })

    test("false1", () => {
        expect(json.parse("false")).toBe(false)
        expect(json.parse("false\r\t ")).toBe(false)
        expect(() => { (json.parse("fals")) }).toThrow()
        expect(() => { (json.parse("false1")) }).toThrow()
    })

    test("null1", () => {
        expect(json.parse("null")).toBe(null)
        expect(json.parse("null   \n")).toBe(null)
        expect(() => { (json.parse("nul")) }).toThrow()
        expect(() => { (json.parse("null1")) }).toThrow()
    })

    test("number int1", () => {
        expect(json.parse("-0")).toBe(-0)
        expect(json.parse("11")).toBe(11)
        expect(() => json.parse("012")).toThrow()
        expect(() => json.parse("-012")).toThrow()
        expect(json.parse("-1")).toBe(-1)
        expect(json.parse("0")).toBe(0)
        expect(json.parse("-11")).toBe(-11)
        expect(json.parse("1234567890")).toBe(1234567890)

        expect(json.parse("1e1")).toBe(10)
        expect(json.parse("1.1e1")).toBe(11)
        expect(json.parse("1e+1")).toBe(10)
        expect(json.parse("1.1e+1")).toBe(11)

        expect(json.parse("100e-1")).toBe(10)
        expect(json.parse("110e-1")).toBe(11)
    })

    test("number float1", () => {
        expect(json.parse("-0.1")).toBe(-0.1)

        expect(() => json.parse("01.2")).toThrow()
        expect(() => json.parse("-01.2")).toThrow()

        expect(json.parse("-0.123456789")).toBe(-0.123456789)
        expect(json.parse("0.1")).toBe(0.1)
        expect(json.parse("0.123456789")).toBe(0.123456789)

        expect(json.parse("1.23e1")).toBe(12.3)
        expect(json.parse("1.24e+1")).toBe(12.4)
        expect(json.parse("1e-1")).toBe(0.1)

        expect(json.parse("110e-3")).toBe(0.11)
    })

    test("string1", () => {
        expect(json.parse('""')).toBe("")
        expect(json.parse('"12abc"')).toBe("12abc")
        expect(json.parse('"\\r\\n\\b\\t\\f\\"\\\\\\/"')).toBe("\r\n\b\t\f\"\\/")
        expect(json.parse('"\\u0031\\u0032\\u0033abc"')).toBe("123abc")
        expect(() => json.parse('"aa')).toThrow()
        expect(() => json.parse('"\\"')).toThrow()
        expect(() => json.parse('"\\uooiu"')).toThrow()
        expect(() => json.parse('"\\o"')).toThrow()
    })


    test("array1", () => {
        expect(json.parse('[1,2]')).toEqual([1, 2])
        expect(json.parse('[ ]')).toEqual([])
        expect(json.parse('[null, true, false, "123", 1 ]')).toEqual([null, true, false, "123", 1])
        expect(() => json.parse('[')).toThrow()
        expect(() => json.parse('[1, ]')).toThrow()


        expect(json.parse('[{"a":1}, {"a":2}, {"b":1, "c":{"d":3}}]')).toEqual([{ a: 1 }, { a: 2 }, { b: 1, c: { d: 3 } }])
    })

    test("object1", () => {
        expect(json.parse("{}")).toEqual({})
        expect(json.parse('{"a": 1}')).toEqual({ a: 1 })
        expect(json.parse('{"a": "1"}')).toEqual({ a: "1" })
        expect(json.parse('{"a": null}')).toEqual({ a: null })
        expect(json.parse('{"a": true}')).toEqual({ a: true })
        expect(json.parse('{"a": false}')).toEqual({ a: false })
        expect(json.parse('{"a": "null"}')).toEqual({ a: "null" })
        expect(json.parse('{"a": "true"}')).toEqual({ a: "true" })
        expect(json.parse('{"a": "false"}')).toEqual({ a: "false" })


        expect(() => json.parse('{')).toThrow()
        expect(() => json.parse('{a, "b":1}')).toThrow()
        expect(() => json.parse('{  "b":1,}')).toThrow()
        expect(() => json.parse('{a:1}')).toThrow()

        expect(json.parse('{"a": {"a": "a"}, "b":[1,2,3]}')).toEqual({ a: { a: "a" }, b: [1, 2, 3] })
    })
})