const json = require("./parse");

describe("test json", () => {
    test("true", () => {
        expect(json.parse("true")).toBe(true)
        expect(json.parse(" true")).toBe(true)
        expect(json.parse(" \r\t\ntrue")).toBe(true)
        expect(json.parse("\r\t\n true \r\t\n   ")).toBe(true)

        expect(() => json.parse("t")).toThrow()
        expect(() => json.parse("tr ue")).toThrow()
        expect(() => json.parse("tru e")).toThrow()
        expect(() => json.parse("true1")).toThrow()
        expect(() => json.parse("true  1")).toThrow()
        expect(() => json.parse("true \r1")).toThrow()
    })


    test("false", () => {
        expect(json.parse("false")).toBe(false)
        expect(json.parse(" false")).toBe(false)
        expect(json.parse(" \r\t\nfalse")).toBe(false)
        expect(json.parse("\r\t\n false \r\t\n   ")).toBe(false)

        expect(() => json.parse("f")).toThrow()
        expect(() => json.parse("fa lse")).toThrow()
        expect(() => json.parse("fals e")).toThrow()
        expect(() => json.parse("false1")).toThrow()
        expect(() => json.parse("false  1")).toThrow()
        expect(() => json.parse("false \r1")).toThrow()
    })

    test("null", () => {
        expect(json.parse("null")).toBe(null)
        expect(json.parse(" null")).toBe(null)
        expect(json.parse(" \r\t\nnull")).toBe(null)
        expect(json.parse("\r\t\n null \r\t\n   ")).toBe(null)

        expect(() => json.parse("n")).toThrow()
        expect(() => json.parse("nu ll")).toThrow()
        expect(() => json.parse("ss")).toThrow()
        expect(() => json.parse("null1")).toThrow()
        expect(() => json.parse("null  1")).toThrow()
        expect(() => json.parse("null \r1")).toThrow()
        expect(() => json.parse("nsull")).toThrow()
    })

    test("array", () => {
        expect(json.parse("[]")).toEqual([])
        expect(json.parse("[[]]")).toEqual([[]])
        expect(json.parse("[[],[],[]]")).toEqual([[], [], []])
        expect(json.parse("[[true ],[],[]]")).toEqual([[true], [], []])
        expect(json.parse("[true]")).toEqual([true])
        expect(json.parse("[true,false,null]")).toEqual([true, false, null])
        expect(json.parse("[  \n\r true \n,  \n false  \n ,  \n null \n ]")).toEqual([true, false, null])

        expect(() => json.parse("[[]")).toThrow()
        expect(() => json.parse("[,]")).toThrow()
        expect(() => json.parse("[false,,true]")).toThrow()
        expect(() => json.parse("[,true]")).toThrow()
        expect(() => json.parse("[,true]]")).toThrow()
        expect(() => json.parse("[[,]")).toThrow()
        expect(() => json.parse("[[],]")).toThrow()
        expect(() => json.parse("[ \n\r false \n\r  ,  ]")).toThrow()

        expect(json.parse("[ ]")).toEqual([])
        expect(json.parse("[null]")).toEqual([null])
        expect(json.parse("[null, true   ,false]")).toEqual([null, true, false])
        expect(json.parse("[true,[null,false]]")).toEqual([true, [null, false]])
        expect(() => json.parse('[')).toThrow()
        expect(() => json.parse('[,,]')).toThrow()
        expect(() => json.parse('[false]]')).toThrow()
        expect(() => json.parse('[,null \r1,]')).toThrow()
        expect(() => json.parse('[nu,]')).toThrow()
        expect(() => json.parse('[[],]')).toThrow()
        expect(() => json.parse('[true,[]')).toThrow()
        expect(() => json.parse('\n[\t]y\t')).toThrow()

    })

    test("string", () => {

        expect(json.parse('"1233"')).toBe("1233")
        expect(json.parse('"  12343"')).toBe("  12343")
        expect(json.parse('"\\u0033 3"')).toBe("3 3")
        expect(json.parse('"\\n 0033 3"')).toBe("\n 0033 3")
        expect(json.parse('"\\\\"')).toBe("\\")

        expect(() => json.parse('"  123  3')).toThrow()
        expect(() => json.parse('"  123  3\"33 "')).toThrow()
        expect(() => json.parse('"\\s"')).toThrow()
        expect(() => json.parse('"\\ s"')).toThrow()
        expect(() => json.parse('"\\u 0033"')).toThrow()
        expect(() => json.parse('"\\"')).toThrow()
    })

    test("object", () => {
        expect(json.parse('{"key1":true  ,"key2":"yahaha"}')).toEqual({ "key1": true, "key2": "yahaha" })
        expect(json.parse('{"key1":["1","2","3"]  ,"key2":"yahaha"}')).toEqual({ "key1": ["1", "2", "3"], "key2": "yahaha" })
        expect(json.parse('{"key1":{"key1":true,"key2":[{"a":true,"b":false},"2","3"]}  ,"key2":"yahaha"}')).toEqual({ "key1": { "key1": true, "key2": [{ "a": true, "b": false }, "2", "3"] }, "key2": "yahaha" })

        expect(() => json.parse('{key1:true  ,"key2":"yahaha"}')).toThrow()
        expect(() => json.parse('{true:true  ,"key2":"yahaha"}')).toThrow()
        expect(() => json.parse('{true:  ,"key2":"yahaha"}')).toThrow()
        expect(() => json.parse('{ ,"key2":"yahaha"}')).toThrow()
        expect(() => json.parse('{: ,"key2":"yahaha"}')).toThrow()
        expect(() => json.parse('{}: ,"key2":"yahaha"}')).toThrow()
        expect(() => json.parse('{}{: ,"key2":"yahaha"}')).toThrow()

        expect(() => json.parse('{"key1":{{"key1":true,"key2":[{"a":true,"b":false},"2","3"]}  ,"key2":"yahaha"}')).toThrow()
        expect(() => json.parse('{"key1":{{"key1":true,"key2":{[{"a":true,"b":false}, "2","3"]}  , "key2":"yahaha"}')).toThrow()
    })

    test("number", () => {

        expect(json.parse('0')).toBe(0)
        expect(json.parse('123')).toBe(123)
        expect(json.parse('11.11')).toBe(11.11)
        expect(json.parse('-123')).toBe(-123)
        expect(json.parse('0.123')).toBe(0.123)
        expect(json.parse('-0.123')).toBe(-0.123)
        expect(json.parse('123e+1')).toBe(1230)
        expect(json.parse('1.23e+1')).toBe(1.23e+1)
        expect(json.parse('123e001')).toBe(1230)
        expect(json.parse('1.1e+3345')).toEqual(Infinity)

        expect(() => json.parse('-')).toThrow()
        expect(() => json.parse('-.')).toThrow()
        expect(() => json.parse('-e')).toThrow()
        expect(() => json.parse('-.e')).toThrow()
        expect(() => json.parse('.')).toThrow()
        expect(() => json.parse('1.23 e+')).toThrow()
        expect(() => json.parse('1 23')).toThrow()
        expect(() => json.parse('1.23e+a')).toThrow()
        expect(() => json.parse('0123')).toThrow()
        expect(() => json.parse('00')).toThrow()
        expect(() => json.parse('00.23')).toThrow()
        expect(() => json.parse('0.2.3')).toThrow()
        expect(() => json.parse('0e')).toThrow()
        expect(() => json.parse('123e')).toThrow()
        expect(() => json.parse('1.e')).toThrow()
        expect(() => json.parse('123e2+2')).toThrow()
        expect(() => json.parse('-123e')).toThrow()
        expect(() => json.parse('-123e+2.1e')).toThrow()
        expect(() => json.parse('123e+')).toThrow()
        expect(() => json.parse('123e+0+e')).toThrow()
        expect(() => json.parse('-0.1e+g')).toThrow()
    })

})