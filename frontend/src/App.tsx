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
	const [currI, setCurrI] = useState(0);
	const [currHist, setCurrHist] = useState({
		cmd_output: '',
		timestamp: '',
	} as any);
	const [totalTasks, setTotalTasks] = useState(0);
	const [isLoaded, setIsLoaded] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		axios
			.get(`http://citrusc2.tech/bot/allinfo`) //
			.then((ms) => {
				console.log(`Got all info from server: ${JSON.stringify(ms.data)}`);
				setMlist(ms.data);
			})
			.catch((err) => {
				console.log(`ERR: ${err}`);
				setMlist([]);
			});
	}, []);

	useEffect(() => {
		axios
			.get(`http://citrusc2.tech/stats`)
			.then((ms) => {
				console.log(`Got all stats from server: ${JSON.stringify(ms.data)}`);
				setTotalTasks(ms.data.scheduled_tasks_count);
			})
			.catch((err) => {
				console.log(`ERR: ${err}`);
				setTotalTasks(0);
			});
	}, []);

	useEffect(() => {
		if (mlist === null) {
			return;
		}
		setLoaded((mlist.length === 0) === false);
		if (mlist.length !== 0) changeCurrent(0);
	}, [mlist]);

	useEffect(() => {
		console.log('isloaded:', isLoaded);
	}, [isLoaded]);

	useEffect(() => {
		console.log('NEW Current history for', currHist);
		setIsLoaded(currHist === undefined || currHist === null ? false : true);
	}, [currHist]);

	useEffect(() => {
		console.log('curr:', current);
		if (current === undefined) return;
		axios
			.get(`http://citrusc2.tech/bot/hostcmdhist/${current.uuid}`)
			.then((ms) => {
				console.log('curr defined', current, ms.data.history);
				// if (ms.data.history === undefined || ms.data.history === null) {
				// 	setCurrHist([]);
				// } else {
				setCurrHist(ms.data.history);
				// }
			})
			.catch((err) => {
				console.log(`ERR ${err}`);
				setCurrHist([]);
			});
	}, [current]);

	const changeCurrent = (i: number) => {
		axios
			.get(`http://citrusc2.tech/bot/hostinfo/${mlist[i].uuid}`)
			.then((ms) => {
				console.log('got', ms.data);
				setCurrent(ms.data);
				setCurrI(i);
			})
			.catch((err) => {
				console.log(`ERR ${err}`);
				setCurrI(0);
			});
	};

	const submitCommand = (i: number, t: string) => {
		if (t.trim() === '') {
			console.log('Cannot submit blank command');
			return;
		} else {
			console.log(`Submitting new command: ${t}`);
		}

		axios
			.post(
				`http://citrusc2.tech/bot/push`,
				{},
				{
					headers: {
						uuid: `${mlist[i].uuid}`,
						task: `${t}`,
						'content-type': 'text/json',
					},
				}
			)
			.then((ms) => {
				console.log(JSON.stringify(ms));
				setSuccess(true);
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
								{isLoaded === false ? (
									<></>
								) : (
									<CardView
										mach={current}
										submitCommand={(i: number, t: string) =>
											submitCommand(i, t)
										}
										status={true}
										loaded={isLoaded}
										num={currI}
										h={currHist}
									/>
								)}
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
