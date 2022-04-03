import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
