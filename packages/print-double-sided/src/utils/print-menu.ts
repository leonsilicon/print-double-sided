import { tellProcess } from 'applescript-utils';
import { outdent } from 'outdent';

export async function openPrintMenu() {
	await tellProcess(
		'Preview',
		outdent`
			set frontmost to true
			tell menu bar item "File" of menu bar 1
				click
				click menu item "Print…" of menu 1
			end tell
		`
	);
}
