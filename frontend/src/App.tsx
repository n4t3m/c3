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
	const [mlist, setMlist] = useState<mlist[]>([]);
	const [loaded, setLoaded] = useState(false);
	const [current, setCurrent] = useState({} as machine);
	const [totalTasks, setTotalTasks] = useState(0);

	useEffect(() => {
		axios
			.get(`http://citrusc2.tech/bot/allinfo`)
			.then((ms) => {
				console.log(`Got all info from server: ${JSON.stringify(ms.data)}`);
				setMlist(ms.data);
			})
			.catch((err) => console.log(`ERR: ${err}`));
	}, []);

	// TOOD GET ALL TASKS PENDING
	// {"machine_count":5,"scheduled_tasks_count":9}
	useEffect(() => {
		axios
			.get(`http://citrusc2.tech/stats`)
			.then((ms) => {
				console.log(`Got all stats from server: ${JSON.stringify(ms.data)}`);
				setTotalTasks(ms.data.scheduled_tasks_count);
			})
			.catch((err) => console.log(`ERR: ${err}`));
	});

	useEffect(() => {
		if (mlist === null) {
			return;
		}
		setLoaded((mlist.length === 0) === false);
	}, [mlist]);

	const changeCurrent = (i: number) => {
		axios
			.get(`http://citrusc2.tech/bot/hostinfo/${mlist[i].uuid}`)
			.then((ms) => {
				console.log('got', ms.data);
				setCurrent(ms.data);
			})
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
									totalTasks={totalTasks}
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
