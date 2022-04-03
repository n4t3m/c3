export interface machine {
	hostname: string;
	ip: string;
	os: 'Linux' | 'Windows';
	cmdQueue: string[];
	output: [{ cmd: string; output: string; timestamp: string }];
	pollRate: number;
	UUID: string;
	status: boolean;
}

export interface mlist {
	hostname: string;
	ip: string;
	uuid: string;
}
