/**
 * Formula Service
 * Parsing and evaluation of custom distribution key formulas
 *
 * Supported variables:
 * - {area} - Apartment area in m²
 * - {rooms} - Number of rooms
 * - {volume} - Apartment volume (area * height estimate)
 * - {units} - Equal share per unit (1 for each apartment)
 */

/**
 * Supported formula variables
 */
export const FORMULA_VARIABLES = ['area', 'rooms', 'volume', 'units'] as const;
export type FormulaVariable = (typeof FORMULA_VARIABLES)[number];

/**
 * Variable values for formula evaluation
 */
export interface FormulaVariables {
	area: number;
	rooms: number;
	volume?: number;
	units?: number;
}

/**
 * Result of formula parsing
 */
export interface ParseResult {
	isValid: boolean;
	variables: FormulaVariable[];
	errors: string[];
	normalizedFormula: string;
}

/**
 * Result of formula evaluation
 */
export interface EvaluationResult {
	isValid: boolean;
	value: number;
	error?: string;
}

/**
 * Test case for formula testing
 */
export interface FormulaTestCase {
	label: string;
	variables: FormulaVariables;
}

/**
 * Result of formula test
 */
export interface FormulaTestResult {
	testCase: FormulaTestCase;
	result: EvaluationResult;
}

/**
 * Parse a formula and extract variables
 */
export function parseFormula(formula: string): ParseResult {
	const errors: string[] = [];
	const foundVariables: FormulaVariable[] = [];

	// Check for empty formula
	if (!formula || formula.trim().length === 0) {
		return {
			isValid: false,
			variables: [],
			errors: ['Bitte geben Sie eine Formel ein.'],
			normalizedFormula: ''
		};
	}

	// Normalize whitespace
	let normalizedFormula = formula.trim().replace(/\s+/g, ' ');

	// Extract all {variable} patterns
	const variablePattern = /\{([^}]+)\}/g;
	let match;
	const foundVariableNames: string[] = [];

	while ((match = variablePattern.exec(formula)) !== null) {
		const varName = match[1].toLowerCase().trim();
		foundVariableNames.push(varName);

		if (FORMULA_VARIABLES.includes(varName as FormulaVariable)) {
			if (!foundVariables.includes(varName as FormulaVariable)) {
				foundVariables.push(varName as FormulaVariable);
			}
		} else {
			errors.push(
				`Unbekannte Variable {${varName}}. Erlaubt sind {area}, {rooms}, {volume} und {units}.`
			);
		}
	}

	// Check that formula contains at least one variable
	if (foundVariableNames.length === 0) {
		errors.push(
			'Die Formel braucht mindestens eine Variable: {area}, {rooms}, {volume} oder {units}.'
		);
	}

	// Check for invalid characters (only allow numbers, operators, parentheses, and variables)
	const formulaWithoutVars = normalizedFormula.replace(/\{[^}]+\}/g, '1');
	const invalidChars = formulaWithoutVars.match(/[^0-9+\-*/().%\s]/g);
	if (invalidChars) {
		const uniqueChars = [...new Set(invalidChars)];
		errors.push(`Unzulässige Zeichen in der Formel: ${uniqueChars.join(' ')}`);
	}

	// Check for balanced parentheses
	let parenCount = 0;
	for (const char of normalizedFormula) {
		if (char === '(') parenCount++;
		if (char === ')') parenCount--;
		if (parenCount < 0) {
			errors.push('Die Formel schliesst eine Klammer, die nicht geöffnet wurde.');
			break;
		}
	}
	if (parenCount > 0) {
		errors.push('In der Formel fehlt eine schliessende Klammer.');
	}

	// Check for consecutive operators
	if (/[+\-*/]{2,}/.test(formulaWithoutVars.replace(/\s/g, ''))) {
		errors.push('Zwei Rechenzeichen folgen direkt aufeinander.');
	}

	// Check for division by zero potential (literal /0)
	if (/\/\s*0(?!\.)/.test(formulaWithoutVars)) {
		errors.push('Die Formel teilt durch null.');
	}

	// Normalize variable names to lowercase
	normalizedFormula = normalizedFormula.replace(/\{([^}]+)\}/g, (_, varName) => {
		return `{${varName.toLowerCase().trim()}}`;
	});

	return {
		isValid: errors.length === 0,
		variables: foundVariables,
		errors,
		normalizedFormula
	};
}

/**
 * Evaluate a formula with given variable values
 */
export function evaluateFormula(formula: string, variables: FormulaVariables): EvaluationResult {
	// Parse formula first
	const parseResult = parseFormula(formula);
	if (!parseResult.isValid) {
		return {
			isValid: false,
			value: 0,
			error: parseResult.errors.join('; ')
		};
	}

	// Check that all required variables have values
	for (const variable of parseResult.variables) {
		const value = variables[variable];
		if (value === undefined || value === null) {
			return {
				isValid: false,
				value: 0,
				error: `Der Wert für {${variable}} fehlt.`
			};
		}
	}

	// Replace variables with values
	let expression = parseResult.normalizedFormula;
	expression = expression.replace(/\{area\}/gi, String(variables.area));
	expression = expression.replace(/\{rooms\}/gi, String(variables.rooms));
	expression = expression.replace(/\{volume\}/gi, String(variables.volume ?? variables.area * 2.5)); // Default ceiling height
	expression = expression.replace(/\{units\}/gi, String(variables.units ?? 1));

	// Evaluate the expression safely
	try {
		// Remove any remaining non-math characters
		const safeExpression = expression.replace(/[^0-9+\-*/().%\s]/g, '');

		// Handle percentage operator
		const processedExpression = safeExpression.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');

		// Use Function constructor for safe evaluation (no access to global scope)
		const result = new Function(`return (${processedExpression})`)();

		if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
			return {
				isValid: false,
				value: 0,
				error: 'Die Formel ergibt keine gültige Zahl.'
			};
		}

		return {
			isValid: true,
			value: result
		};
	} catch (error) {
		return {
			isValid: false,
			value: 0,
			error: `Die Formel kann nicht berechnet werden: ${error instanceof Error ? error.message : 'unbekannter Fehler'}`
		};
	}
}

/**
 * Test a formula against multiple test cases
 */
export function testFormula(formula: string, testCases: FormulaTestCase[]): FormulaTestResult[] {
	return testCases.map((testCase) => ({
		testCase,
		result: evaluateFormula(formula, testCase.variables)
	}));
}

/**
 * Default test cases for formula validation
 */
export function getDefaultTestCases(): FormulaTestCase[] {
	return [
		{
			label: 'Kleine Wohnung (50 m², 2 Zimmer)',
			variables: { area: 50, rooms: 2, volume: 125, units: 1 }
		},
		{
			label: 'Mittlere Wohnung (80 m², 3.5 Zimmer)',
			variables: { area: 80, rooms: 3.5, volume: 200, units: 1 }
		},
		{
			label: 'Grosse Wohnung (120 m², 5 Zimmer)',
			variables: { area: 120, rooms: 5, volume: 300, units: 1 }
		}
	];
}

/**
 * Calculate distribution for a set of apartments using a formula
 */
export function calculateDistribution(
	formula: string,
	apartments: FormulaVariables[],
	totalAmount: number
): {
	isValid: boolean;
	distributions: { variables: FormulaVariables; share: number; amount: number }[];
	error?: string;
} {
	// Evaluate formula for each apartment
	const evaluations: { variables: FormulaVariables; value: number }[] = [];
	let totalValue = 0;

	for (const apt of apartments) {
		const result = evaluateFormula(formula, apt);
		if (!result.isValid) {
			return {
				isValid: false,
				distributions: [],
				error: `Die Formel kann für eine Wohnung nicht berechnet werden: ${result.error}`
			};
		}

		if (result.value < 0) {
			return {
				isValid: false,
				distributions: [],
				error: 'Die Formel ergibt einen negativen Wert.'
			};
		}

		evaluations.push({ variables: apt, value: result.value });
		totalValue += result.value;
	}

	// Handle edge case of zero total
	if (totalValue === 0) {
		return {
			isValid: false,
			distributions: [],
			error: 'Die Formel ergibt für alle Wohnungen null, so lassen sich keine Anteile berechnen.'
		};
	}

	// Calculate shares and amounts
	const distributions = evaluations.map((evaluation) => {
		const share = evaluation.value / totalValue;
		return {
			variables: evaluation.variables,
			share,
			amount: totalAmount * share
		};
	});

	return {
		isValid: true,
		distributions
	};
}

/**
 * Validate a formula is suitable for distribution calculations
 */
export function validateFormulaForDistribution(formula: string): {
	isValid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Parse formula
	const parseResult = parseFormula(formula);
	if (!parseResult.isValid) {
		return { isValid: false, errors: parseResult.errors, warnings };
	}

	// Test with default cases
	const testResults = testFormula(formula, getDefaultTestCases());

	for (const testResult of testResults) {
		if (!testResult.result.isValid) {
			errors.push(`${testResult.testCase.label}: ${testResult.result.error}`);
		} else if (testResult.result.value < 0) {
			errors.push(`Die Formel ergibt für die ${testResult.testCase.label} einen negativen Wert.`);
		} else if (testResult.result.value === 0) {
			warnings.push(`Die Formel ergibt für die ${testResult.testCase.label} null.`);
		}
	}

	// Check if formula produces reasonable distribution
	const testApts = getDefaultTestCases().map((tc) => tc.variables);
	const distribution = calculateDistribution(formula, testApts, 1000);

	if (!distribution.isValid) {
		errors.push(distribution.error ?? 'Die Verteilung kann nicht berechnet werden.');
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings
	};
}
