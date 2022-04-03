import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';

import { machine } from '../interfaces.js';

// import curM from '../../App';
// TODO
// drag commands in queue to reorder
// add loading bars for `submit command`
// post for updating poll rate

interface Props {
	// hostname: string;
	// IP: string;
	// cmdQueue: string[];
	// UUID: string;
	// poll_rate: number;
	// changeFcn: (obj: any) => boolean;
	// status: boolean;
	// loaded: boolean;
	mach: machine;
	submitCommand: (i: number, t: string) => void;
	status: boolean;
	loaded: boolean;
	num: number;
}

// https://stackoverflow.com/questions/45578844/how-to-set-header-and-options-in-axios

export default function CardView({
	mach,
	submitCommand,
	status,
	loaded,
	num,
}: Props) {
	const [m, setM] = useState(mach);
	// const [pr, setPR] = useState<number>(mach.poll_rate);
	// const [cq, setCQ] = useState<string[]>(mach.tasks);
	const [newcmd, setNewCmd] = useState<string>('');
	const [openM, setOpenM] = useState<boolean>(false);
	const [l, setL] = useState(loaded);
	const [paperBackground, setPaperBackground] = useState('#FFB463');

	const prChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// setPR(event.target.value === '' ? pr : Number(event.target.value));
		setM({
			hostname: mach.hostname,
			ip: mach.ip,
			os: mach.os,
			poll_rate:
				event.target.value === '' ? mach.poll_rate : Number(event.target.value),
			uuid: mach.uuid,
			status: true,
		} as machine);
	};

	const openModal = () => {
		setOpenM(!openM);
	};

	// const submitCommand = () => {
	// 	if (newcmd.trim() === '') {
	// 		console.log('Cannot submit blank command');
	// 	} else {
	// 		console.log(`Submitting new command: ${newcmd}`);
	// 		// const config = {
	// 		// 	headers: {
	// 		// 		uuid: `${UUID}`,
	// 		//     task
	// 		// 	},
	// 		// };

	// 		axios
	// 			.post(`http://citrusc2.tech/bot/push`, {
	// 				uuid: `${mach.UUID}`,
	// 				task: `${newcmd}`,
	// 			})
	// 			.then((ms) => {
	// 				console.log(JSON.stringify(ms));
	// 			})
	// 			.catch((err) => {
	// 				console.log(`ERR ${err}`);
	// 			});
	// 	}
	// };

	useEffect(() => {
		// if (pr === undefined || pr === null) return;
		// if (cq === undefined || cq === null) return;
		// setL(true);
		console.log('CardView loaded', JSON.stringify(m));
	}, []);

	return l === false ? (
		<>
			<h1>Grabbing data</h1>
		</>
	) : (
		<>
			<Dialog open={openM} onClose={openModal} scroll='paper'>
				<DialogTitle>Current Command Queue</DialogTitle>
				<DialogContent dividers={true}>
					{/* <DialogContentText tabIndex={-1}> */}
					<List>
						{mach.tasks === undefined ||
						mach.tasks === null ||
						mach.tasks.length === 0 ? (
							<>
								<h1>Queue is Empty</h1>
							</>
						) : (
							mach.tasks.map((c, i) => (
								<>
									<ListItem id={`${c}${i}`} key={`${c}${i}`}>
										<ListItemText primary={`${i + 1}:\t${c}`} />
									</ListItem>
								</>
							))
						)}
					</List>
					{/* </DialogContentText> */}
				</DialogContent>
				<DialogActions>
					<Button onClick={openModal}>Close</Button>
				</DialogActions>
			</Dialog>

			<Paper
				onMouseEnter={() => setPaperBackground('#FFB463')}
				onMouseLeave={() => setPaperBackground('#FFC500')}
			>
				<Card sx={{ backgroundColor: paperBackground }}>
					<CardContent>
						<Typography
							variant='h3'
							color='text.secondary'
							align='center'
							gutterBottom
						>
							{mach.hostname}
						</Typography>
						<Grid
							container
							rowSpacing={1}
							columnSpacing={{ xs: 1, sm: 2, md: 3 }}
						>
							<Grid item xs={6}>
								<Typography variant='h5' color='text.secondary' align='center'>
									{mach.ip}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant='h5' color='text.secondary' align='center'>
									{mach.uuid}
								</Typography>
							</Grid>
						</Grid>
						<FormGroup>
							<FormControlLabel
								control={status === true ? <Checkbox checked /> : <Checkbox />}
								disabled
								label={status === true ? 'Active!' : 'Inactive :('}
							/>
							<FormControlLabel disabled control={<Checkbox />} label='NUKE' />
							<FormControlLabel control={<Checkbox />} label='Reboot' />

							<Box sx={{ flexGrow: 1 }}>
								<Grid container spacing={1}>
									<Grid item xs>
										<Input
											value={mach.poll_rate}
											onChange={prChange}
											inputProps={{
												step: 1,
												min: 0,
												max: 10000,
												type: 'number',
											}}
										/>
									</Grid>
									<Grid item xs>
										<Typography align='center'>Poll Rate (seconds)</Typography>
									</Grid>
								</Grid>
							</Box>

							<TextField
								id='filled-basic'
								label='Command'
								variant='filled'
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setNewCmd(event.target.value)
								}
							/>
						</FormGroup>
					</CardContent>

					<CardActions
						sx={{ display: 'flex', justifyContent: 'space-between' }}
					>
						<Button variant='outlined' onClick={() => openModal()}>
							Command Queue
						</Button>
						<Button
							variant='outlined'
							onClick={() => submitCommand(num, newcmd)}
						>
							Submit Command
						</Button>
					</CardActions>
				</Card>
			</Paper>
		</>
	);
}
