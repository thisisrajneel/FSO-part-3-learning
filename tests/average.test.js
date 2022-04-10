const average = require('../utils/for_testing').average

describe('average', () => {
    test('average of [1]', () => {
        expect(average([1])).toBe(1)
    })

    test('average of []', () => {
        expect(average([])).toBe(0)
    })

    test('average of [1,2,3,4,5]', () => {
        expect(average([1,2,3,4,5])).toBe(3)
    })
})