import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate } from '../screenplay/interactions';
import {
	deleteButton,
	editButton,
	formulaInput,
	frenchNameInput,
	nameInput,
	submitButton,
	testButton
} from '../targets/distribution-keys';
import { deleteConfirmButton } from '../targets/form';

export const openDistributionKeys = Navigate.to('/config/distribution-keys');
export const openNewDistributionKey = Navigate.to('/config/distribution-keys/new');
export const openDistributionKeyEdit = (keyId: string) => Navigate.to(`/config/distribution-keys/${keyId}/edit`);

export const testFormula = (formula: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(formula).into(formulaInput), Click.on(testButton));

export const createDistributionKey = (name: string, formula: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(formula).into(formulaInput), Enter.theValue(name).into(nameInput), Click.on(submitButton));

export const createDistributionKeyInFrench = (name: string, formula: string, frenchName: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(frenchName).into(frenchNameInput), createDistributionKey(name, formula));

export const changeFormula = (name: string, formula: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(editButton(name)), Enter.theValue(formula).into(formulaInput), Click.on(submitButton));

export const deleteDistributionKey = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(deleteButton(name)), Click.on(deleteConfirmButton));
