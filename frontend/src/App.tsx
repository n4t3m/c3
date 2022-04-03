import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import axios from 'axios';

import CardView from './components/cardview';
import Header from './components/header';
import SidePanel from './components/sidepanel';
import { machine, mlist } from './components/interfaces.js';

function App() {
	// const [machines, setMachines] = useState<machine[] | null>(null);
	const [mlist, setMlist] = useState<mlist[]>([
		{
			hostname: 'hp',
			ip: '127.0.0.1',
			uuid: '02b0b7cc-342c-4f96-b1e7-469dbb4f57f5',
		},
		{
			hostname: 'hp',
			ip: '127.0.0.1',
			uuid: '6372d4b9-8480-40b9-af8c-d302d250b7cb',
		},
		{
			hostname: 'hp',
			ip: '127.0.0.1',
			uuid: '804f3e88-7de6-4e19-bf9c-cbb8f780771c',
		},
	]);
	const [loaded, setLoaded] = useState(true);
	const [current, setCurrent] = useState({} as machine);

	useEffect(() => {
		axios
			.get('/bot/allinfo/')
			.then((ms) => {
				console.log(`Got all info from server: ${ms.data}`);
				setMlist(ms.data);
			})
			.catch((err) => console.log(`ERR: ${err}`));
	}, []);

	useEffect(() => {
		if (mlist === null) {
			return;
		}
		// setLoaded((mlist.length === 0) === false);
	}, [mlist]);

	const changeCurrent = (i: number) => {
		axios
			.get(`http://citrusc2.tech/bot/hostinfo/${mlist[i].uuid}`)
			.then((ms) => setCurrent(ms.data))
			.catch((err) => {
				console.log(`ERR ${err}`);
			});
	};

	return (
		<>
			{loaded === false ? (
				<h1>Hold on, grabbing data!</h1>
			) : (
				<>
					<Container maxWidth={false}>
						<Header />
						<br />
						<Grid
							container
							direction='row'
							justifyContent='flex-start'
							alignItems='flex-start'
							wrap='nowrap'
							spacing={3}
						>
							<Grid item xs={5}>
								<SidePanel
									machines={mlist}
									totalTasks={15}
									type={'a'}
									changeCurrent={(i: number) => changeCurrent(i)}
								/>
							</Grid>
							<Grid item xs={11}>
								<CardView
									hostname='hugo'
									IP='127.0.0.1'
									cmdQueue={['ls', 'echo']}
									UUID={'uuid'}
									pollRate={5}
									changeFcn={() => {
										console.log('changed data');
										return true;
									}}
									status={true}
								/>
							</Grid>
							<Grid item xs={5}>
								<SidePanel
									machines={mlist}
									totalTasks={15}
									type={'s'}
									changeCurrent={(i: number) => changeCurrent(i)}
								/>
							</Grid>
						</Grid>
					</Container>
				</>
			)}
		</>
	);
}

export default App;
