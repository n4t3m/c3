import React from 'react';
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
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { machine, mlist } from '../interfaces.js';

// total machines
// total tasks queued

interface Props {
	machines: mlist[]; //  | null;
	totalTasks: number;
	// a == all
	// s == summary
	type: 'a' | 's';
	changeCurrent: (i: number) => void;
}

export default function SidePanel({
	machines,
	totalTasks,
	type,
	changeCurrent,
}: Props) {
	const [paperBackground, setPaperBackground] = React.useState('#FFB463');
	const [mach, setMachs] = React.useState(machines);
	const [nm, setNMs] = React.useState(machines.length);
	const [tt, setTT] = React.useState(totalTasks);
	const [t, setT] = React.useState(type);

	return (
		<>
			<Paper
				onMouseEnter={() => setPaperBackground('#FFB463')}
				onMouseLeave={() => setPaperBackground('#FFC500')}
				sx={{ width: 1 }}
			>
				<Card sx={{ backgroundColor: paperBackground }}>
					<CardContent>
						{t === 'a' ? (
							<>
								<Typography color='text.secondary' align='center' gutterBottom>
									Machines
								</Typography>
								<Divider />

								<List>
									{machines === null ? (
										<></>
									) : (
										machines.map((m, i) => (
											<>
												<ListItem alignItems='center' key={`${m.hostname}${i}`}>
													<Button onClick={() => changeCurrent(i)} fullWidth>
														<ListItemText
															primary={m.hostname}
															secondary={m.ip}
														/>
													</Button>
												</ListItem>
												<Divider />
											</>
										))
									)}
								</List>
							</>
						) : (
							<>
								<Typography color='text.secondary' align='center' gutterBottom>
									Summary
								</Typography>
								<Divider />
								<List>
									<ListItem>
										<ListItemText primary='Total Tasks' secondary={`${tt}`} />
									</ListItem>
									<Divider />
									<ListItem>
										<ListItemText
											primary='Total Machines'
											secondary={`${nm}`}
										/>
									</ListItem>
									<Divider />
								</List>
							</>
						)}
					</CardContent>
				</Card>
			</Paper>
		</>
	);
}
