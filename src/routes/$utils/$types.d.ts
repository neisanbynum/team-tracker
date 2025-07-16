export type Theme = 'light' | 'dark';

export type IAppContext = {
	theme: Theme;
	toggletheme: () => void;
	appheader: string;
};

export type AppContextInit = {
	theme?: Theme;
};

