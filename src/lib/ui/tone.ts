import type { IconName } from './icons';

/** Semantic colour of a message or status; each comes with an icon so colour never speaks alone */
export type Tone = 'info' | 'positive' | 'caution' | 'critical' | 'neutral';

export const toneStyle: Record<Tone, { box: string; text: string; icon: IconName }> = {
	info: { box: 'bg-accent-soft border-accent', text: 'text-accent-strong', icon: 'info' },
	positive: { box: 'bg-positive-soft border-positive', text: 'text-positive', icon: 'success' },
	caution: { box: 'bg-caution-soft border-caution', text: 'text-caution', icon: 'warning' },
	critical: { box: 'bg-critical-soft border-critical', text: 'text-critical', icon: 'error' },
	neutral: { box: 'bg-sunken border-line-strong', text: 'text-ink', icon: 'info' }
};
