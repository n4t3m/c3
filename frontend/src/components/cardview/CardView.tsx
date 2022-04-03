import React, { useEffect } from 'react';

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

// import curM from '../../App';
// TODO
// drag commands in queue to reorder
// add loading bars for `submit command`
// post for updating poll rate

interface Props {
	hostname: string;
	IP: string;
	cmdQueue: string[];
	UUID: string;
	pollRate: number;
	changeFcn: (obj: any) => boolean;
	status: boolean;
}

export default function CardView({
	hostname,
	IP,
	cmdQueue,
	UUID,
	pollRate,
	changeFcn,
	status,
}: Props) {
	const [pr, setPR] = React.useState<number>(pollRate);
	const [cq, setCQ] = React.useState<string[]>(cmdQueue);
	const [newcmd, setNewCmd] = React.useState<string>('');
	const [openM, setOpenM] = React.useState<boolean>(false);
	const [paperBackground, setPaperBackground] = React.useState('#FFB463');

	const prChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPR(event.target.value === '' ? pr : Number(event.target.value));
	};

	const openModal = () => {
		setOpenM(!openM);
	};

	const submitCommand = () => {
		if (newcmd.trim() === '') {
			console.log('Cannot submit blank command');
		} else {
			console.log(`Submitting new command: ${newcmd}`);
		}
	};

	// useEffect(() => { changeFcn({}, [newcmd])

	// axios.get(/bot/info/uuid)

	return (
		<>
			<Dialog open={openM} onClose={openModal} scroll='paper'>
				<DialogTitle>Current Command Queue</DialogTitle>
				<DialogContent dividers={true}>
					<DialogContentText tabIndex={-1}>
						<List>
							{cq.map((c, i) => (
								<>
									<ListItem id={`${c}${i}`}>
										<ListItemText primary={`${i + 1}:\t${c}`} />
									</ListItem>
								</>
							))}
						</List>
					</DialogContentText>
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
							{hostname}
						</Typography>
						<Grid
							container
							rowSpacing={1}
							columnSpacing={{ xs: 1, sm: 2, md: 3 }}
						>
							<Grid item xs={6}>
								<Typography variant='h5' color='text.secondary' align='center'>
									{IP}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant='h5' color='text.secondary' align='center'>
									{UUID}
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
											value={pr}
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
						<Button variant='outlined' onClick={() => submitCommand()}>
							Submit Command
						</Button>
					</CardActions>
				</Card>
			</Paper>
		</>
	);
}
