import {jest} from '@jest/globals';
import MathExpression from "../../src/input/MathExpression";

let mathExpression = new MathExpression();

let expressionsToTest = [
    ["2+2",4],
    ["3*(2+2)",12],
    ["3(2+2)",12],
    ["3[12+200(3*2)]",3636],
    ["200+{100+[5*(3+2)]}-54/12-45*3*2^5",-3999.5],
    ["[3(3+4)-5]/[2*(3-1)+4]*[4*(5-3)+3]",22],
    ["(12-3)(45*7)",2835],
    ["10(12-3)(45*7)",28350],
    ["[10(12-3)-7(3^2*5*7)]-63",-2178],
    ["0.25*4",1],
    ["[10(12-3)-7(3^2*5*7)]-63-200+{100+[5.53*(3+2)]}-54/12-45*3*2^5.2+10(12-3)(45*10%*70)",21132.77310641281],
    ["3!",6],
    ["10!",3628800],
    ["5.5!",287.8852778150458],
    ["-5.1!",-142.45194406567865],
    ["10-3!",4],
    ["3!+2",8],
    ["3!^2",36],
    ["[10(12-3)-7(3^3!*5*7)]-63",-178578],
    ["10%*20",2],
    ["10%",0.1],
    ["-100%-1",-2],
];

for(let i=0;i<expressionsToTest.length;i++) {
    let tuple = expressionsToTest[i];

    test("Expresion "+tuple[0]+" = " + tuple[1], async () => {
        const data = await mathExpression.process({ query: tuple[0]});
        expect(data).toBe(tuple[1]);
    });
}