export interface machine {
	hostname: string;
	ip: string;
	os: 'linux' | 'Windows';
	tasks: string[];
	output?: [{ cmd: string; output: string; timestamp: string }];
	poll_rate: number;
	uuid: string;
	status: boolean;
}

export interface mlist {
	hostname: string;
	ip: string;
	uuid: string;
}
