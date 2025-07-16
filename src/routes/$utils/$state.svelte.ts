import { browser } from '$app/environment';
import { setContext, getContext } from 'svelte';
import type { Theme, IAppContext, AppContextInit } from './$types';

class AppContext implements IAppContext {
	readonly #localthemekey = 'atm-theme';

	#theme = $state<Theme>('dark');
	#appheader = $state<string>('Army Team Management Online');

	constructor({ theme }: AppContextInit = {}) {
		if (browser) {
			const localtheme = localStorage.getItem(this.#localthemekey);
			this.theme = theme ?? (localtheme as Theme) ?? 'dark';
		}
	}

	get theme() {
		return this.#theme;
	}

	set theme(theme: Theme) {
		if (browser) {
			const root = document.documentElement;
			root.classList.remove('light', 'dark');
			root.classList.add(theme);
			localStorage.setItem(this.#localthemekey, theme);
		}
		this.#theme = theme;
	}

	toggletheme = () => {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
	};

	get appheader() {
		return this.#appheader;
	}

	set appheader(header: string) {
		this.#appheader = header ? `ATMO: ${header}` : 'Army Team Management Online';
	}
}

const AppContextKey = 'atmo.app.context';

export const setAppContext = (init?: AppContextInit) => {
	return setContext<AppContext>(AppContextKey, new AppContext(init));
};

export const useAppContext = () => {
	return getContext<AppContext>(AppContextKey);
};
