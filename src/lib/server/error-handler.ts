/**
 * Error Handling Utilities
 * Custom error types and standardized error responses for auth flows
 */

import { json } from '@sveltejs/kit';

/**
 * Base class for application errors
 */
export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code: string = 'INTERNAL_ERROR'
	) {
		super(message);
		this.name = this.constructor.name;
	}
}

/**
 * OAuth-related errors
 */
export class OAuthError extends AppError {
	constructor(
		message: string,
		public provider?: string,
		statusCode: number = 400
	) {
		super(message, statusCode, 'OAUTH_ERROR');
	}
}

/**
 * JWT-related errors
 */
export class JWTError extends AppError {
	constructor(message: string, statusCode: number = 401) {
		super(message, statusCode, 'JWT_ERROR');
	}
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
	constructor(
		message: string,
		public field?: string
	) {
		super(message, 400, 'VALIDATION_ERROR');
	}
}

/**
 * Authorization errors (different from authentication)
 */
export class AuthorizationError extends AppError {
	constructor(message: string = 'Access denied') {
		super(message, 403, 'AUTHORIZATION_ERROR');
	}
}

/**
 * Rate limit errors
 */
export class RateLimitError extends AppError {
	constructor(
		message: string = 'Too many requests',
		public retryAfter?: number
	) {
		super(message, 429, 'RATE_LIMIT_ERROR');
	}
}

/**
 * Standard error response format
 */
interface ErrorResponse {
	error: {
		code: string;
		message: string;
		details?: Record<string, unknown>;
	};
}

/**
 * Create a standardized JSON error response
 */
export function errorResponse(
	error: AppError | Error,
	details?: Record<string, unknown>
): Response {
	const isAppError = error instanceof AppError;
	const statusCode = isAppError ? error.statusCode : 500;
	const code = isAppError ? error.code : 'INTERNAL_ERROR';

	const body: ErrorResponse = {
		error: {
			code,
			message: error.message
		}
	};

	if (details) {
		body.error.details = details;
	}

	return json(body, { status: statusCode });
}

/**
 * Log level enum
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Structured log entry
 */
interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	context?: Record<string, unknown>;
	error?: {
		name: string;
		message: string;
		stack?: string;
	};
}

/**
 * Get current log level from environment
 */
function getLogLevel(): LogLevel {
	const level = process.env.LOG_LEVEL?.toLowerCase();
	if (level === 'debug' || level === 'info' || level === 'warn' || level === 'error') {
		return level;
	}
	return 'info';
}

/**
 * Check if a log level should be output
 */
function shouldLog(level: LogLevel): boolean {
	const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
	const currentLevel = getLogLevel();
	return levels.indexOf(level) >= levels.indexOf(currentLevel);
}

/**
 * Create a log entry
 */
function createLogEntry(
	level: LogLevel,
	message: string,
	context?: Record<string, unknown>,
	error?: Error
): LogEntry {
	const entry: LogEntry = {
		timestamp: new Date().toISOString(),
		level,
		message
	};

	if (context) {
		entry.context = context;
	}

	if (error) {
		entry.error = {
			name: error.name,
			message: error.message,
			stack: error.stack
		};
	}

	return entry;
}

/**
 * Logger with structured output
 */
export const logger = {
	debug(message: string, context?: Record<string, unknown>): void {
		if (shouldLog('debug')) {
			console.debug(JSON.stringify(createLogEntry('debug', message, context)));
		}
	},

	info(message: string, context?: Record<string, unknown>): void {
		if (shouldLog('info')) {
			console.info(JSON.stringify(createLogEntry('info', message, context)));
		}
	},

	warn(message: string, context?: Record<string, unknown>): void {
		if (shouldLog('warn')) {
			console.warn(JSON.stringify(createLogEntry('warn', message, context)));
		}
	},

	error(message: string, error?: Error, context?: Record<string, unknown>): void {
		if (shouldLog('error')) {
			console.error(JSON.stringify(createLogEntry('error', message, context, error)));
		}
	}
};

/**
 * Log OAuth flow events
 */
export function logOAuthEvent(
	event:
		| 'login_initiated'
		| 'callback_received'
		| 'token_exchanged'
		| 'profile_fetched'
		| 'login_complete'
		| 'login_failed',
	provider: string,
	details?: Record<string, unknown>
): void {
	logger.info(`OAuth: ${event}`, {
		provider,
		event,
		...details
	});
}

/**
 * Log auth errors with context
 */
export function logAuthError(
	error: Error,
	context: {
		operation: string;
		provider?: string;
		userId?: string;
	}
): void {
	logger.error(`Auth error: ${context.operation}`, error, context);
}

/**
 * Handle errors in request handlers
 * Returns a JSON response with appropriate status code
 */
export function handleRequestError(error: unknown, operation: string): Response {
	if (error instanceof AppError) {
		logAuthError(error, { operation });
		return errorResponse(error);
	}

	if (error instanceof Error) {
		logAuthError(error, { operation });
		return errorResponse(
			new AppError(
				process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
				500
			)
		);
	}

	logger.error(`Unknown error type in ${operation}`, undefined, { error: String(error) });
	return errorResponse(new AppError('An unexpected error occurred', 500));
}
