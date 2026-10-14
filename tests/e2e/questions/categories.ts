import { Count, Enabled, Text, Visibility } from '../screenplay/questions';
import { allowedBadge, categoryRow, deleteButton, description, usage } from '../targets/categories';

export const categoryListed = (name: string) => Visibility.of(categoryRow(name));
export const listedCategoriesNamed = (name: string) => Count.of(categoryRow(name));
export const allowance = (name: string) => Text.of(allowedBadge(name));
export const invoicesOf = (name: string) => Text.of(usage(name));
export const categoryDeletable = (name: string) => Enabled.of(deleteButton(name));
export const descriptionOf = (name: string) => Text.of(description(name));
