// Enum for supported ARK games
export enum ArkGame {
	ASA = "ASA", // ARK: Survival Ascended
	ASE = "ASE", // ARK: Survival Evolved
}

// Table row data from the wiki
export interface TableRow {
	Variable: string;
	Description?: string;
	ASA?: boolean;
	ASE?: boolean;
	CMD?: boolean;
	DefaultValue?: string;
	ValueType?: string;
	[key: string]: any; // For any additional columns
}

// Table structure
export interface ParsedTable {
	header: string;
	table: TableRow[];
}

// File structure
export interface ConfigFile {
	filename: string;
	headers: ParsedTable[];
}

// Setting after transformation
export interface TransformedSetting {
	Variable: string;
	DefaultValue: string | "N/A";
	Description?: string;
}

// Program options
export interface ProgramOptions {
	game: ArkGame;
}
