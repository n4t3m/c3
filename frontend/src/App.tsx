import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import CardView from './components/cardview';
import Header from './components/header';
import Container from '@mui/material/Container';
import { LineAxisOutlined } from '@mui/icons-material';

export interface curM {
	hostname: string,
	ip: string,
	cmdQueue: [string],
	uuid: string,
	pollRate: number,
}

function App() {
	// const [machines, setMachines] = React.useState<string[]>('');
	const [current, setCurrent] = useState({
		hostname: 'hugo',
		ip: '127.0.0.1',
		cmdQueue: ['ls', 'echo'],
		uuid: 'test',
		pollRate: 5
	})

	// useEffect(() => {
	// 	axios.get('/bot/info').then((ms) => {
	// 		setMachines(ms);
	// 	}).catch;
	// }, []);

	useEffect(() => { }, [current])

	return (
		<>
			<Container maxWidth={false}>
				<Header />
				<br />
				<Container maxWidth='sm'>
					{/* {machines.map((m) => {
					CardView(m.asdasdasd);
				})} */}
					{/* <Grid></Grid> */}
					<CardView
						hostname={current.hostname}
						IP={current.ip}
						cmdQueue={current.cmdQueue}
						UUID={current.uuid}
						pollRate={current.pollRate}
						changeFcn={(obj) => {
							setCurrent(obj);
							console.log('changed data');
							return true;
						}}
						status={true}
					/>
				</Container>
			</Container>
		</>
	);
}

export default App;
