import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position='static'
				sx={{ background: '#eba834', alignItems: 'center' }}
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
