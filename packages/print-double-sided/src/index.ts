import { waitForElementMatch } from 'applescript-utils';

import { saveCurrentSettingsAsTemporaryPreset } from '~/utils/preset.js';

await waitForElementMatch('Preview', (element) =>
	element.path.some((part) => part.fullName.includes('sheet 1'))
);

await saveCurrentSettingsAsTemporaryPreset();
