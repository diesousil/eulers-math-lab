import InputMethod from "./InputMethod.js";
import Logger from "../common/Logger.js";
import * as shared from "../data/shared.js";

class MathExpression extends InputMethod {
    constructor() {
        super();
    }

    handleDoubleOperators(numbers, operators) {
        const doubleOperators = operators.map((operator, index) => operator[0].length > 1 ? index : undefined).filter(x => x != undefined);

        if (doubleOperators && doubleOperators.length > 0) {
            doubleOperators.forEach(index => {
                numbers[index + 1][0] = parseInt(operators[index][0].charAt(1) + "1") * numbers[index + 1][0];
                operators[index][0] = operators[index][0].charAt(0);
            });
        }
    }

    handleFirstCharOperator(numbers, operators, expression) {
        const isFirstCharOperator = (expression.charAt(0).match(shared.isOperatorRegex) != null);

        if (isFirstCharOperator) {
            operators.splice(0, 1);
            numbers[0][0] *= parseInt(expression.charAt(0) + "1");
        }

    }

    /**
     * Use this function to extract brackets used on function parameters delimitation. This brackets should be treated in a different way compared to brackets
     * which are used to define a subexpression. 
     * @param {string} expression numeric expression that may contain mathematical functions such as sin(k) , log(k,l) or root(k)
     * @returns 
     */
    getFunctionBrackets(expression) {
        const indexes = [];
        let match;

        while ((match = shared.isFunctionWithBracketRegex.exec(expression)) !== null) {
            let functionIndex = match.index;
            let openMarkerIndex;
            let closeMarkerIndex;
            let i = functionIndex;
            
            while(expression.charAt(i) != '(') {
                Logger.debug(expression.charAt(i));
                i++;
            }
            
            openMarkerIndex = i;
            let qtOpenMarker = 1;

            while(qtOpenMarker > 0) {

                i++;
                if(expression.charAt(i) == '(') {
                    qtOpenMarker+=1;
                } else if(expression.charAt(i) == ')') {
                    qtOpenMarker-=1;
                }
            }
            closeMarkerIndex = i;
            indexes.push(openMarkerIndex, closeMarkerIndex);
        }

        return indexes;
    }

    async solveFunctions(numbers, operators, functions, functionParameterMarkers, expression) {
        for (let i = 0; i < functions.length; i++) {
            let functionName = functions[i];
            const paramsQty = await this.retrieveParamsCount(functionName[0]);
            let paramValues = [];

            if(paramsQty > 0) {
                let openMarkerParamIndex = functionParameterMarkers[i*2];
                let closeMarkerParamIndex = functionParameterMarkers[i*2+1];
                let paramExpressions = shared.splitOutsideParentheses(expression.substring(openMarkerParamIndex+1, closeMarkerParamIndex));
                let paramExpressionProcessor = new MathExpression();

                for(let j=0;j<paramExpressions.length;j++) {                    
                    let paramValueResult = await paramExpressionProcessor.process({query: paramExpressions[j]});
                    paramValues.push(paramValueResult);
                    paramExpressionProcessor.resetMathFunction();
                }

                numbers = numbers.filter( (number) => number[1] < openMarkerParamIndex || number[1] > closeMarkerParamIndex  );
                operators = operators.filter( (operator) => operator[1] < openMarkerParamIndex || operator[1] > closeMarkerParamIndex  );
            }

            const result = await this.callMathFunction(paramValues);
            this.resetMathFunction();
            numbers.splice(0, 0, [result, functionName[1]]);
        }

        return [numbers, operators];
    }

    async solveOperations(numbers, operators) {
        while (operators.length > 0) {
            for (let i = 0; i < shared.operationsPriorityOrder.length; i++) {
                const operationsToCheck = shared.operationsPriorityOrder[i];

                let occurrences = [];
                do {
                    occurrences = operators.map((element, index) => operationsToCheck.includes(element[0][0]) ? index : undefined).filter(x => x != undefined);

                    if (occurrences && occurrences.length > 0) {

                        const opIndex = occurrences[0];
                        const operator = operators[opIndex][0];
                        const paramsQty = await this.retrieveParamsCount(operator);
                        const params = numbers.slice(opIndex, opIndex + paramsQty).map(x => 1 * x[0]);

                        const result = await this.callMathFunction(params);
                        this.resetMathFunction();

                        numbers[opIndex][0] = result;
                        numbers.splice(opIndex + 1, paramsQty - 1);
                        operators.splice(opIndex, 1);

                    }
                } while (occurrences.length > 0);
            }
        }
    }

    
    async solve(expression, functionParameterMarkers) {
        let numbers = shared.extractNumbers(expression);
        let operators = shared.extractOperators(expression);
        this.handleDoubleOperators(numbers, operators);
        this.handleFirstCharOperator(numbers, operators, expression);

        let functions = shared.extractFunctions(expression, functionParameterMarkers);
        [numbers, operators] = await this.solveFunctions(numbers, operators, functions, functionParameterMarkers, expression);
        await this.solveOperations(numbers, operators);


        return numbers.pop()[0];
    }

    async processExpression(expression) {
 
        if (shared.isSeparator(expression.charAt(0)) && shared.getCloseMarkerIndex(0, expression) == (expression.length - 1)) {
            expression = expression.substring(1, expression.length - 1);
        }

        let functionParameterMarkers = this.getFunctionBrackets(expression);
        let subexpressionaMarkers = [...expression].map((expressionChar, index) => (!functionParameterMarkers.includes(index) && shared.isSeparator(expressionChar) ? index : undefined)).filter(x => x != undefined);

        while (subexpressionaMarkers && subexpressionaMarkers.length > 0) {
 
            const openMarkerIndex = subexpressionaMarkers[0];
            const closeMarkerIndex = shared.getCloseMarkerIndex(openMarkerIndex, expression);
            const subExpresion = expression.substring(openMarkerIndex, closeMarkerIndex + 1);

            const partialResult = await this.processExpression(subExpresion);
 
            expression = expression.replace(subExpresion, partialResult);
            const expressionLengthDiff = (closeMarkerIndex - openMarkerIndex) - partialResult.toString().length + 1;
            subexpressionaMarkers = subexpressionaMarkers.filter(value => value < openMarkerIndex || value > closeMarkerIndex).map(value => value - expressionLengthDiff);
        }

        functionParameterMarkers = this.getFunctionBrackets(expression);

        return this.solve(expression, functionParameterMarkers);
    }

    async process(req) {
        const query = shared.addHiddenOperators(req.query);
        const finalResult = await this.processExpression(query);

        return finalResult;
    }
}

export default MathExpression;
