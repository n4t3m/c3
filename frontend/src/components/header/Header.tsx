import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header() {
	const [back, setBack] = React.useState('#FFB463');

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position='static'
				sx={{ background: `${back}`, alignItems: 'center' }}
				onMouseEnter={() => setBack('#FFB463')}
				onMouseLeave={() => setBack('#FFC500')}
			>
				<Toolbar>
					<Typography variant='h5'>
						C3s : Citrus Command & Control server
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
