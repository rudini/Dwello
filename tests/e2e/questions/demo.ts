import { Text, Visibility } from '../screenplay/questions';
import { pageSection } from '../targets/app-frame';
import { demoNotice } from '../targets/demo';

export const demoNoticeText = Text.of(demoNotice);
export const demoNoticeShown = Visibility.of(demoNotice);
export const sectionText = (heading: string) => Text.of(pageSection(heading));
